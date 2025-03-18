/*
 *
 *
 */

import fs from "fs";
import { fileURLToPath } from "url";
import youtubesearchapi from "youtube-search-api";
import { callModel, retry, extractContent } from "./agent-utils.js";

const flattenTopics = (outline) => {
  let result = [];

  for (const section of outline) {
    result = [
      ...result,
      ...(section.topics.map((topic) => ({
        ...topic,
        chapterTitle: section.title,
      })) || []),
    ];
  }

  return result;
};

const getVideos = (keyword) => {
  return youtubesearchapi
    .GetListByKeyword(keyword, false, 10, [{ type: "video" }])
    .then((response) => {
      const videos = response.items.map((item) => ({
        videoId: item.id,
        videoTitle: item.title,
        channelTitle: item.channelTitle,
        thumbnails: item.thumbnail.thumbnails.map(({ url }) => url),
        duration: item.length.simpleText,
      }));
      return videos;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

async function appendToProgressFile(folderPath, newProgress) {
  let existingData = [];
  try {
    const fileContent = await fs.promises.readFile(
      `${folderPath}/topic-progress.json`,
      "utf8",
    );
    existingData = JSON.parse(fileContent);
    if (!Array.isArray(existingData)) {
      existingData = [existingData]; // Handle the case where progress.json contains a single object instead of an array of object
    }
  } catch (error) {
    // If the file doesn't exist or is empty or invalid, start with an empty array
    if (error.code !== "ENOENT") {
      console.error(
        "Error reading or parsing progress.json, starting with empty array:",
        error,
      );
    }
    existingData = [];
  }

  console.log("New topic added to topic-progress.json", newProgress);
  const combinedData = [...existingData, newProgress];

  try {
    await fs.promises.writeFile(
      `${folderPath}/topic-progress.json`,
      JSON.stringify(combinedData, null, 2),
    );
  } catch (error) {
    console.error("Error writing to topic-progress.json:", error);
    throw error; // Re-throw so the main function knows about the failure
  }
}
async function getLastIndexFromProgressFile(folderPath) {
  try {
    const fileContent = await fs.promises.readFile(
      `${folderPath}/topic-progress.json`,
      "utf8",
    );
    let existingData = JSON.parse(fileContent);

    if (!Array.isArray(existingData)) {
      existingData = [existingData]; // Handle the case where progress.json contains a single object instead of an array of objects
    }

    if (existingData.length > 0) {
      // Remove duplicates based on filename
      const uniqueData = [];
      const filenames = new Set();
      for (const item of existingData) {
        if (item.filename && !filenames.has(item.filename)) {
          uniqueData.push(item);
          filenames.add(item.filename);
        }
      }
      existingData = uniqueData;

      console.log(`Continuing from index ${existingData.length}...`);
      return existingData.length;
    } else {
      console.log("Starting from scratch [0]...");
      return 0;
    }
    // eslint-disable-next-line
  } catch (error) {
    console.log("Starting from scratch [1]...");
    return 0;
  }
}

async function readImageAltsJson(folderPath) {
  try {
    const content = await fs.promises.readFile(
      `${folderPath}/image-alts.json`,
      "utf8",
    );
    return JSON.parse(content);
  } catch (error) {
    console.error("Error reading image-alts.json:", error);
    return {};
  }
}

function mergeImagesWithPageNumbers(imageAltsData, pageStart, pageEnd) {
  const allImages = [];

  // Process only pages within the specified range
  for (const pageNum in imageAltsData) {
    const pageNumber = parseInt(pageNum, 10);

    // Skip pages outside our range
    if (pageNumber < pageStart || pageNumber > pageEnd) {
      continue;
    }

    // Get all images for this page
    const imagesOnPage = imageAltsData[pageNum] || [];

    // Add page number to each image and add to our result array
    imagesOnPage.forEach((image) => {
      allImages.push({
        src: image.src,
        alt: image.alt,
        page: pageNumber,
      });
    });
  }

  return allImages;
}

async function processImagesForLLM(folderPath, imageInfo) {
  const processedImageParts = [];

  for (const image of imageInfo) {
    try {
      // Extract the filename from the src path
      const filename = image.src.split("/").pop();
      const imagePath = `${folderPath}/images/${filename}`;

      // Check if the file exists
      try {
        await fs.promises.access(imagePath, fs.constants.R_OK);
        // eslint-disable-next-line
      } catch (error) {
        console.warn(`Image file not accessible: ${imagePath}`);
        continue;
      }

      // Read the file
      const imageBuffer = await fs.promises.readFile(imagePath);

      // Create the part object in the format expected by callModel
      processedImageParts.push({
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: getImageMimeType(filename),
        },
      });

      console.log(`Loaded image: ${filename} for the LLM`);
    } catch (error) {
      console.error(`Error processing image ${image.src}:`, error);
    }
  }

  return processedImageParts;
}

// Helper function to determine MIME type
function getImageMimeType(filename) {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

const main = async () => {
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const folderPath = process.argv[2];
    let count = process.argv[3] || 0;

    if (!folderPath) {
      console.log("Usage:   node gen-slides.js course-id (count)");
      console.log("Output:  course-id/topic-progress.json");
      console.log("         course-id/topics/{topic-filename}.html");
      return;
    }

    console.log("Topic script as started...");
    const imageAltsData = await readImageAltsJson(folderPath);

    try {
      await fs.promises.mkdir(`${folderPath}/topics`, { recursive: true });
    } catch (error) {
      console.error("Error creating topics folder:", error);
      throw error;
    }

    const flatOutline = flattenTopics(
      JSON.parse(await fs.promises.readFile(`${folderPath}/outline.json`)),
    );
    const textbookContent = await fs.promises.readFile(
      `${folderPath}/textbook-clean.txt`,
      "utf8",
    );

    console.log(`Total flattened topics: ${flatOutline.length}`);

    count = count || flatOutline.length;
    const startingIndex = await getLastIndexFromProgressFile(folderPath);
    for (let i = startingIndex; i < count; i++) {
      console.log("------------------");
      const imgInfo = mergeImagesWithPageNumbers(
        imageAltsData,
        flatOutline[i].pageStart,
        flatOutline[i].pageEnd,
      );
      const llmImages = processImagesForLLM(folderPath, imgInfo);
      const content = extractContent(
        textbookContent,
        flatOutline[i].pageStart,
        flatOutline[i].pageEnd,
      );
      const prompt = `
${preprompt}
TOPIC INFO => TOPIC TITLE: ${flatOutline[i].title}; PARENT TOPIC: ${flatOutline[i].chapterTitle}
AVAILABLE IMAGES:
${imgInfo.length == 0 ? "No images for this slide" : JSON.stringify(imgInfo, null, 2)}

RAW TEXTBOOK TOPIC TEXT EXTRACT: ${content}
`;

      const topicObject = await callModel(prompt, {
        json: true,
        images: llmImages.length > 0 ? llmImages : undefined,
      });
      topicObject.videos = await retry(() =>
        getVideos(topicObject.youtubeKeywords),
      );

      // Save topic with updated metadata
      await appendToProgressFile(folderPath, flatOutline[i]);

      await fs.promises.writeFile(
        `${folderPath}/topics/${flatOutline[i].filename}.json`,
        JSON.stringify(topicObject, null, 2),
      );
      console.log(
        "Output written to topics/" + flatOutline[i].filename + ".json",
      );
    }
  }
};
main();

const preprompt = `
  You are an expert slide content creator specializing in concise, presentation-ready academic material.

  Your task:
  1. Create a JSON structure with metadata and slides for the topic below.
  2. Design slides that are visual, concise, and presentation-friendly.
  3. Incorporate the images provided with this prompt in your slides.

  OUTPUT FORMAT:
  Respond with ONLY a valid JSON object containing:
  {
    "difficulty": number,        // 1-10 scale based on complexity
    "duration": number,          // minutes to comprehend
    "bloomsLevels": string[],    // from: [memorize, conceptual, steps, logic, analysis, create]
    "flexibility": string[],     // one of: [must-read, essential, optional]
    "confidence": number,        // 1-10 scale on completeness
    "confidenceRemark": string,  // limitations explanation
    "pageStart": number,         // from topic info
    "pageEnd": number,           // from topic info
    "funfacts": string[],        // 4 attention-grabbing, mind-blowing facts
    "youtubeKeywords": string,   // search terms for related videos
    "slides": [                  // array of slide objects
      {
        "slideTitle": string,    // concise slide title
        "slideContent": string   // HTML content following structure rules
      }
    ]
  }

  HTML ELEMENTS FOR slideContent:
  - <h2> for section headers
  - <p> for concise text (2-3 sentences max)
  - <ul>/<ol> with <li> for bullet points; do not use <li> when there is only one item
  - <div class="definition"> for key terms
  - <div class="note"> for important points
  - <div class="example"> for examples
  - <span class="math-inline"> for inline math
  - <div class="math-display"> for equations
  - <pre><code> for code snippets
  - <strong> for critical emphasis
  - <em> for secondary emphasis
  - <u> for underlining
  - <table>, <th>, <tr>, <td> for tabular data
  - <hr> for major section breaks
  - <br> for minimal line breaks
  - <img src="..." alt="..." /> for images

  IMAGE USAGE:
  - The images shown to you are the same as those listed in AVAILABLE IMAGES
  - Images are listed in order from first to last in AVAILABLE IMAGES section
  - Reference images by their src value in the AVAILABLE IMAGES list
  - Use appropriate images where they enhance understanding of the topic
  - The inclusion of provided images is not mandatory, use your judgement.

  KEY REQUIREMENTS:
  1. FOCUS: Adhere strictly to the topic below.
  2. VISUAL: Favor lists, tables, and images over paragraphs.
  3. COMPLETENESS: Cover all essential aspects of the topic.
  4. SHORT FIRST AND LAST SLIDES: Make the first and last slides shorter than the rest.
  5. BALANCED LENGTH: Aim for a balanced distribution of slide lengths.
  6. NO UNNECESSARY MENTIONS: No need to mention publishers or anything related
`;
