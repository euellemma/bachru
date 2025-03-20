This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
agents/
  .eslintrc.cjs
  agent-utils.js
  extract-pdf.js
  gen-outline.js
  gen-quiz.js
  gen-slides.js
  mini-outline.js
  oldstuff.js
  package.json
  parse-exams.js
  sampleing
public/
  intro.html
src/
  lib/
    components/
      ui/
        avatar/
          avatar-fallback.svelte
          avatar-image.svelte
          avatar.svelte
          index.ts
        button/
          button.svelte
          index.ts
        card/
          card-content.svelte
          card-description.svelte
          card-footer.svelte
          card-header.svelte
          card-title.svelte
          card.svelte
          index.ts
        checkbox/
          checkbox.svelte
          index.ts
        command/
          command-dialog.svelte
          command-empty.svelte
          command-group.svelte
          command-input.svelte
          command-item.svelte
          command-link-item.svelte
          command-list.svelte
          command-separator.svelte
          command-shortcut.svelte
          command.svelte
          index.ts
        dialog/
          dialog-content.svelte
          dialog-description.svelte
          dialog-footer.svelte
          dialog-header.svelte
          dialog-overlay.svelte
          dialog-title.svelte
          index.ts
        input/
          index.ts
          input.svelte
        label/
          index.ts
          label.svelte
        popover/
          index.ts
          popover-content.svelte
        progress/
          index.ts
          progress.svelte
        radio-group/
          index.ts
          radio-group-item.svelte
          radio-group.svelte
        select/
          index.ts
          select-content.svelte
          select-group-heading.svelte
          select-item.svelte
          select-scroll-down-button.svelte
          select-scroll-up-button.svelte
          select-separator.svelte
          select-trigger.svelte
        separator/
          index.ts
          separator.svelte
        skeleton/
          index.ts
          skeleton.svelte
        textarea/
          index.ts
          textarea.svelte
    mycomps/
      Combobox.svelte
      Question.svelte
    api.ts
    mock.ts
    myutils.ts
    state.svelte.ts
    utils.ts
  routes/
    Course.svelte
    Exitexam.svelte
    Home.svelte
    IntroFour.svelte
    IntroOne.svelte
    IntroThree.svelte
    IntroTwo.svelte
    MainScreen.svelte
    Matric.svelte
    MatricSubjects.svelte
    Module.svelte
    News.svelte
    PastExams.svelte
    PostQuiz.svelte
    QuestType.svelte
    Quiz.svelte
    Report.svelte
    SearchCourse.svelte
    SelectCourses.svelte
    SelectTopics.svelte
    Settings.svelte
    StudyPlan.svelte
    Topic.old.svelte
    Topic.svelte
  app.css
  App.svelte
  config.ts
  main.ts
  types.d.ts
  vite-env.d.ts
.gitignore
components.json
eslint.config.js
index.html
mynotes.md
package.json
postcss.config.js
README.md
svelte.config.js
tailwind.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: agents/.eslintrc.cjs
````
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
````

## File: agents/agent-utils.js
````javascript
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const openrkey =
  "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";
const model = "google/gemini-2.0-flash-001";

function findMaxPage(textbookContent) {
  let maxPage = 0;
  let found = false;
  const pagePattern = /<!--\s*page\s*(\d+)\s*-->/gi; // Case-insensitive and global

  let match;
  while ((match = pagePattern.exec(textbookContent)) !== null) {
    found = true;
    const pageNum = parseInt(match[1], 10);
    if (isNaN(pageNum)) {
      console.warn("Invalid page number found:", match[1]);
      continue;
    }

    maxPage = Math.max(maxPage, pageNum);
  }

  if (!found) {
    throw new Error("No Pages Found");
  }

  return maxPage;
}

export function extractContent(textbookContent, pageStart, pageEnd) {
  let maxPage = findMaxPage(textbookContent);
  const adjustedStart = Math.max(1, Math.min(pageStart - 1, maxPage));
  const adjustedEnd = Math.min(maxPage, Math.max(pageEnd + 1, 1));
  const startMarkerPattern = new RegExp(
    `<!--\\s*page\\s*${adjustedStart}\\s*-->`,
    "gi",
  );
  const endMarkerPattern = new RegExp(
    `<!--\\s*page\\s*${adjustedEnd}\\s*-->`,
    "gi",
  );

  let startPos = -1;
  let endPos = -1;
  let startMatch;
  if ((startMatch = startMarkerPattern.exec(textbookContent)) !== null) {
    startPos = startMatch.index;
  }
  let endMatch;
  if ((endMatch = endMarkerPattern.exec(textbookContent)) !== null) {
    endPos = endMatch.index + endMatch[0].length;
  }

  if (startPos === -1 || endPos === -1) {
    throw new Error("Could not find specified page markers");
  }

  // Extract the content between markers
  const extractedContent = textbookContent.substring(startPos, endPos);
  return extractedContent;
}

export async function retry(asyncFn, maxRetries = 7, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) {
        throw error; // Re-throw the error if all retries failed
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function retryJsonParse(asyncFn, maxAttempts = 5, delayMs = 2000) {
  let attempts = 0;

  const tryParse = async () => {
    let result;
    try {
      attempts++;

      // Run the provided async function
      result = await asyncFn();

      // Try to parse the result as JSON
      const parsed = JSON.parse(result);
      return parsed;
    } catch (error) {
      const randomFilename = `attempt${attempts}-${Math.random().toString(36).substring(7)}.json`;
      fs.writeFileSync(randomFilename, result);
      console.log(
        `Attempt ${attempts} failed: ${error.message}; written to ${randomFilename}`,
      );

      // If we haven't exceeded max attempts, wait and try again
      if (attempts < maxAttempts) {
        console.log(`Retrying in ${delayMs / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        console.log("Retrying now...");
        return tryParse();
      }

      // If we've exceeded max attempts, throw the error
      throw new Error(`Failed to parse JSON after ${maxAttempts} attempts`);
    }
  };

  return tryParse();
}

export const callModel = (prompt, { json, images }) =>
  json
    ? retryJsonParse(() => callGemini(prompt, { json, images }))
    : retry(() => callGemini(prompt, { json, images }));

// Keep track of API requests to enforce rate limiting
let lastRequestTime = 0;
const MAX_REQUESTS_PER_MINUTE = 10; // Configurable RPM limit
const MINUTE_MS = 60 * 1000; // Milliseconds in a minute

export async function callGemini(prompt, { json, images }) {
  // Rate limiting logic
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minTimeBetweenRequests = MINUTE_MS / MAX_REQUESTS_PER_MINUTE;

  // If we need to wait to maintain rate limit
  if (timeSinceLastRequest < minTimeBetweenRequests) {
    const waitTime = minTimeBetweenRequests - timeSinceLastRequest;
    console.log(
      `Rate limiting: Waiting ${Math.round(waitTime)}ms to maintain ${MAX_REQUESTS_PER_MINUTE} RPM`,
    );
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  // Update last request time
  lastRequestTime = Date.now();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAnC3ptwWNPzlpnzATVsKNC-sFpo0FMtSk",
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = json
    ? {
        maxOutputTokens: 80000,
        responseMimeType: "application/json",
      }
    : {
        maxOutputTokens: 80000,
      };

  try {
    const parts = [{ text: prompt }];
    if (images && images.length > 0) {
      parts.push(...images);
    }

    const startTime = Date.now();
    const result = await model.generateContent({
      contents: [{ parts }],
      generationConfig,
    });
    const timeTook = Date.now() - startTime;

    const { promptTokenCount, candidatesTokenCount, totalTokenCount } =
      result.response.usageMetadata;

    const formatTokens = (n) => `${(n / 1000).toFixed(3)}K`;

    console.log(
      `Tokens: ${formatTokens(totalTokenCount)} (${formatTokens(promptTokenCount)} + ${formatTokens(candidatesTokenCount)}) | Time: ${timeTook}ms`,
    );

    return result.response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
````

## File: agents/extract-pdf.js
````javascript
// DO NOT REMOVE THIS THE COMMENT BELOW
// pdftohtml -noframes -nodrm -s -fmt png input.pdf output.html
//
// Image extraction process:
// 1. run img extraction command
// 2. go through the directory searching for png files and create an object
// 3. call gemini for a description of each image
// 4. save the description to a json file with saving and progress tracking on a different file;
//
// The files will be saved in { [page number]: array of { alt, width, height, src }} with alt being the description from gemini

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { JSDOM } from "jsdom";
import { callModel } from "./agent-utils.js";

async function extractAndDescribeImages(pdfFilePath) {
  try {
    // Extract folder name without extension
    const folderName = pdfFilePath.replace(/\.[^/.]+$/, "");

    // Create output directory if it doesn't exist
    const outputDir = path.join(folderName, "images");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define paths for tracking files
    const resultsFilePath = path.join(folderName, "image-alts.json");
    const progressFilePath = path.join(folderName, "image-progress.json");

    console.log(`Extracting images from ${pdfFilePath}...`);

    // 1. Run image extraction command
    const extractionCmd = `pdfimages -p -png ${pdfFilePath} ${path.join(outputDir, "img")}`;
    execSync(extractionCmd);
    console.log("Image extraction completed.");

    // Load existing progress if it exists
    let progress = {};
    let results = {};
    if (fs.existsSync(progressFilePath)) {
      progress = JSON.parse(fs.readFileSync(progressFilePath, "utf8"));
    }
    if (fs.existsSync(resultsFilePath)) {
      results = JSON.parse(fs.readFileSync(resultsFilePath, "utf8"));
    }

    // 2. Find all PNG files and create an object
    const imageFiles = fs
      .readdirSync(outputDir)
      .filter((file) => file.endsWith(".png"))
      .sort((a, b) => {
        // Sort files numerically by extracting the numbers from the filename
        const numA = parseInt(a.match(/(\d+)/g)[0]);
        const numB = parseInt(b.match(/(\d+)/g)[0]);
        return numA - numB;
      });

    console.log(`Found ${imageFiles.length} images.`);

    // Extract page numbers from filenames - adjusting regex as needed for pdfimages output format
    // The pattern may vary based on how pdfimages names files
    const pageRegex = /img-(\d+)/;

    // 3. Process each image with Gemini
    for (const file of imageFiles) {
      const filePath = path.join(outputDir, file);

      // Skip if already processed
      if (progress[file]) {
        console.log(`Skipping ${file} (already processed)`);
        continue;
      }

      // Get image dimensions
      const dimensions = getImageDimensions(filePath);

      // Extract page number using regex
      const pageMatch = file.match(pageRegex);
      const pageNumber = pageMatch ? pageMatch[1] : "unknown";

      console.log(`Processing image ${file} from page ${pageNumber}...`);

      // Get description from Gemini using callModel from agent-utils
      const description = await getImageDescriptionWithCallModel(filePath);

      // Create or update the page entry in results
      if (!results[pageNumber]) {
        results[pageNumber] = [];
      }

      // Add image info to results
      results[pageNumber].push({
        alt: description,
        width: dimensions.width,
        height: dimensions.height,
        src: file,
      });

      // Update progress
      progress[file] = true;

      // Save progress after each image
      fs.writeFileSync(progressFilePath, JSON.stringify(progress, null, 2));
      fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));

      console.log(`Saved description for ${file}`);
    }

    console.log("Image extraction and description complete!");
    return results;
  } catch (error) {
    console.error("Error in image extraction process:", error);
    throw error;
  }
}

// Helper function to get image dimensions
function getImageDimensions(filePath) {
  try {
    // Use ImageMagick's identify command to get dimensions
    const output = execSync(`identify -format "%w %h" "${filePath}"`)
      .toString()
      .trim();
    const [width, height] = output.split(" ").map(Number);
    return { width, height };
  } catch (error) {
    console.warn(`Could not get dimensions for ${filePath}: ${error.message}`);
    return { width: 0, height: 0 };
  }
}

// Function to get image description using callModel
async function getImageDescriptionWithCallModel(imagePath) {
  try {
    // Read the image file
    const imageData = fs.readFileSync(imagePath);

    // Convert to base64
    const base64Image = imageData.toString("base64");

    // Prepare image for callModel
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png",
      },
    };

    const prompt =
      "Describe this image concisely and accurately with no more than 5 sentences. Focus on the main elements visible in the image.";

    // Call the model with image
    const description = await callModel(prompt, {
      json: false,
      images: [imagePart],
    });

    return description.trim();
  } catch (error) {
    console.error(`Error getting description: ${error.message}`);
    return "Image description unavailable";
  }
}

function cleanHtml(htmlString) {
  // Extended HTML entities mapping
  const entityMap = {
    "&nbsp;": " ",
    "&#160;": " ",
    "&ensp;": " ",
    "&emsp;": " ",
    "&thinsp;": " ",
    "&zwnj;": "",
    "&zwj;": "",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hyphen;": "‐",
    "&hellip;": "…",
    "&iexcl;": "¡",
    "&iquest;": "¿",
    "&laquo;": "«",
    "&raquo;": "»",
    "&cent;": "¢",
    "&pound;": "£",
    "&euro;": "€",
    "&yen;": "¥",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&plusmn;": "±",
    "&times;": "×",
    "&divide;": "÷",
    "&frasl;": "⁄",
    "&eacute;": "é",
    "&iacute;": "í",
    "&oacute;": "ó",
    "&uacute;": "ú",
    "&ntilde;": "ñ",
    "&deg;": "°",
    "&sect;": "§",
    "&para;": "¶",
    "&micro;": "µ",
  };

  // Replace all HTML entities
  for (const [entity, char] of Object.entries(entityMap)) {
    htmlString = htmlString.replace(new RegExp(entity, "g"), char);
  }

  const dom = new JSDOM(htmlString);
  const doc = dom.window.document;

  let result = "";

  function hasAllowedAncestor(node) {
    const allowedTags = ["DIV", "SPAN", "P", "A"];
    let current = node.parentNode;

    while (
      current &&
      current.nodeName !== "BODY" &&
      current.nodeName !== "HTML"
    ) {
      if (allowedTags.includes(current.nodeName.toUpperCase())) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  function processNode(node) {
    // Keep Page comments
    if (node.nodeType === 8) {
      if (node.textContent.includes("Page")) {
        result += `<!-- ${node.textContent} -->\n`;
      }
      return;
    }

    // For text nodes, check if they're within allowed tags
    if (node.nodeType === 3 && hasAllowedAncestor(node)) {
      const text = node.textContent.trim();
      if (text) {
        result += text + "\n";
      }
      return;
    }

    // Process all child nodes
    Array.from(node.childNodes).forEach(processNode);
  }

  processNode(doc.documentElement);

  // Clean up multiple newlines and trim
  return result.replace(/\n\s*\n/g, "\n").trim();
}

// Function to read from a file
function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    return null;
  }
}

// Function to write to a file
function writeFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, data, "utf8");
  } catch (err) {
    console.error(`Error writing to file: ${err}`);
  }
}

const main = async () => {
  const inputFilePath = process.argv[2];

  // Check if input and output file paths are provided
  if (!inputFilePath) {
    console.log("Usage:   node extract.js course-id.pdf");
    console.log(
      "Output:  course-id/{page-n.html, textbook.html, textbook-clean.txt, image-alts.json}",
    );
    return;
  }

  // Extract folder name without extension
  const folderName = inputFilePath.replace(/\.[^/.]+$/, "");

  // Create folder if it doesn't exist
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
    console.log(`Created folder: ${folderName}`);
  }

  console.log("Starting PDF to HTML conversion...");
  execSync(
    `pdftohtml -noframes -nodrm -s -i ${inputFilePath} ${folderName}/textbook.html`,
  );
  console.log(`Created raw HTML convert: ${folderName}/textbook.html`);

  execSync(
    `pdftohtml -c -dataurls -zoom 2.25 ${inputFilePath} ${folderName}/page`,
  );
  console.log(`Created paged HTML convert: ${folderName}/page-{n}.html`);
  execSync(`find ${folderName}/ -name "*.png" -type f -delete`);
  console.log(`Deleted all PNG files in: ${folderName}/`);

  // Read the HTML content from the input file
  console.log("Processing HTML content...");
  const originalHtml = readFile(`${folderName}/textbook.html`);

  if (originalHtml) {
    // Clean the HTML
    console.log("Cleaning HTML content...");
    const cleanedHtml = cleanHtml(originalHtml);

    // Write the cleaned HTML to the specified output file
    writeFile(`${folderName}/textbook-clean.txt`, cleanedHtml);
    console.log(`Created clean HTML convert: ${folderName}/textbook-clean.txt`);
  }

  // Extract and describe images
  console.log("Starting image extraction and description process...");
  console.log("This may take some time depending on the number of images.");
  try {
    const imageResults = await extractAndDescribeImages(inputFilePath);
    console.log(
      `Successfully processed ${Object.keys(imageResults).length} pages containing images.`,
    );
    console.log(`Image descriptions saved to: ${folderName}/image-alts.json`);
  } catch (error) {
    console.error("Error during image extraction and description process:");
    console.error(error.message);
    console.log("PDF text extraction completed, but image processing failed.");
  }

  console.log("PDF extraction process completed!");
};

main();

// function cleanHtml(htmlString) {
//   // 1. Parse the HTML string into a DOM tree
//   const dom = new JSDOM(htmlString);
//   const doc = dom.window.document;

//   // 2. Remove <style> tags (embedded styles)
//   const styleTags = doc.querySelectorAll("style");
//   styleTags.forEach((tag) => tag.parentNode.removeChild(tag));

//   // 3. Remove title tags
//   const titleTag = doc.querySelector("title");
//   if (titleTag) {
//     titleTag.parentNode.removeChild(titleTag);
//   }

//   // 4. Remove meta tags
//   const metaTags = doc.querySelectorAll("meta");
//   metaTags.forEach((tag) => tag.parentNode.removeChild(tag));

//   // 5. Clean attributes of body
//   if (doc.body) {
//     doc.body.removeAttribute("bgcolor");
//     doc.body.removeAttribute("vlink");
//     doc.body.removeAttribute("link");
//   }

//   function stripTagsExceptImgAndPages(node) {
//     // Check for comment nodes (nodeType === 8)
//     if (node.nodeType === 8) {
//       // Comment node
//       // Keep comment if it contains the word 'Page'
//       if (node.textContent.includes("Page")) {
//         return `<!--${node.textContent}-->`;
//       }
//       return ""; // Remove other comments
//     }

//     if (node.nodeType === 3) {
//       // Text node
//       return node.textContent.replace(/\s+/g, " ").trim();
//     }
//     if (node.nodeName.toLowerCase() === "img") {
//       return node.outerHTML;
//     }
//     let result = "";
//     for (let child of node.childNodes) {
//       result += stripTagsExceptImgAndPages(child);
//     }
//     return result;
//   }

//   // Apply the stripping function to body
//   if (doc.body) {
//     doc.body.innerHTML = stripTagsExceptImgAndPages(doc.body);
//   }

//   // 8. Serialize the cleaned DOM back into an HTML string
//   return dom.serialize();

// function cleanHtml(htmlString) {
//   const dom = new JSDOM(htmlString);
//   const doc = dom.window.document;

//   // Remove unwanted elements
//   const unwantedTags = ["style", "meta", "title"];
//   unwantedTags.forEach((tag) => {
//     const elements = doc.querySelectorAll(tag);
//     elements.forEach((el) => el.remove());
//   });

//   // Clean body attributes
//   if (doc.body) {
//     doc.body.removeAttribute("bgcolor");
//     doc.body.removeAttribute("vlink");
//     doc.body.removeAttribute("link");
//   }

//   // Process all elements
//   function processNode(node) {
//     if (node.nodeType === 8) {
//       // Comment node
//       if (!node.textContent.includes("Page")) {
//         node.remove();
//       }
//       return;
//     }

//     // Skip if it's text node or img
//     if (node.nodeType === 3 || node.nodeName.toLowerCase() === "img") {
//       return;
//     }

//     // Process children
//     Array.from(node.childNodes).forEach((child) => {
//       processNode(child);
//     });

//     // If not a div, p, or img, replace with its contents
//     if (
//       !["div", "p", "img", "body", "html"].includes(node.nodeName.toLowerCase())
//     ) {
//       while (node.firstChild) {
//         node.parentNode.insertBefore(node.firstChild, node);
//       }
//       node.remove();
//     }
//   }

//   processNode(doc.documentElement);

//   return dom.serialize();
````

## File: agents/gen-outline.js
````javascript
import fs from "fs";
import { fileURLToPath } from "url";
import { callModel } from "./agent-utils.js";

function fixDuplicateFilenames(obj) {
  const fileNameCounts = new Map();

  function processObject(item) {
    if (Array.isArray(item)) {
      return item.map((element) => processObject(element));
    }

    if (typeof item === "object" && item !== null) {
      const newObj = {};

      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          if (key === "filename") {
            const originalName = item[key];
            const count = fileNameCounts.get(originalName) || 0;
            fileNameCounts.set(originalName, count + 1);

            if (count > 0) {
              console.log(`Found duplicate: ${originalName}`);
              const nameParts = originalName.split(".");
              if (nameParts.length > 1) {
                const ext = nameParts.pop();
                newObj[key] = `${nameParts.join(".")} (${count}).${ext}`;
              } else {
                newObj[key] = `${originalName} (${count})`;
              }
            } else {
              newObj[key] = originalName;
            }
          } else {
            newObj[key] = processObject(item[key]);
          }
        }
      }
      return newObj;
    }

    return item;
  }

  const result = processObject(obj);
  return result;
}

const outlinePrompt = `
You are an expert course outline architect converting textbook content into structured learning paths for PowerPoint presentations, where each Chapter matches with a chapter based on the textbook outline and content and where each Topic must yield 5-10 slides. Break content into large, cohesive segments within textbook-defined chapters, define scope, estimate density, and create clear reference IDs.

Create a "for slides creation" course outline from the textbook content that will be given at the end of this prompt following:

1. OUTPUT STRUCTURE
interface Chapter { title, filename, pageStart, pageEnd, topics }
interface Topic { title, filename, paragraphs, pageStart, pageEnd }
- Output array of Chapter objects
- topics is an array of Topic objects (no nesting beyond this)

2. STRUCTURAL RULES
- Chapter objects should match textbook outline chapter structure while Topic objects are decided by their content-richness to fulfill the 5-10 slide requirement. Therefore the Chapters highly depend on the textbook while the Topic objects are dependent on your segmentation.
- Short titles from content but the words should be meaningful and not abbrevations
- Use <!-- Page n --> for page ranges only
- Within each Chapter, each Topic MUST span 5-12 paragraphs (or 3-5 pages) for 5-10 slides; aggressively merge all related content to meet this
- No standalone small Topics allowed; combine even loosely related material within chapter bounds
- Exclude questions, exercises, summaries (including chapter-end), glossaries, references, optional/supplementary content
- Estimate paragraphs per topic (tables/lists as paragraph equivalents)

3. FILENAME RULES
- Kebab-case, max 30 chars, unique
- Use abbreviations: intro, mgmt, sys, db, prog, dev, impl, arch, app, struct, algo, config, anal, fund, prin, tech ...etc
- Remove common words: the, and, or, of, to, for, in, on, at
- Max 3-4 key terms

4. OUTPUT FORMAT
- Valid JSON
- Flat structure (Chapter → topics only)
- All Topics with pageStart/pageEnd

Respond with raw JSON only
TEXT CONTENT:

  `;

export const main = async () => {
  // Run as CLI if called directly
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const folderPath = process.argv[2];

    if (!folderPath) {
      console.log("Usage:   node gen-outline.js course-id ");
      console.log("Output:  course-id/outline.json");

      console.log("course-id is both the id and folder path from extract.js");
      return;
    }

    const text = fs.readFileSync(`${folderPath}/textbook-clean.txt`, "utf8");
    console.log("Input file read successfully");
    console.log("Model creating outline...");

    const userPrompt = `${outlinePrompt} ${text}`;
    const rawOutline = await callModel(userPrompt, { json: true });
    const outline = fixDuplicateFilenames(rawOutline);

    fs.writeFileSync(
      `${folderPath}/outline.json`,
      JSON.stringify(outline, null, 2),
    );

    const totalTopics = outline.reduce(
      (sum, chapter) => sum + (chapter.topics ? chapter.topics.length : 0),
      0,
    );
    console.log(
      `Total of ${totalTopics} written to ${folderPath}/outline.json`,
    );
  }
};

main();
````

## File: agents/gen-quiz.js
````javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { callModel, extractContent } from "./agent-utils.js";

const htmlRules = `
CONTENT FORMATTING RULES:

Heading Structure:
<h1> - Main topic title only
<h2> - Major section divisions
<h3> - Subsection headings
Maintain strict hierarchy; no skipping levels

Content Containers:
<p> - Standard paragraphs
<div> and <span> with classes:
- class="definition" - Formal term definitions
- class="example" - Illustrative examples
- class="note" - Tips, important points, warnings

Mathematical Content:
<span class="math-inline"> - For inline mathematics
<div class="math-display"> - For displayed equations
[Use combination of LaTeX and unicode; ensure proper delimiters]

Code Sections:
<pre><code class="language-[name]"> - For code snippets
[Always specify language; ensure proper formatting]

List Structures:
<ul> - Unordered lists (concepts, points)
<ol> - Ordered lists (steps, procedures)
<li> - List items
[Maintain proper nesting for complex multi-level lists; use appropriate type]

Text Emphasis:
<strong> - Critical emphasis
<em> - Secondary emphasis
<u> - Underlining
[Use sparingly and meaningfully]

Special Elements:
<blockquote> - Significant quotes or key points
<table>, <th>, <tr>, <td> - Tabular data
<hr> - Major section breaks

* Make sure to output valid parsable RAW JSON; DO NOT ADD new lines without closing double quotes first!

Generate NUMBER_OF_QUESTIONS questions based on this content:

TOPIC_CONTENT

`;

// Prompt for generating multiple-choice questions
const multipleChoicePrompt = `
You are an expert quiz generator for educational content. Create multiple-choice questions based on the provided topic content.
Each question should:
1. Be clear and concise
2. Have exactly 4 options
3. Have only one correct answer
4. Include a brief explanation for the correct answer
5. Be challenging but fair for students studying this material

For each question, provide:
- A clear question statement
- 4 answer options
- The correct answer (as the index of the correct option, starting from 0)
- A brief explanation of why the correct answer is right

Format your response as a JSON array of question objects with this structure:
[
  {
    "metadata": {
      "courseId": "COURSE_ID",
      "topic": "TOPIC_FILENAME",
      "difficulty": 3,
      "questionType": "multiple-choice",
      "src": "gen",
      "confidence": 0.9,
      "confidenceRemark": "Generated from textbook content",
      "correctAnswer": 0
    },
    "hint": "<div class="hint">Brief hint to guide students</div>",
    "solution": "<div class="solution">
      <p>Explanation of why the first option is correct</p>
      <ul>
        <li>Key point 1</li>
        <li>Key point 2</li>
      </ul>
    </div>",
    "question": "<div class="question-text">Question text goes here?</div>",
    "options": [
      "<div class=\"option-content\">Correct option with potential <strong>formatting</strong> or <span class=\"math-inline\">formulas</span></div>",
      "<div class=\"option-content\">Second option</div>",
      "<div class=\"option-content\">Third option</div>",
      "<div class=\"option-content\">Fourth option</div>"
    ]
  }
]

${htmlRules}`;

// Prompt for generating true/false questions
const trueFalsePrompt = `
You are an expert quiz generator for educational content. Create true/false questions based on the provided topic content.
Each question should:
1. Be clear and concise
2. Be definitively true or false based on the content
3. Include a brief explanation for the correct answer
4. Avoid ambiguous statements

For each question, provide:
- A clear statement that is either true or false
- The correct answer (just "true" or "false")
- A brief explanation of why the statement is true or false

Format your response as a JSON array of question objects with this structure:
[
  {
    "metadata": {
      "courseId": "COURSE_ID",
      "topic": "TOPIC_FILENAME",
      "difficulty": 3,
      "questionType": "true-false",
      "src": "gen",
      "confidence": 0.9,
      "confidenceRemark": "Generated from textbook content",
      "correctAnswer": "true"
    },
    "hint": "<div class="hint">Brief hint to guide students</div>",
    "solution": "<div class="solution">
      <p>Explanation of why the statement is true/false</p>
      <ul>
        <li>Supporting evidence 1</li>
        <li>Supporting evidence 2</li>
      </ul>
    </div>",
    "question": "<div class="question"> <div class="question-text">Statement that is true or false goes here.</div> </div>"
  }
]
${htmlRules}

  `;

// Prompt for generating workout/open-ended questions
const workoutPrompt = `
You are an expert quiz generator for educational content. Create workout/open-ended questions based on the provided topic content.
Each question should:
1. Require deeper understanding and application of concepts
2. Challenge students to demonstrate their knowledge
3. Include a detailed solution that shows the steps to solve the problem
4. Be appropriate for the difficulty level of the course
5. Include both mathematical problems AND short-answer conceptual questions

For each question, provide:
- A clear problem statement that requires either:
  a) Working out a mathematical/technical solution, OR
  b) Writing a short answer explaining a concept, comparing ideas, or analyzing a situation
- A detailed step-by-step solution or model answer
- A brief hint to guide students without giving away the answer

Format your response as a JSON array of question objects with this structure:
[
  {
    "metadata": {
      "courseId": "COURSE_ID",
      "topic": "TOPIC_FILENAME",

      "difficulty": 4,
      "questionType": "workout",
      "subType": "mathematical" | "conceptual",
      "src": "gen",
      "confidence": 0.85,
      "confidenceRemark": "Generated from textbook content",
      "correctAnswer": null
    },
    "hint": "<div class="hint">Brief hint to guide students</div>",
    "solution": "<div class="solution">
      <h3>Solution Approach</h3>
      <ol>
        <li>Step 1 explanation</li>
        <li>Step 2 explanation</li>
        <li>Final step and conclusion</li>
      </ol>
      <div class="note">Important observations or key takeaways</div>
    </div>",
    "question": "<div class="question">
      <div class="question-text">
        <p>Detailed problem statement goes here.</p>
        <div class="example">Example or context if needed</div>
        <div class="math-display">Mathematical expressions if needed</div>
      </div>
    </div>"
  }
]

${htmlRules}
`;

// Function to determine question distribution based on topic context
async function determineQuestionDistributionForTopic(topic, parentTitle) {
  const distributionPrompt = `
You are an expert educational content strategist. Based on the topic and its parent section, determine an appropriate distribution of question types for a comprehensive quiz bank.
Consider:
1. The nature of the content (theoretical, practical, mathematical, etc.)
2. The best way to thoroughly assess understanding of this specific topic
3. The typical assessment patterns for this type of content
4. The need for varied question types while maintaining quality
5. The maximum limit of 50 total questions per topic

Topic Title: ${topic.title}
Parent Section: ${parentTitle}

For theoretical topics, emphasize conceptual understanding through a balanced mix of multiple choice, true/false, and short-answer workout questions.
For practical/applied topics, focus on multiple choice and workout questions that test both knowledge and application.
For mathematical topics, include mathematical workout problems while maintaining sufficient multiple choice questions to test theoretical understanding.

Respond with a JSON object containing:
{
  "distribution": {
    "multiple-choice": number,
    "true-false": number,
    "workout": number     //  mix of mathematical and short-answer
  },
  "explanation": "Brief explanation of why this distribution is appropriate and how it ensures comprehensive coverage of the topic"
}

IMPORTANT: The total number of questions MUST NOT exceed 50 per topic. Aim for a total between 20-50 questions depending on the topic's complexity and scope.
`;

  try {
    const result = await callModel(distributionPrompt, { json: true });
    console.log(
      `Distribution rationale for ${topic.title}: ${result.explanation}`,
    );
    return result.distribution;
  } catch (error) {
    console.error(`Error determining question distribution: ${error.message}`);
    // Fallback to default distribution if model call fails
    return {
      "multiple-choice": 20,
      "true-false": 10,
      workout: 5,
    };
  }
}

// Function to generate questions for a specific topic
async function generateQuestionsForTopic(
  courseId,
  topic,
  textContent,
  questionCounts,
) {
  console.log(`Generating questions for topic: ${topic.title}`);
  // Extract the actual courseId from the path (last part)
  const actualCourseId = courseId.split("/").pop();
  const questions = [];
  // Generate multiple-choice questions
  if (questionCounts["multiple-choice"] > 0) {
    const mcPrompt = multipleChoicePrompt
      .replace("COURSE_ID", actualCourseId)
      .replace("TOPIC_FILENAME", topic.filename)
      .replace("NUMBER_OF_QUESTIONS", questionCounts["multiple-choice"])
      .replace("TOPIC_CONTENT", textContent);

    try {
      const mcQuestions = await callModel(mcPrompt, { json: true });
      questions.push(...mcQuestions);
      console.log(`Generated ${mcQuestions.length} multiple-choice questions`);
    } catch (error) {
      console.error(
        `Error generating multiple-choice questions: ${error.message}`,
      );
    }
  }
  // Generate true/false questions
  if (questionCounts["true-false"] > 0) {
    const tfPrompt = trueFalsePrompt
      .replace("COURSE_ID", actualCourseId)
      .replace("NUMBER_OF_QUESTIONS", questionCounts["true-false"])
      .replace("TOPIC_FILENAME", topic.filename)
      .replace("TOPIC_CONTENT", textContent);

    try {
      const tfQuestions = await callModel(tfPrompt, { json: true });
      questions.push(...tfQuestions);
      console.log(`Generated ${tfQuestions.length} true/false questions`);
    } catch (error) {
      console.error(`Error generating true/false questions: ${error.message}`);
    }
  }
  // Generate workout questions
  if (questionCounts["workout"] > 0) {
    const woPrompt = workoutPrompt
      .replace("COURSE_ID", actualCourseId)
      .replace("TOPIC_FILENAME", topic.filename)
      .replace("NUMBER_OF_QUESTIONS", questionCounts["workout"])
      .replace("TOPIC_CONTENT", textContent);

    try {
      const woQuestions = await callModel(woPrompt, { json: true });
      questions.push(...woQuestions);
      console.log(`Generated ${woQuestions.length} workout questions`);
    } catch (error) {
      console.error(`Error generating workout questions: ${error.message}`);
    }
  }
  return questions;
}

// Function to extract topic content from textbook
// function extractTopicContent(textbookContent, topic) {
//   // Find content between page markers
//   const pageStartMarker = `<!-- Page ${topic.pageStart} -->`;
//   const pageEndMarker = `<!-- Page ${topic.pageEnd + 1} -->`;
//
let startIndex = textbookContent.indexOf(pageStartMarker);
//   let endIndex = textbookContent.indexOf(pageEndMarker);
//   // If end marker not found, go to the end of the content
//   if (endIndex === -1) {
//     endIndex = textbookContent.length;
//   }
//
// Extract content between markers
//   if (startIndex !== -1) {
//     startIndex += pageStartMarker.length;
//     return textbookContent.substring(startIndex, endIndex).trim();
//   }
//   // Fallback: try to find content based on paragraph count
//   console.warn(`Page markers not found for topic ${topic.title}, using paragraph estimation`);
//   // Simple paragraph splitting - this is a fallback method
//   const paragraphs = textbookContent.split(/\n\s*\n/);
//   const estimatedStart = Math.max(0, topic.pageStart * 3); // Rough estimate: 3 paragraphs per page
//   const estimatedEnd = Math.min(paragraphs.length, topic.pageEnd * 3);
//   return paragraphs.slice(estimatedStart, estimatedEnd).join('\n\n');
// }

// Main function to generate quiz for a course
export async function generateQuiz(
  courseId,
  selectedTopics = [],
  questionTypes = ["multiple-choice", "true-false", "workout"],
) {
  console.log(`Generating quiz for course: ${courseId}`);
  console.log(
    `Selected topics: ${selectedTopics.length > 0 ? selectedTopics.join(", ") : "All topics"}`,
  );
  console.log(`Question types: ${questionTypes.join(", ")}`);
  // Create quizzes directory if it doesn't exist
  const quizzesDir = path.join(courseId, "quizzes");
  if (!fs.existsSync(quizzesDir)) {
    fs.mkdirSync(quizzesDir, { recursive: true });
  }
  // Create quiz progress tracking file
  const progressFilePath = path.join(quizzesDir, "quiz-progress.json");
  let progress = {};
  if (fs.existsSync(progressFilePath)) {
    progress = JSON.parse(fs.readFileSync(progressFilePath, "utf8"));
  }
  // Read course outline
  const outlinePath = path.join(courseId, "outline.json");
  if (!fs.existsSync(outlinePath)) {
    throw new Error(`Outline file not found for course: ${courseId}`);
  }
  const outline = JSON.parse(fs.readFileSync(outlinePath, "utf8"));

  // Read textbook content
  const textbookPath = path.join(courseId, "textbook-clean.txt");
  if (!fs.existsSync(textbookPath)) {
    throw new Error(`Textbook content not found for course: ${courseId}`);
  }
  const textbookContent = fs.readFileSync(textbookPath, "utf8");
  // Collect all topics and their parent sections from the outline
  const allTopics = [];
  outline.forEach((section) => {
    if (section.topics && Array.isArray(section.topics)) {
      section.topics.forEach((topic) => {
        allTopics.push({
          ...topic,
          parentTitle: section.title,
        });
      });
    }
  });
  // Filter topics if specific ones are selected
  const topicsToProcess =
    selectedTopics.length > 0
      ? allTopics.filter((topic) => selectedTopics.includes(topic.filename))
      : allTopics;
  if (topicsToProcess.length === 0) {
    throw new Error("No topics found to process");
  }
  console.log(`Processing ${topicsToProcess.length} topics`);

  // Filter question types based on user selection
  const filteredTypes = questionTypes.filter((type) =>
    ["multiple-choice", "true-false", "workout"].includes(type),
  );

  if (filteredTypes.length === 0) {
    throw new Error("No valid question types selected");
  }

  // Generate questions for each topic
  const allQuestions = [];
  for (const topic of topicsToProcess) {
    // Skip if already processed (based on progress tracking)
    if (progress[topic.filename] && progress[topic.filename].completed) {
      console.log(`Skipping topic ${topic.filename} (already processed)`);
      // Load existing questions
      const topicQuestionsPath = path.join(
        quizzesDir,
        `${topic.filename}.json`,
      );
      if (fs.existsSync(topicQuestionsPath)) {
        const topicQuestions = JSON.parse(
          fs.readFileSync(topicQuestionsPath, "utf8"),
        );
        allQuestions.push(...topicQuestions);
      }

      continue;
    }
    // Extract content for this topic
    const topicContent = extractContent(
      textbookContent,
      topic.pageStart,
      topic.pageEnd,
    );

    if (!topicContent) {
      console.warn(
        `Insufficient content for topic ${topic.filename}, skipping`,
      );
      continue;
    }
    // Determine question distribution based on topic context
    const questionDistribution = await determineQuestionDistributionForTopic(
      topic,
      topic.parentTitle,
    );
    console.log(
      `Question distribution for ${topic.title}:`,
      questionDistribution,
    );
    // Update progress
    progress[topic.filename] = {
      started: true,
      completed: false,
      timestamp: new Date().toISOString(),
    };
    fs.writeFileSync(progressFilePath, JSON.stringify(progress, null, 2));

    // Generate questions
    const topicQuestions = await generateQuestionsForTopic(
      courseId,
      topic,
      topicContent,
      questionDistribution,
    );
    // Save topic questions to file
    const topicQuestionsPath = path.join(quizzesDir, `${topic.filename}.json`);
    fs.writeFileSync(
      topicQuestionsPath,
      JSON.stringify(topicQuestions, null, 2),
    );
    // Add to all questions
    allQuestions.push(...topicQuestions);
    // Update progress
    progress[topic.filename].completed = true;
    progress[topic.filename].questionCount = topicQuestions.length;
    fs.writeFileSync(progressFilePath, JSON.stringify(progress, null, 2));

    console.log(
      `Completed topic ${topic.filename} with ${topicQuestions.length} questions`,
    );
  }

  // Create the final quiz object
  const quiz = {
    courseId: courseId,
    topics: topicsToProcess.map((t) => t.filename),
    qtypes: filteredTypes,
    questions: allQuestions,
  };
  // Save the complete quiz
  const quizPath = path.join(quizzesDir, "complete-quiz.json");
  fs.writeFileSync(quizPath, JSON.stringify(quiz, null, 2));

  console.log(
    `Quiz generation complete. Total questions: ${allQuestions.length}`,
  );
  console.log(`Quiz saved to: ${quizPath}`);
  return quiz;
}

// Run as CLI if called directly
export const main = async () => {
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const courseId = process.argv[2];
    const topicsArg = process.argv[3] || "";
    const typesArg = process.argv[4] || "multiple-choice,true-false,workout";
    if (!courseId) {
      console.log(
        "Usage: node gen-quiz.js course-id [topics] [question-types]",
      );
      console.log("  course-id: Path to the course folder");
      console.log(
        "  topics: Comma-separated list of topic filenames (optional, default: all topics)",
      );
      console.log(
        "  question-types: Comma-separated list of question types (optional, default: all types)",
      );
      console.log(
        "\nExample: node gen-quiz.js ./modules/cs/introAI intro-ai,neural-networks multiple-choice,workout",
      );
      return;
    }
    const selectedTopics = topicsArg ? topicsArg.split(",") : [];
    const questionTypes = typesArg
      ? typesArg.split(",")
      : ["multiple-choice", "true-false", "workout"];

    try {
      await generateQuiz(courseId, selectedTopics, questionTypes);
    } catch (error) {
      console.error("Error generating quiz:", error);
      process.exit(1);
    }
  }
};

main();
````

## File: agents/gen-slides.js
````javascript
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
````

## File: agents/mini-outline.js
````javascript
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { callModel } from "./agent-utils.js";

async function generateFileOutline(filename) {
  if (!filename) {
    console.error("Error: Please provide a filename as an argument");
    console.log("Usage: node generate-file-outline.js <filename>");
    return;
  }

  try {
    const fileContent = fs.readFileSync(filename, "utf8");
    console.log(`File ${filename} read successfully`);

    const outlinePrompt = `
You are creating a simplified course outline for PowerPoint presentations from textbook content. Each topic should contain enough material for 5-10 slides.

Create a flat outline with the following structure:
{ "chapter title": ["topic title 1", "topic title 2", ...] }

Guidelines:
- The chapter structure should match the one provided in the textbook outline
- Each topic should cover 5-12 paragraphs or 3-5 pages
- Combine related content to meet this density requirement
- Use short but meaningful titles (no abbreviations)
- Exclude questions, exercises, summaries, glossaries, and references
- Topics should be cohesive units of related content

Content to outline:
${fileContent}

Return only valid JSON with no explanation.`;

    console.log("Generating outline...");
    const outline = await callModel(outlinePrompt, { json: true });

    const sourceDir = path.dirname(filename);
    const outFilename = path.join(
      sourceDir,
      path.basename(filename, path.extname(filename)) + ".ot.json",
    );
    fs.writeFileSync(outFilename, JSON.stringify(outline, null, 2));

    console.log(`Outline successfully written to ${outFilename}`);
    return outline;
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    throw error;
  }
}

const main = async () => {
  if (process.argv[1] != fileURLToPath(import.meta.url)) {
    console.log("usage problem");
    return;
  }

  const filename = process.argv[2];
  generateFileOutline(filename).catch(console.error);
};
main();
````

## File: agents/oldstuff.js
````javascript
const preprompt = `You are an expert academic content structuring agent specialized in creating focused, well-structured HTML documents from textbook content designed for presentation purposes. You will receive:
  1. A specific topic name and its parent topics in the curriculum hierarchy.  This is the *ONLY* topic you should cover.
  2. A partitioned content section from a textbook *potentially containing content before OR after the target topic*.

  PRIMARY OBJECTIVE: Create a semantically structured HTML document focusing *EXCLUSIVELY* on the specified topic. ABSOLUTELY DO NOT INCLUDE CONTENT FROM ANY OTHER TOPIC, even if that content is present in the provided text. The output should be concise and suitable for a presentation, not an extensive textbook chapter. Ensure that your final output includes both the metadata script tag and the complete course content HTML as defined below.

  METADATA OUTPUT STRUCTURE:
  Generate at the beginning of the document:
  <script id="course-metadata" type="application/ld+json">
  {
      "difficulty": number,        // 1-10 scale, based on conceptual complexity and prerequisite knowledge
      "duration": number,         // estimated minutes for comprehension
      "bloomsLevels": string[],   // array of: [memorize, conceptual, steps, logic, analysis, create] based on best ways to learn this topic
      "flexibility": string[],      // one of: [must-read, essential, optional] about the flexibility of this topic being read lightly
      "confidence": number,        // 1-10 scale, indicating your confidence in content completeness and your output assessment
      "confidenceRemark": string,  // detailed explanation of any limitations or concerns
      "pageStart": number, // from the info given the at the end of prompt with the topic name
      "pageEnd": number, // from the info given at the end of the prompt with the topic name
      "funfacts": string[],  // an array of 4 one-sentence fun facts about the topic that are MIND-BLOWING JAW-DROPPING INTERESTING from your general knowledge; YOU MUST MAKE SURE they are HOOKING, ATTENTION-GRABING, SHARE WORTHY, EXCITING and INTERESTING facts even if the facts are remotely related to the topic
      "youtubeKeywords": string // keyword to search for youtube videos for this topic
  }
  </script>

  Your output must consist of two parts:
  1. A metadata <script> tag as specified.
  2. A complete, well-structured HTML section containing the main course content.

  Do not provide only the metadata. Your response must include both the metadata block and the full course content in one complete HTML document.

  This will look like:
  <script id="course-metadata" type="application/ld+json">
  { ...metadata JSON... }
  </script>
  <!-- Begin Course Content -->
  <h1>Course Title</h1>
  <div>...rest of the HTML content...</div>

  ALLOWED HTML ELEMENTS AND USAGE:

  Heading Structure:
  <h1> - Main topic title only
  <h2> - Major section divisions
  <h3> - Subsection headings
  [Maintain strict hierarchy; no skipping levels]

  Content Containers:
  <p> - Standard paragraphs
  <div> and <span> with classes:
  - class="definition" - Formal term definitions
  - class="example" - Illustrative examples
  - class="note" - Tips, important points, warnings

  Mathematical Content:
  <span class="math-inline"> - For inline mathematics
  <div class="math-display"> - For displayed equations
  [Use combination of LaTeX and unicode; ensure proper delimiters]

  Code Sections:
  <pre><code class="language-[name]"> - For code snippets
  [Always specify language; ensure proper formatting]

  List Structures:
  <ul> - Unordered lists (concepts, points)
  <ol> - Ordered lists (steps, procedures)
  <li> - List items
  [Maintain proper nesting for complex multi-level lists; use appropriate type]

  Text Emphasis:
  <strong> - Critical emphasis
  <em> - Secondary emphasis
  <u> - Underlining
  [Use sparingly and meaningfully]

  Special Elements:
  <blockquote> - Significant quotes or key points
  <table>, <th>, <tr>, <td> - Tabular data
  <hr> - Major section breaks
  <br> - Minimal use, only when necessary

  CONTENT STRUCTURING RULES:

  1. Topic Focus:
  - *STRICTLY* adhere to the specified topic and its subtopics.
  - *DO NOT INCLUDE INFORMATION FROM OTHER TOPICS, EVEN IF THE PROVIDED CONTENT TOUCHES ON THEM.* Only include content directly relevant to explaning the topic given.
  - Maintain academic tone and precision.

  2. Content Organization:
  - Present concepts in logical progression *WITHIN THE SPECIFIED TOPIC.*
  - Build from fundamental to advanced ideas *WITHIN THE SPECIFIED TOPIC.*
  - Include appropriate explanations and *relevant* examples *FOR THE SPECIFIED TOPIC.*

  3. Mathematical Content:
  - Use proper LaTeX notation for complex equations *THAT ARE PART OF THE SPECIFIED TOPIC.*
  - Ensure equations are properly explained *WITHIN THE SPECIFIED TOPIC.*
  - Maintain consistent mathematical notation *WITHIN THE SPECIFIED TOPIC.*

  5. Code Examples:
  - Include explanatory comments *THAT ARE PART OF THE SPECIFIED TOPIC.*
  - Ensure code relevance to the topic.

  5. Completeness Checks:
  - Verify all necessary concepts are covered *WITHIN THE SPECIFIED TOPIC.*
  - Ensure logical flow between sections *WITHIN THE SPECIFIED TOPIC.*
  - Check for adequate explanations *WITHIN THE SPECIFIED TOPIC.*

  6. Content Type:
  - The content should be suitable for presentation, not a textbook.
  - *DO NOT INCLUDE SAMPLE EXERCISES.* Only include examples meant to illustrate the topic.
  - Be concise.

  7. Gap Handling:
  - *If content appears incomplete and is MISSING information that is required to understand the target topic, ONLY include that information. For example, if explaining the second law of thermodynamics requires knowing the first, ONLY provide the minimum information needed. DO NOT start teaching from scratch.*
  - Clearly indicate synthesized content in confidenceRemark.
  - Maintain consistency with academic standards.

  8. References:
  - Mention related topics naturally *ONLY IF REQUIRED TO DEFINE OR EXPLAIN THE MAIN TOPIC.*
  - Avoid specific page numbers or external references.
  - Use general academic language for cross-references.

  9. Ignore Learning Objectives:
  -no need to list useless objectives as that is boring for students

  QUALITY ASSURANCE:
  1. Verify all required metadata fields are properly assessed.
  2. Ensure HTML structure is valid and nested correctly.
  3. Check mathematical expressions for correctness.
  4. Verify code examples are properly formatted.
  5. *CONFIRM THAT CONTENT STAYS STRICTLY WITHIN THE SPECIFIED TOPIC BOUNDARIES.*
  6. Assess confidence level honestly and thoroughly.

  Process the input content according to these specifications, maintaining academic rigor while ensuring clarity and proper structure. Focus on creating a self-contained, well-structured document that effectively teaches the specific topic in a concise presentation-friendly format.

  *IF YOU ARE EVER UNSURE IF A SECTION IS RELEVANT TO THE TOPIC HAND, EXCLUDE IT. BE CONSERVATIVE IN WHAT YOU INCLUDE. IT IS BETTER TO OMIT THAN TO INCLUDE UNDESIRED CONTENT.*

  *In your confidenceRemark, explicitly mention if you had to exclude content due to uncertainty about its relevance to the specified topic, or if you excluded content to maintain brevity for a presentation format.*

  `;

const userPrompt = `
You are an expert course outline architect specializing in converting textbook content into structured learning paths.
Your expertise includes:
- Breaking down complex educational content into logical learning segments
- Determining precise content scope and boundaries
- Estimating content density and learning time requirements
- Creating meaningful traversable knowledge structures
- Generating consistent and clear reference identifiers

Create a detailed course outline following these strict requirements:

  1. OUTPUT STRUCTURE
  A section must follow this JSON structure:
  interface Section {
    title,
    filename,
    pageStart, // Starting page number for this section
    pageEnd, // Ending page number for this section
    topics or subsections
  };
  interface Topic {
    title,
    filename,
    paragraphs,
    pageStart,  // Starting page number for this topic
    pageEnd     // Ending page number for this topic
  };
  You will output directly an array of Section objects;
  the property topic of Section is an array of Topic object;
  the property subsections of Section is an array of mix of Topic and Section objects;
  The Section object can go recursively within subsection properties for hierarchical topics;
  To decide between just putting a Topic object or going recursively a layer down is based on the content;
  Section object can ONLY have either a topics property or subsections property, NEVER both;

  2. STRUCTURAL RULES
  - Each section object MUST have either topics OR subsections properties, never both
  - Treat chapters as top-level sections that typically contain multiple subsections
  - Make the titles similar to that of in the content of the textbook while making it as short as possible
  - Track page ranges using <!-- Page n --> comments in the content
  - IMPORTANT: Only use <!-- Page n --> comments to determine page numbers. Ignore any other page numbering or formatting in the content text itself
  - For each topic, include:
    • pageStart: First page where topic content appears
    • pageEnd: Last page where topic content appears
  - Exclude ALL sections dedicated to:
    • Sample questions
    • Exercises
    • Review questions
    • Summaries
    • Glossaries
    • References
    • Optional readings
    • Supplementary materials
  - Include accurate paragraph count estimates for each topic (convert tables and lists to paragraph equivalents)

  3. FILENAME REQUIREMENTS
  - Use kebab-case format
  - Maximum 30 characters when possible
  - Must be unique across the entire outline
  - Use these abbreviations as guideline:
    • introduction → intro
    • management → mgmt
    • system → sys
    • database → db
    • programming → prog
    • development → dev
    • implementation → impl
    • architecture → arch
    • application → app
    • structure → struct
    • algorithm → algo
    • configuration → config
    • analysis → anal
    • fundamentals → fund
    • principles → prin
    • techniques → tech
  - Remove all common words:
    • the, and, or, of, to, for, in, on, at
  - Keep only 3-4 significant terms maximum when possible
  - Ensure absolute filename uniqueness across entire outline

  4. OUTPUT FORMAT
  - Must be valid JSON
  - Must maintain proper nesting and structure
  - Must follow all rules precisely
  - Each Topic object must include pageStart and pageEnd numbers

  Content to process:
  ${textContent}

  YOU MUST RESPOND WITH RAW JSON ONLY
  `;
````

## File: agents/package.json
````json
{
  "name": "agents",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "main": "agent-utils.js",
  "dependencies": {
    "axios": "^0.21.4",
    "base64-js": "^1.5.1",
    "bl": "^4.1.0",
    "buffer": "^5.7.1",
    "canvas": "^3.1.0",
    "chownr": "^1.1.4",
    "debug": "^3.2.7",
    "decompress-response": "^6.0.0",
    "deep-extend": "^0.6.0",
    "detect-libc": "^2.0.3",
    "end-of-stream": "^1.4.4",
    "expand-template": "^2.0.3",
    "follow-redirects": "^1.15.9",
    "fs-constants": "^1.0.0",
    "github-from-package": "^0.0.0",
    "ieee754": "^1.2.1",
    "inherits": "^2.0.4",
    "ini": "^1.3.8",
    "mimic-response": "^3.1.0",
    "minimist": "^1.2.8",
    "mkdirp-classic": "^0.5.3",
    "ms": "^2.1.3",
    "napi-build-utils": "^2.0.0",
    "node-abi": "^3.74.0",
    "node-addon-api": "^7.1.1",
    "node-ensure": "^0.0.0",
    "once": "^1.4.0",
    "pdf-parse": "^1.1.1",
    "pdfjs-dist": "^4.10.38",
    "prebuild-install": "^7.1.3",
    "pump": "^3.0.2",
    "rc": "^1.2.8",
    "readable-stream": "^3.6.2",
    "safe-buffer": "^5.2.1",
    "semver": "^7.7.1",
    "simple-concat": "^1.0.1",
    "simple-get": "^4.0.1",
    "string_decoder": "^1.3.0",
    "strip-json-comments": "^2.0.1",
    "tar-fs": "^2.1.2",
    "tar-stream": "^2.2.0",
    "tunnel-agent": "^0.6.0",
    "util-deprecate": "^1.0.2",
    "wrappy": "^1.0.2",
    "youtube-search-api": "^1.2.2"
  },
  "devDependencies": {
    "eslint": "^9.22.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
````

## File: agents/parse-exams.js
````javascript
import fs from "node:fs/promises";
import path from "node:path";
import { callModel } from "./agent-utils.js";

function removeProps(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeProps);
  }

  if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      if (
        key !== "pageStart" &&
        key !== "pageEnd" &&
        key !== "paragraphs" &&
        !(key === "filename" && obj.hasOwnProperty("subsections"))
      ) {
        newObj[key] = removeProps(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

async function getUnprocessedExamFolders(courseRoot) {
  try {
    const examsFolderPath = path.join(courseRoot, "exams");
    const folders = await fs.readdir(examsFolderPath);

    const unprocessedFolders = [];
    for (const folder of folders) {
      const folderPath = path.join(examsFolderPath, folder);
      const stats = await fs.stat(folderPath);

      if (stats.isDirectory()) {
        const hasExamsHtml = await fs
          .access(path.join(folderPath, "exams.json"))
          .then(() => true)
          .catch(() => false);

        if (!hasExamsHtml) {
          unprocessedFolders.push(folder);
        }
      }
    }

    return unprocessedFolders;
  } catch (error) {
    console.error("Error getting unprocessed folders:", error);
    throw error;
  }
}

async function getTextFilesForFolder(courseRoot, folderName) {
  try {
    const folderPath = path.join(courseRoot, "exams", folderName);
    const files = await fs.readdir(folderPath);
    const textFiles = files.filter((f) => /\.(txt)$/i.test(f));

    const textContents = [];
    for (const txtFile of textFiles) {
      const txtPath = path.join(folderPath, txtFile);
      const content = await fs.readFile(txtPath, "utf-8");
      textContents.push({
        fileName: txtFile,
        content,
      });
    }

    return textContents;
  } catch (error) {
    console.error("Error getting text files:", error);
    throw error;
  }
}

async function readAndCleanOutline(courseRoot) {
  try {
    const outlineContent = await fs.readFile(
      path.join(courseRoot, "outline.json"),
      "utf-8",
    );
    const outline = JSON.parse(outlineContent);

    return removeProps(outline);
  } catch (error) {
    console.error("Error reading/cleaning outline:", error);
    throw error;
  }
}

async function getImgsForFolder(courseRoot, folderName) {
  try {
    const folderPath = path.join(courseRoot, "exams", folderName);
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

    const images = [];
    for (const imgFile of imageFiles) {
      const imgPath = path.join(folderPath, imgFile);
      const buffer = await fs.readFile(imgPath);
      images.push({
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: `image/${path.extname(imgFile).slice(1)}`,
        },
      });
    }

    return images;
  } catch (error) {
    console.error("Error getting images:", error);
    throw error;
  }
}

async function createExams(
  cleanOutline,
  input,
  courseRoot,
  folderName,
  isImage = true,
) {
  try {
    let prompt;
    let response;

    if (isImage) {
      // If input is an image
      prompt = getImageExamCreatorPropmt(cleanOutline);
      response = await callModel(prompt, { images: [input] });
    } else {
      // If input is text content
      prompt = getTextExamCreatorPrompt(cleanOutline, input.content);
      response = await callModel(prompt);
    }

    // Parse JSON response
    const course = path.basename(courseRoot.replace(/\/$/, ""));
    const examId = folderName.split(".")[0];
    const src = folderName.split(".")[1];
    const questions = JSON.parse(response);
    const questionWithMoreMeta = questions.map((question) => ({
      ...question,
      metadata: {
        ...question.metadata,
        course,
        examId,
        src,
      },
    }));

    const examPath = path.join(courseRoot, "exams", folderName, "exams.json");

    // Check if file exists and read current content
    let currentQuestions = [];
    try {
      const content = await fs.readFile(examPath, "utf-8");
      currentQuestions = JSON.parse(content);
    } catch (err) {
      // File doesn't exist yet, start with empty array
    }

    // Append new questions
    const updatedQuestions = [...currentQuestions, ...questions];

    // Write updated content
    await fs.writeFile(examPath, JSON.stringify(updatedQuestions, null, 2));

    return questions;
  } catch (error) {
    console.error("Error creating/appending exam:", error);
    throw error;
  }
}

async function main() {
  try {
    const courseRoot = process.argv[2];
    if (!courseRoot) {
      throw new Error("Course root path required");
    }

    const unprocessedFolders = await getUnprocessedExamFolders(courseRoot);
    const cleanOutline = await readAndCleanOutline(courseRoot);
    console.log(`Starting to process ${unprocessedFolders.length} folders...`);

    for (const [folderIndex, folder] of unprocessedFolders.entries()) {
      console.log("=========================================");
      console.log(`Processing folder: ${folder}`);

      // Process images
      const images = await getImgsForFolder(courseRoot, folder);
      for (const [imageIndex, image] of images.entries()) {
        console.log("---------------------------------------");
        console.log(
          `Processing image ${imageIndex + 1}/${images.length} in folder ${folderIndex + 1}/${unprocessedFolders.length} (${folder})`,
        );
        await createExams(cleanOutline, image, courseRoot, folder, true);
        console.log(`Finised this image`);
      }

      // Process text files
      const textFiles = await getTextFilesForFolder(courseRoot, folder);
      for (const [textIndex, textFile] of textFiles.entries()) {
        console.log("---------------------------------------");
        console.log(
          `Processing text file ${textIndex + 1}/${textFiles.length} in folder ${folderIndex + 1}/${unprocessedFolders.length} (${folder})`,
        );
        await createExams(cleanOutline, textFile, courseRoot, folder, false);
        console.log(`Finised this text file`);
      }
    }

    console.log("All folders, images, and text files processed successfully");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

main();

const getTextExamCreatorPrompt = (cleanOutline, textContent) =>
  `You are an expert exam question analyzer and reconstructor.
  Your task is to process raw text of exam questions, analyze them, and output structured questions with metadata.
  You must work with the provided course outline JSON to properly categorize questions.

  COURSE OUTLINE:
  ${JSON.stringify(cleanOutline, null, 2)}

  RAW TEXT CONTENT:
  ${textContent}

  CORE RESPONSIBILITIES:
  1. Process raw text content (single or multiple questions per text)
  2. Identify and structure individual questions from unformatted text
  3. Generate structured output with metadata and content
  4. Convert questions to supported formats (multiple-choice, true/false, workout/short-answer)
  5. Map questions to course topics

  OUTPUT STRUCTURE:
  For each question, generate an object with properties metadata, hint, solution, question, and options (for multiple-choice questions) and output an array of those objects directly:
  {
    "metadata": {
      "topic": "topic-filename", // The filename of the topic of question
      "difficulty": number(1-10),
      "questionType": "multiple-choice" | "true-false" | "workout",
      "src": "real" | "reconst",
      "confidence": number(1-10),
      "confidenceRemark": "string",
      "correctAnswer": number | "true" | "false" | null // index of correct option (0-based) or null for workout problems
    },
    "hint": "<div class="hint"> {{hint here with HTML formatting}} </div>",
    "solution": "<div class="solution"> {{solution here with HTML formatting}} </div>",
    "question": "<div class="question-text"> {{question text here with HTML formatting}} </div>",
    "options": [
      "<div class=\"option-content\">First option with HTML formatting</div>",
      "<div class=\"option-content\">Second option with HTML formatting</div>",
      "<div class=\"option-content\">Third option with HTML formatting</div>",
      "<div class=\"option-content\">Fourth option with HTML formatting</div>"
    ] // Include this array only for multiple-choice questions
  }



  RULES AND GUIDELINES:

  1. Question Processing:
  - Mark as "real" only if question is completely clear and comprehensible
  - Mark as "reconst" if ANY part needs reconstruction
  - For workout/short answer questions, do not include options property
  - Maintain topic relevance when reconstructing
  - Preserve original difficulty level when determinable
  - Convert matching, fill-in-blank or any other question types outside of true/false or workout to multiple-choice
  - For matching questions:
    - Each item in first column becomes a separate multiple choice question
    - Maximum 4 options per question from second column items
    - Randomize option order while maintaining correct pairing
    - Include original matching format in question text for context
  - For fill-in-the-blank questions:
      - Convert blank into question with 4 options
      - Include the correct answer and 3 plausible distractors
      - Keep original sentence structure
      - Options should be grammatically consistent
      - All options should fit naturally in the blank

  2. Topic Mapping:
  - Use topic filenames in metadata
  - Include confidence remark if topic mapping is uncertain or your answer is uncertain

  3. Content Formatting: ALLOWED HTML ELEMENTS AND USAGE FOR QUESTION CONTENT, HINT, OPTIONS AND EXPLANATIONS/SOLUTIONS:

    Heading Structure:
    <h1> - Main topic title only
    <h2> - Major section divisions
    <h3> - Subsection headings
    Maintain strict hierarchy; no skipping levels

    Content Containers:
    <p> - Standard paragraphs
    <div> and <span> with classes:
    - class="definition" - Formal term definitions
    - class="example" - Illustrative examples
    - class="note" - Tips, important points, warnings

    Mathematical Content:
    <span class="math-inline"> - For inline mathematics
    <div class="math-display"> - For displayed equations
    [Use combination of LaTeX and unicode; ensure proper delimiters]

    Code Sections:
    <pre><code class="language-[name]"> - For code snippets
    [Always specify language; ensure proper formatting]

    List Structures:
    <ul> - Unordered lists (concepts, points)
    <ol> - Ordered lists (steps, procedures)
    <li> - List items
    [Maintain proper nesting for complex multi-level lists; use appropriate type]

    Text Emphasis:
    <strong> - Critical emphasis
    <em> - Secondary emphasis
    <u> - Underlining
    [Use sparingly and meaningfully]

    Special Elements:
    <blockquote> - Significant quotes or key points
    <table>, <th>, <tr>, <td> - Tabular data
    <hr> - Major section breaks

  4. Mathematical Content:
  - Use KaTeX for mathematical expressions
  - Use appropriate math-inline or math-display classes
  - Combine with Unicode where appropriate

  EXAMPLES:

  1. Clear Multiple Choice Question:
  [Example raw text of a question about DFS algorithm]

  {
    "metadata": {
      "topic": "problem-solving-search",
      "difficulty": 7,
      "questionType": "multiple-choice",
      "src": "real",
      "confidence": 9,
      "confidenceRemark": "Clear question with direct topic mapping",
      "correctAnswer": 1
    },
    "hint": "<div class="hint">Remember that DFS explores as far as possible along each branch before backtracking.</div>",
    "solution": "<div class="solution">
      <p>The correct answer is 1-2-3-4-5. Here's why:</p>
      <ol>
          <li>Starting at node 1</li>
          <li>Following DFS principle, we go deep through the leftmost path first</li>
          <li>This leads us to sequence 1-2-3</li>
          <li>After backtracking, we visit 4 and finally 5</li>
      </ol>
      <p>Alternative approach: You could also verify this by drawing the DFS tree.</p>
    </div>",
    "question": "<div class="question-text">
        Consider the following graph traversal using DFS:
        <div class="math-display">
            [Graph representation in KaTeX]
        </div>
        What is the correct sequence of visited nodes?
    </div>",
    "options": [
      "<div class=\"option-content\">1-2-4-3-5</div>",
      "<div class=\"option-content\">1-2-3-4-5</div>",
      "<div class=\"option-content\">1-3-2-4-5</div>",
      "<div class=\"option-content\">1-2-3-5-4</div>"
    ]
  }

  VALIDATION REQUIREMENTS:
  1. Ensure correctAnswer is the index (0-based) of the correct option in the options array
  2. Verify topic filenames exist in course outline
  3. Confirm difficulty and confidence are 1-10
  4. Validate HTML structure matches allowed elements
  5. Ensure mathematical expressions are properly formatted

  When processing new questions:
  1. Analyze the text content thoroughly
  2. Identify and separate individual questions
  3. Determine question type and reconstruction needs
  4. Map to course topics
  5. Generate structured output
  6. Include detailed solutions with explanations
  7. Provide helpful hints
  8. Validate all metadata and content

  Process the exam questions and output structured data according to these specifications.`;

const getImageExamCreatorPropmt = (cleanOutline) =>
  `You are an expert exam question analyzer and reconstructor.
  Your task is to process images of exam questions, analyze them, and output structured questions with metadata.
  You must work with the provided course outline JSON to properly categorize questions.

  COURSE OUTLINE:
  ${JSON.stringify(cleanOutline, null, 2)}

  CORE RESPONSIBILITIES:
  1. Process exam question image (single or multiple questions per image)
  2. Reconstruct unclear/incomplete questions while maintaining topic relevance
  3. Generate structured output with metadata and content
  4. Convert questions to supported formats (multiple-choice, true/false, workout/short-answer)
  5. Map questions to course topics

  OUTPUT STRUCTURE:
  For each question, generate an object with properties metadata, hint, solution, question, and options (for multiple-choice questions) and output an array of those objects directly:
  {
    "metadata": {
      "topic": "topic-filename",
      "difficulty": number(1-10),
      "questionType": "multiple-choice" | "true-false" | "workout",
      "src": "real" | "reconst",
      "confidence": number(1-10),
      "confidenceRemark": "string",
      "correctAnswer": number | "true" | "false" | null // index of correct option (0-based) or true/false or null for workout problems
    },
    "hint": "<div class="hint"> {{hint here with HTML formatting}} </div>",
    "solution": "<div class="solution"> {{solution here with HTML formatting}} </div>",
    "question": "<div class="question-text"> {{question text here with HTML formatting}} </div>",
    "options": [
      "<div class=\"option-content\">First option with HTML formatting</div>",
      "<div class=\"option-content\">Second option with HTML formatting</div>",
      "<div class=\"option-content\">Third option with HTML formatting</div>",
      "<div class=\"option-content\">Fourth option with HTML formatting</div>"
    ] // Include this array only for multiple-choice questions
  }



  RULES AND GUIDELINES:

  1. Question Processing:
  - Mark as "real" only if question is completely clear and readable
  - Mark as "reconst" if ANY part needs reconstruction
  - For workout/short answer questions, do not include options property
  - Maintain topic relevance when reconstructing
  - Preserve original difficulty level when determinable
  - Convert matching, fill-in-blank or any other question types outside of true/false or workout to multiple-choice
  - For matching questions:
    - Each item in first column becomes a separate multiple choice question
    - Maximum 4 options per question from second column items
    - Randomize option order while maintaining correct pairing
    - Include original matching format in question text for context
  - For fill-in-the-blank questions:
      - Convert blank into question with 4 options
      - Include the correct answer and 3 plausible distractors
      - Keep original sentence structure
      - Options should be grammatically consistent
      - All options should fit naturally in the blank

  2. Topic Mapping:
  - Use topic filenames in metadata
  - Include confidence remark if topic mapping is uncertain or your answer is uncertain

  3. Content Formatting: ALLOWED HTML ELEMENTS AND USAGE FOR QUESTION CONTENT, HINT, OPTIONS AND EXPLANATIONS/SOLUTIONS:

    Heading Structure:
    <h1> - Main topic title only
    <h2> - Major section divisions
    <h3> - Subsection headings
    Maintain strict hierarchy; no skipping levels

    Content Containers:
    <p> - Standard paragraphs
    <div> and <span> with classes:
    - class="definition" - Formal term definitions
    - class="example" - Illustrative examples
    - class="note" - Tips, important points, warnings

    Mathematical Content:
    <span class="math-inline"> - For inline mathematics
    <div class="math-display"> - For displayed equations
    [Use combination of LaTeX and unicode; ensure proper delimiters]

    Code Sections:
    <pre><code class="language-[name]"> - For code snippets
    [Always specify language; ensure proper formatting]

    List Structures:
    <ul> - Unordered lists (concepts, points)
    <ol> - Ordered lists (steps, procedures)
    <li> - List items
    [Maintain proper nesting for complex multi-level lists; use appropriate type]

    Text Emphasis:
    <strong> - Critical emphasis
    <em> - Secondary emphasis
    <u> - Underlining
    [Use sparingly and meaningfully]

    Special Elements:
    <blockquote> - Significant quotes or key points
    <table>, <th>, <tr>, <td> - Tabular data
    <hr> - Major section breaks

  4. Mathematical Content:
  - Use KaTeX for mathematical expressions
  - Use appropriate math-inline or math-display classes
  - Combine with Unicode where appropriate

  EXAMPLES:

  1. Clear Multiple Choice Question:
  [Example image of a clear question about DFS algorithm]

  {
    "metadata": {
      "topic": "problem-solving-search",
      "difficulty": 7,
      "questionType": "multiple-choice",
      "src": "real",
      "confidence": 9,
      "confidenceRemark": "Clear question with direct topic mapping",
      "correctAnswer": 1
    },
    "hint": "<div class="hint">Remember that DFS explores as far as possible along each branch before backtracking.</div>",
    "solution": "<div class="solution">
      <p>The correct answer is 1-2-3-4-5. Here's why:</p>
      <ol>
          <li>Starting at node 1</li>
          <li>Following DFS principle, we go deep through the leftmost path first</li>
          <li>This leads us to sequence 1-2-3</li>
          <li>After backtracking, we visit 4 and finally 5</li>
      </ol>
      <p>Alternative approach: You could also verify this by drawing the DFS tree.</p>
    </div>",
    "question": "<div class="question-text">
        Consider the following graph traversal using DFS:
        <div class="math-display">
            [Graph representation in KaTeX]
        </div>
        What is the correct sequence of visited nodes?
    </div>",
    "options": [
      "<div class=\"option-content\">1-2-4-3-5</div>",
      "<div class=\"option-content\">1-2-3-4-5</div>",
      "<div class=\"option-content\">1-3-2-4-5</div>",
      "<div class=\"option-content\">1-2-3-5-4</div>"
    ]
  }

  VALIDATION REQUIREMENTS:
  1. Ensure correctAnswer is the index (0-based) of the correct option in the options array
  2. Verify topic filenames exist in course outline
  3. Confirm difficulty and confidence are 1-10
  4. Validate HTML structure matches allowed elements
  5. Ensure mathematical expressions are properly formatted

  When processing new questions:
  1. Analyze the image thoroughly
  2. Determine question type and reconstruction needs
  3. Map to course topics
  4. Generate structured output
  5. Include detailed solutions with explanations
  6. Provide helpful hints
  7. Validate all metadata and content

  Process the exam questions and output structured data according to these specifications.`;
````

## File: agents/sampleing
````
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};
````

## File: public/intro.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quiz App Onboarding</title>
    <style>
      body {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f0f0f0;
        overflow: hidden;
      }

      .box {
        position: absolute;
        width: 400px;
        height: 500px;
        background: #ffeb3b;
        border: 8px solid #000;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 60px 20px 20px;
        box-sizing: border-box;
        font-family: "Comic Sans MS", cursive;
      }

      .label {
        position: absolute;
        top: -30px;
        font-size: 36px;
        font-weight: bold;
        transform: rotate(-5deg);
      }

      .item {
        font-size: 24px;
        margin: 10px 0;
        opacity: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .item span {
        display: inline-block;
      }

      .hand {
        position: absolute;
        width: 100px;
        height: 100px;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="purple" d="M12 2L2 22h20L12 2zm0 4l6 12H6l6-12z"/></svg>')
          no-repeat center;
        background-size: contain;
        pointer-events: none;
      }

      /* Animations */
      @keyframes slideIn {
        0% {
          transform: translateX(-100%) scale(0.8);
        }
        80% {
          transform: translateX(10%) scale(1.1);
        }
        100% {
          transform: translateX(0) scale(1);
        }
      }

      @keyframes slideOut {
        0% {
          transform: translateX(0) scale(1);
        }
        100% {
          transform: translateX(-100%) scale(0.5) rotate(10deg);
        }
      }

      @keyframes slideInRight {
        0% {
          transform: translateX(100%) scale(0.9);
        }
        80% {
          transform: translateX(-10%) scale(1.1);
        }
        100% {
          transform: translateX(0) scale(1);
        }
      }

      @keyframes slideOutRight {
        0% {
          transform: translateX(0) scale(1);
        }
        100% {
          transform: translateX(100%) scale(0.5) rotate(-15deg);
        }
      }

      @keyframes popIn {
        0% {
          opacity: 0;
          transform: translateY(-50px) scale(1);
        }
        50% {
          opacity: 1;
          transform: translateY(0) scale(1.2);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes tap {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
        }
      }

      @keyframes glow {
        0% {
          border-color: transparent;
        }
        50% {
          border-color: #ff00ff;
        }
        100% {
          border-color: transparent;
        }
      }

      @keyframes expand {
        0% {
          height: 40px;
        }
        80% {
          height: 140px;
          transform: scaleX(1.1);
        }
        100% {
          height: 140px;
          transform: scaleX(1);
        }
      }

      @keyframes slideSub {
        0% {
          opacity: 0;
          transform: translateX(-50px) scaleX(0.8);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scaleX(1);
        }
      }
    </style>
  </head>
  <body>
    <div id="topicBox" class="box">
      <div class="label">Topic</div>
      <div class="item"><span>📖</span> Read</div>
      <div class="item"><span>▶️</span> Videos</div>
      <div class="item"><span>🤖</span> AI Simplified</div>
      <div class="item"><span>💡</span> Fun Facts</div>
      <div class="item" id="quizItem"><span>⭐</span> Quiz</div>
    </div>
    <div id="quizBox" class="box" style="background: #ff5722; display: none">
      <div class="label">Quiz</div>
      <div class="item"><span>💬</span> Explanations</div>
      <div class="item"><span>🔍</span> Hints</div>
      <div class="item"><span>📚</span> Read Topics</div>
      <div class="item" id="studyPlan" style="height: 40px">
        <span>📅</span> Study Plan
      </div>
    </div>
    <div id="hand" class="hand" style="display: none"></div>

    <script>
      const topicBox = document.getElementById("topicBox");
      const quizBox = document.getElementById("quizBox");
      const hand = document.getElementById("hand");
      const quizItem = document.getElementById("quizItem");
      const studyPlan = document.getElementById("studyPlan");

      // Step 1: Topic Box In
      topicBox.style.animation = "slideIn 0.4s forwards";
      setTimeout(() => {
        const items = topicBox.querySelectorAll(".item");
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.animation = "popIn 0.2s forwards";
            // Trigger "thud" sound here
          }, i * 300);
        });
      }, 400);

      // Step 2: Hand Clicks Quiz
      setTimeout(() => {
        hand.style.display = "block";
        hand.style.top = `${quizItem.offsetTop - 50}px`;
        hand.style.left = "500px";
        hand.style.animation = "slideInRight 0.3s forwards";
        setTimeout(() => {
          hand.style.animation = "tap 0.2s";
          quizItem.style.animation = "popIn 0.2s, glow 0.2s";
          // Trigger "click" sound here
        }, 500); // Hover 0.2s after 0.3s entry
      }, 1900); // After items finish (1.5s + 0.4s)

      // Step 3: Quiz Box In
      setTimeout(() => {
        topicBox.style.animation = "slideOut 0.3s forwards";
        // Trigger "whoosh" sound here
        setTimeout(() => {
          topicBox.style.display = "none";
          quizBox.style.display = "block";
          quizBox.style.animation = "slideInRight 0.4s forwards";
          // Trigger "bam" sound here
          setTimeout(() => {
            const items = quizBox.querySelectorAll(".item");
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.animation = "popIn 0.2s forwards";
                // Trigger "thud" sound here
              }, i * 300);
            });
          }, 400);
        }, 300);
      }, 2600); // After hand tap (1.9s + 0.7s)

      // Step 4: Study Plan Expands
      setTimeout(() => {
        studyPlan.style.animation = "expand 0.3s forwards";
        // Trigger "boing" sound here
        setTimeout(() => {
          studyPlan.innerHTML += `
                    <div class="item" style="margin-left: 20px; animation: slideSub 0.2s forwards;"><span>😓</span> Weak Topics</div>
                    <div class="item" style="margin-left: 20px; animation: slideSub 0.2s forwards 0.2s;"><span>💪</span> Strong Topics</div>
                `;
          setTimeout(() => {
            const weakTopics = document.createElement("div");
            weakTopics.innerHTML = `
                        <div class="item" style="margin-left: 40px;"><span>🧮</span> Math Basics</div>
                        <div class="item" style="margin-left: 40px;"><span>⚗️</span> Science 101</div>
                    `;
            studyPlan.appendChild(weakTopics);
            weakTopics.querySelectorAll(".item").forEach((item, i) => {
              setTimeout(() => {
                item.style.animation = "popIn 0.2s forwards";
                // Trigger "thud" sound here
              }, i * 200);
            });
            setTimeout(() => {
              const mathBasics = weakTopics.children[0];
              hand.style.top = `${mathBasics.offsetTop - 50}px`;
              hand.style.left = "500px";
              hand.style.animation = "slideInRight 0.3s forwards";
              setTimeout(() => {
                hand.style.animation = "tap 0.2s";
                mathBasics.style.animation = "popIn 0.2s, glow 0.2s";
                // Trigger "click" sound here
              }, 500); // Hover 0.2s after 0.3s entry
            }, 400); // After weak topics
          }, 400); // After sub-items
        }, 300); // After expand
      }, 4500); // After quiz items (2.6s + 1.9s)

      // Step 5: Loop Back to Topic Box
      setTimeout(() => {
        quizBox.style.animation = "slideOutRight 0.3s forwards";
        // Trigger "whoosh" sound here
        setTimeout(() => {
          quizBox.style.display = "none";
          topicBox.style.display = "block";
          topicBox.style.animation = "slideIn 0.4s forwards";
          setTimeout(() => {
            const items = topicBox.querySelectorAll(".item");
            items.forEach((item, i) => {
              item.style.opacity = "0"; // Reset
              setTimeout(() => {
                item.style.animation = "popIn 0.2s forwards";
                // Trigger "thud" sound here
              }, i * 300);
            });
          }, 400);
        }, 300);
      }, 6100); // After hand tap (4.5s + 1.6s)
    </script>
  </body>
</html>
````

## File: src/lib/components/ui/avatar/avatar-fallback.svelte
````
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

<AvatarPrimitive.Fallback
	bind:ref
	class={cn("bg-muted flex size-full items-center justify-center", className)}
	{...restProps}
/>
````

## File: src/lib/components/ui/avatar/avatar-image.svelte
````
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image bind:ref class={cn("aspect-square size-full", className)} {...restProps} />
````

## File: src/lib/components/ui/avatar/avatar.svelte
````
<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	class={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
	{...restProps}
/>
````

## File: src/lib/components/ui/avatar/index.ts
````typescript
import Root from "./avatar.svelte";
import Image from "./avatar-image.svelte";
import Fallback from "./avatar-fallback.svelte";

export {
	Root,
	Image,
	Fallback,
	//
	Root as Avatar,
	Image as AvatarImage,
	Fallback as AvatarFallback,
};
````

## File: src/lib/components/ui/button/button.svelte
````
<script lang="ts" module>
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border-input bg-background hover:bg-accent hover:text-accent-foreground border",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className)}
		{href}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
````

## File: src/lib/components/ui/button/index.ts
````typescript
import Root, {
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants,
} from "./button.svelte";

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	buttonVariants,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
};
````

## File: src/lib/components/ui/card/card-content.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("p-6", className)} {...restProps}>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/card/card-description.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p bind:this={ref} class={cn("text-muted-foreground text-sm", className)} {...restProps}>
	{@render children?.()}
</p>
````

## File: src/lib/components/ui/card/card-footer.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("flex items-center p-6 pt-0", className)} {...restProps}>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/card/card-header.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("flex flex-col space-y-1.5 p-6 pb-0", className)} {...restProps}>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/card/card-title.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		level = 3,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
	} = $props();
</script>

<div
	role="heading"
	aria-level={level}
	bind:this={ref}
	class={cn("text-2xl font-semibold leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/card/card.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("bg-card text-card-foreground rounded-lg border shadow-sm", className)}
	{...restProps}
>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/card/index.ts
````typescript
import Root from "./card.svelte";
import Content from "./card-content.svelte";
import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";

export {
	Root,
	Content,
	Description,
	Footer,
	Header,
	Title,
	//
	Root as Card,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle,
};
````

## File: src/lib/components/ui/checkbox/checkbox.svelte
````
<script lang="ts">
	import { Checkbox as CheckboxPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import Check from "lucide-svelte/icons/check";
	import Minus from "lucide-svelte/icons/minus";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	class={cn(
		"border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer box-content size-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div class="flex size-4 items-center justify-center text-current">
			{#if indeterminate}
				<Minus class="size-3.5" />
			{:else}
				<Check class={cn("size-3.5", !checked && "text-transparent")} />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>
````

## File: src/lib/components/ui/checkbox/index.ts
````typescript
import Root from "./checkbox.svelte";
export {
	Root,
	//
	Root as Checkbox,
};
````

## File: src/lib/components/ui/command/command-dialog.svelte
````
<script lang="ts">
	import type {
		Command as CommandPrimitive,
		Dialog as DialogPrimitive,
		WithoutChildrenOrChild,
	} from "bits-ui";
	import type { Snippet } from "svelte";
	import Command from "./command.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: DialogPrimitive.PortalProps;
			children: Snippet;
		} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Content class="overflow-hidden p-0 shadow-lg" {portalProps}>
		<Command
			class="[&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-group]]:px-2 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
			{...restProps}
			bind:value
			bind:ref
			{children}
		/>
	</Dialog.Content>
</Dialog.Root>
````

## File: src/lib/components/ui/command/command-empty.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.EmptyProps = $props();
</script>

<CommandPrimitive.Empty class={cn("py-6 text-center text-sm", className)} {...restProps} />
````

## File: src/lib/components/ui/command/command-group.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		heading,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string;
	} = $props();
</script>

<CommandPrimitive.Group
	class={cn("text-foreground overflow-hidden p-1", className)}
	bind:ref
	{...restProps}
>
	{#if heading}
		<CommandPrimitive.GroupHeading
			class="text-muted-foreground px-2 py-1.5 text-xs font-medium"
		>
			{heading}
		</CommandPrimitive.GroupHeading>
	{/if}
	<CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
````

## File: src/lib/components/ui/command/command-input.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import Search from "lucide-svelte/icons/search";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div class="flex items-center border-b px-2" data-command-input-wrapper="">
	<Search class="mr-2 size-4 shrink-0 opacity-50" />
	<CommandPrimitive.Input
		class={cn(
			"placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			className
		)}
		bind:ref
		{...restProps}
		bind:value
	/>
</div>
````

## File: src/lib/components/ui/command/command-item.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.ItemProps = $props();
</script>

<CommandPrimitive.Item
	class={cn(
		"aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		className
	)}
	bind:ref
	{...restProps}
/>
````

## File: src/lib/components/ui/command/command-link-item.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.LinkItemProps = $props();
</script>

<CommandPrimitive.LinkItem
	class={cn(
		"aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	bind:ref
	{...restProps}
/>
````

## File: src/lib/components/ui/command/command-list.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.ListProps = $props();
</script>

<CommandPrimitive.List
	class={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
	{...restProps}
	bind:ref
/>
````

## File: src/lib/components/ui/command/command-separator.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: CommandPrimitive.SeparatorProps = $props();
</script>

<CommandPrimitive.Separator class={cn("bg-border -mx-1 h-px", className)} bind:ref {...restProps} />
````

## File: src/lib/components/ui/command/command-shortcut.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	class={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
	{...restProps}
>
	{@render children?.()}
</span>
````

## File: src/lib/components/ui/command/command.svelte
````
<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: CommandPrimitive.RootProps = $props();
</script>

<CommandPrimitive.Root
	class={cn(
		"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
		className
	)}
	bind:value
	bind:ref
	{...restProps}
/>
````

## File: src/lib/components/ui/command/index.ts
````typescript
import { Command as CommandPrimitive } from "bits-ui";

import Root from "./command.svelte";
import Dialog from "./command-dialog.svelte";
import Empty from "./command-empty.svelte";
import Group from "./command-group.svelte";
import Item from "./command-item.svelte";
import Input from "./command-input.svelte";
import List from "./command-list.svelte";
import Separator from "./command-separator.svelte";
import Shortcut from "./command-shortcut.svelte";
import LinkItem from "./command-link-item.svelte";

const Loading = CommandPrimitive.Loading;

export {
	Root,
	Dialog,
	Empty,
	Group,
	Item,
	LinkItem,
	Input,
	List,
	Separator,
	Shortcut,
	Loading,
	//
	Root as Command,
	Dialog as CommandDialog,
	Empty as CommandEmpty,
	Group as CommandGroup,
	Item as CommandItem,
	LinkItem as CommandLinkItem,
	Input as CommandInput,
	List as CommandList,
	Separator as CommandSeparator,
	Shortcut as CommandShortcut,
	Loading as CommandLoading,
};
````

## File: src/lib/components/ui/dialog/dialog-content.svelte
````
<script lang="ts">
	import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import X from "lucide-svelte/icons/x";
	import type { Snippet } from "svelte";
	import * as Dialog from "./index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
		portalProps?: DialogPrimitive.PortalProps;
		children: Snippet;
	} = $props();
</script>

<Dialog.Portal {...portalProps}>
	<Dialog.Overlay />
	<DialogPrimitive.Content
		bind:ref
		class={cn(
			"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
			className
		)}
		{...restProps}
	>
		{@render children?.()}
		<DialogPrimitive.Close
			class="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
		>
			<X class="size-4" />
			<span class="sr-only">Close</span>
		</DialogPrimitive.Close>
	</DialogPrimitive.Content>
</Dialog.Portal>
````

## File: src/lib/components/ui/dialog/dialog-description.svelte
````
<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.DescriptionProps = $props();
</script>

<DialogPrimitive.Description
	bind:ref
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
````

## File: src/lib/components/ui/dialog/dialog-footer.svelte
````
<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
	{...restProps}
>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/dialog/dialog-header.svelte
````
<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
	{...restProps}
>
	{@render children?.()}
</div>
````

## File: src/lib/components/ui/dialog/dialog-overlay.svelte
````
<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.OverlayProps = $props();
</script>

<DialogPrimitive.Overlay
	bind:ref
	class={cn(
		"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0  fixed inset-0 z-50 bg-black/80",
		className
	)}
	{...restProps}
/>
````

## File: src/lib/components/ui/dialog/dialog-title.svelte
````
<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
	bind:ref
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...restProps}
/>
````

## File: src/lib/components/ui/dialog/index.ts
````typescript
import { Dialog as DialogPrimitive } from "bits-ui";

import Title from "./dialog-title.svelte";
import Footer from "./dialog-footer.svelte";
import Header from "./dialog-header.svelte";
import Overlay from "./dialog-overlay.svelte";
import Content from "./dialog-content.svelte";
import Description from "./dialog-description.svelte";

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;
const Close = DialogPrimitive.Close;
const Portal = DialogPrimitive.Portal;

export {
	Root,
	Title,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	Close,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	Close as DialogClose,
};
````

## File: src/lib/components/ui/input/index.ts
````typescript
import Root from "./input.svelte";

export {
	Root,
	//
	Root as Input,
};
````

## File: src/lib/components/ui/input/input.svelte
````
<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

{#if type === "file"}
	<input
		bind:this={ref}
		class={cn(
			"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			className
		)}
		type="file"
		bind:files
		bind:value
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		class={cn(
			"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
			className
		)}
		{type}
		bind:value
		{...restProps}
	/>
{/if}
````

## File: src/lib/components/ui/label/index.ts
````typescript
import Root from "./label.svelte";

export {
	Root,
	//
	Root as Label,
};
````

## File: src/lib/components/ui/label/label.svelte
````
<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: LabelPrimitive.RootProps = $props();
</script>

<LabelPrimitive.Root
	bind:ref
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className
	)}
	{...restProps}
/>
````

## File: src/lib/components/ui/popover/index.ts
````typescript
import { Popover as PopoverPrimitive } from "bits-ui";
import Content from "./popover-content.svelte";
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;
const Close = PopoverPrimitive.Close;

export {
	Root,
	Content,
	Trigger,
	Close,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	Close as PopoverClose,
};
````

## File: src/lib/components/ui/popover/popover-content.svelte
````
<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Popover as PopoverPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		align = "center",
		portalProps,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: PopoverPrimitive.PortalProps;
	} = $props();
</script>

<PopoverPrimitive.Portal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		{sideOffset}
		{align}
		class={cn(
			"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-none",
			className
		)}
		{...restProps}
	/>
</PopoverPrimitive.Portal>
````

## File: src/lib/components/ui/progress/index.ts
````typescript
import Root from "./progress.svelte";

export {
	Root,
	//
	Root as Progress,
};
````

## File: src/lib/components/ui/progress/progress.svelte
````
<script lang="ts">
	import { Progress as ProgressPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		max = 100,
		value,
		...restProps
	}: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();
</script>

<ProgressPrimitive.Root
	bind:ref
	class={cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className)}
	{value}
	{max}
	{...restProps}
>
	<div
		class="bg-primary h-full w-full flex-1 transition-all"
		style={`transform: translateX(-${100 - (100 * (value ?? 0)) / (max ?? 1)}%)`}
	></div>
</ProgressPrimitive.Root>
````

## File: src/lib/components/ui/radio-group/index.ts
````typescript
import Root from "./radio-group.svelte";
import Item from "./radio-group-item.svelte";

export {
	Root,
	Item,
	//
	Root as RadioGroup,
	Item as RadioGroupItem,
};
````

## File: src/lib/components/ui/radio-group/radio-group-item.svelte
````
<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import Circle from "lucide-svelte/icons/circle";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	class={cn(
		"border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square size-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div class="flex items-center justify-center">
			{#if checked}
				<Circle class="size-2.5 fill-current text-current" />
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
````

## File: src/lib/components/ui/radio-group/radio-group.svelte
````
<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: RadioGroupPrimitive.RootProps = $props();
</script>

<RadioGroupPrimitive.Root bind:ref bind:value class={cn("grid gap-2", className)} {...restProps} />
````

## File: src/lib/components/ui/select/index.ts
````typescript
import { Select as SelectPrimitive } from "bits-ui";

import GroupHeading from "./select-group-heading.svelte";
import Item from "./select-item.svelte";
import Content from "./select-content.svelte";
import Trigger from "./select-trigger.svelte";
import Separator from "./select-separator.svelte";
import ScrollDownButton from "./select-scroll-down-button.svelte";
import ScrollUpButton from "./select-scroll-up-button.svelte";

const Root = SelectPrimitive.Root;
const Group = SelectPrimitive.Group;

export {
	Root,
	Group,
	GroupHeading,
	Item,
	Content,
	Trigger,
	Separator,
	ScrollDownButton,
	ScrollUpButton,
	//
	Root as Select,
	Group as SelectGroup,
	GroupHeading as SelectGroupHeading,
	Item as SelectItem,
	Content as SelectContent,
	Trigger as SelectTrigger,
	Separator as SelectSeparator,
	ScrollDownButton as SelectScrollDownButton,
	ScrollUpButton as SelectScrollUpButton,
};
````

## File: src/lib/components/ui/select/select-content.svelte
````
<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import SelectScrollUpButton from "./select-scroll-up-button.svelte";
	import SelectScrollDownButton from "./select-scroll-down-button.svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		portalProps,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: SelectPrimitive.PortalProps;
	} = $props();
</script>

<SelectPrimitive.Portal {...portalProps}>
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		class={cn(
			"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
			className
		)}
		{...restProps}
	>
		<SelectScrollUpButton />
		<SelectPrimitive.Viewport
			class={cn(
				"h-[var(--bits-select-anchor-height)] w-full min-w-[var(--bits-select-anchor-width)] p-1"
			)}
		>
			{@render children?.()}
		</SelectPrimitive.Viewport>
		<SelectScrollDownButton />
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>
````

## File: src/lib/components/ui/select/select-group-heading.svelte
````
<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SelectPrimitive.GroupHeadingProps = $props();
</script>

<SelectPrimitive.GroupHeading
	bind:ref
	class={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
	{...restProps}
/>
````

## File: src/lib/components/ui/select/select-item.svelte
````
<script lang="ts">
	import Check from "lucide-svelte/icons/check";
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	class={cn(
		"data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute left-2 flex size-3.5 items-center justify-center">
			{#if selected}
				<Check class="size-4" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp({ selected, highlighted })}
		{:else}
			{label || value}
		{/if}
	{/snippet}
</SelectPrimitive.Item>
````

## File: src/lib/components/ui/select/select-scroll-down-button.svelte
````
<script lang="ts">
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps> = $props();
</script>

<SelectPrimitive.ScrollDownButton
	bind:ref
	class={cn("flex cursor-default items-center justify-center py-1", className)}
	{...restProps}
>
	<ChevronDown class="size-4" />
</SelectPrimitive.ScrollDownButton>
````

## File: src/lib/components/ui/select/select-scroll-up-button.svelte
````
<script lang="ts">
	import ChevronUp from "lucide-svelte/icons/chevron-up";
	import { Select as SelectPrimitive, type WithoutChildrenOrChild } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
	bind:ref
	class={cn("flex cursor-default items-center justify-center py-1", className)}
	{...restProps}
>
	<ChevronUp class="size-4" />
</SelectPrimitive.ScrollUpButton>
````

## File: src/lib/components/ui/select/select-separator.svelte
````
<script lang="ts">
	import type { Separator as SeparatorPrimitive } from "bits-ui";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<Separator bind:ref class={cn("bg-muted -mx-1 my-1 h-px", className)} {...restProps} />
````

## File: src/lib/components/ui/select/select-trigger.svelte
````
<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from "bits-ui";
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		"border-input bg-background ring-offset-background data-[placeholder]:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
````

## File: src/lib/components/ui/separator/index.ts
````typescript
import Root from "./separator.svelte";

export {
	Root,
	//
	Root as Separator,
};
````

## File: src/lib/components/ui/separator/separator.svelte
````
<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal",
		...restProps
	}: SeparatorPrimitive.RootProps = $props();
</script>

<SeparatorPrimitive.Root
	bind:ref
	class={cn(
		"bg-border shrink-0",
		orientation === "horizontal" ? "h-[1px] w-full" : "min-h-full w-[1px]",
		className
	)}
	{orientation}
	{...restProps}
/>
````

## File: src/lib/components/ui/skeleton/index.ts
````typescript
import Root from "./skeleton.svelte";

export {
	Root,
	//
	Root as Skeleton,
};
````

## File: src/lib/components/ui/skeleton/skeleton.svelte
````
<script lang="ts">
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> = $props();
</script>

<div
	bind:this={ref}
	class={cn("bg-muted animate-pulse rounded-md", className)}
	{...restProps}
></div>
````

## File: src/lib/components/ui/textarea/index.ts
````typescript
import Root from "./textarea.svelte";

type FormTextareaEvent<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLTextAreaElement;
};

type TextareaEvents = {
	blur: FormTextareaEvent<FocusEvent>;
	change: FormTextareaEvent<Event>;
	click: FormTextareaEvent<MouseEvent>;
	focus: FormTextareaEvent<FocusEvent>;
	keydown: FormTextareaEvent<KeyboardEvent>;
	keypress: FormTextareaEvent<KeyboardEvent>;
	keyup: FormTextareaEvent<KeyboardEvent>;
	mouseover: FormTextareaEvent<MouseEvent>;
	mouseenter: FormTextareaEvent<MouseEvent>;
	mouseleave: FormTextareaEvent<MouseEvent>;
	paste: FormTextareaEvent<ClipboardEvent>;
	input: FormTextareaEvent<InputEvent>;
};

export {
	Root,
	//
	Root as Textarea,
	type TextareaEvents,
	type FormTextareaEvent,
};
````

## File: src/lib/components/ui/textarea/textarea.svelte
````
<script lang="ts">
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	class={cn(
		"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
		className
	)}
	bind:value
	{...restProps}
></textarea>
````

## File: src/lib/mycomps/Combobox.svelte
````
<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  type ComboboxItem = {
    value: string;
    label: string;
  };

  let {
    items = [] as ComboboxItem[],
    value = $bindable(""),
    placeholder = "Select an item...",
    emptyMessage = "No item found...",
    searchPlaceholder = "Search...",
    buttonClass = "w-[200px] justify-between",
    contentClass = "w-[200px] p-0",
    buttonVariant = "outline" as
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link",
    icon = ChevronsUpDown,
    iconClass = "opacity-50",
    checkIcon = Check,
    open = false,
  } = $props();

  // If you need these to be reactive within the component, declare them separately with $state
  let itemsState = $state(items);
  let valueState = $state(value);
  let openState = $state(open);

  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    itemsState.find((item) => item.value === valueState)?.label,
  );

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    openState = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  export function setOpen(isOpen: boolean) {
    openState = isOpen;
  }

  export function setValue(newValue: string) {
    valueState = newValue;
  }
  $effect(() => {
    valueState = value;
  });

  // Ensure updates to valueState reflect back to value
  $effect(() => {
    value = valueState;
  });
</script>

<Popover.Root bind:open={openState}>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant={buttonVariant}
        class={buttonClass}
        {...props}
        role="combobox"
        aria-expanded={openState}
      >
        {selectedValue || placeholder}
        <svelte:component this={icon} class={iconClass} />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class={contentClass}>
    <Command.Root>
      <Command.Input placeholder={searchPlaceholder} />
      <Command.List>
        <Command.Empty>{emptyMessage}</Command.Empty>
        <Command.Group>
          {#each itemsState as item}
            <Command.Item
              value={item.value}
              onSelect={() => {
                valueState = item.value;
                closeAndFocusTrigger();
              }}
            >
              <svelte:component
                this={checkIcon}
                class={cn(valueState !== item.value && "text-transparent")}
              />
              {item.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
````

## File: src/lib/mycomps/Question.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import * as Dialog from "$lib/components/ui/dialog";
  import { AlertCircle, BookOpen, ArrowLeft, Flag, Timer } from "lucide-svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { blur, slide } from "svelte/transition";

  const {
    question,
    handleDone,
    options,
    solution,
    hint,
    showSolution,
    showAnswerForWorkout,
    selectedAnswer,
    isCorrect,
    handleAnswerSelect,
    handleWorkoutAnswer,
    handleNext,
    currentProgress,
    seconds,
    goBack,
    report,
    currentQuestionIndex,
    questionType,
    totalQuestions,
  } = $props();

  let isHintOpen = $state(false);

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="container mx-auto p-4 max-w-3xl bg-accent min-h-screen">
  <div class="flex justify-between items-center mb-2">
    <ArrowLeft onclick={goBack} class="w-8 h-8 p-1" />

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 font-medium">
        <Timer class="h-4 w-4" />
        {formatTime(seconds)}
      </div>
      <Button
        onclick={handleDone}
        variant="primary"
        class="bg-blue-600 px-6 text-white"
      >
        <span class="font-bold">Done</span>
      </Button>
    </div>
  </div>

  <Progress value={currentProgress} class="h-1 mb-8" />

  {#key currentQuestionIndex}
    <div class="space-y-6" in:blur={{ duration: 200 }}>
      <h2 class="text-xl font-semibold">
        {@html question}
      </h2>

      {#if questionType !== "workout"}
        <div class="grid gap-3">
          {#each options as option (option)}
            <Button
              variant={selectedAnswer === option.value
                ? isCorrect
                  ? "outline"
                  : "destructive"
                : "outline"}
              onclick={() => !showSolution && handleAnswerSelect(option.value)}
              class="w-full justify-start px-4 py-6 text-left whitespace-normal {selectedAnswer ===
                option.value && isCorrect
                ? 'bg-green-100 hover:bg-green-100 border-green-600 text-green-800 font-medium'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}"
            >
              {@html option.text}
            </Button>
          {/each}
        </div>
      {:else}
        <!-- Workout question type -->
        <div class="space-y-4">
          {#if !showSolution}
            <Button
              variant="outline"
              class="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-800"
              onclick={() => {
                showAnswerForWorkout();
              }}
            >
              Show Answer
            </Button>
          {:else if !isCorrect && isCorrect !== false}
            <div class="space-y-4" in:slide={{ duration: 300 }}>
              <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 id="solution" class="font-semibold mb-2 text-green-800">
                  Solution
                </h3>
                id solution {@html solution}
              </div>
              <div class="text-center font-medium mb-2">
                Did you get it right?
              </div>
              <div class="flex gap-4">
                <Button
                  variant="outline"
                  class="flex-1 border-red-500 text-red-700 hover:bg-red-50 font-medium"
                  onclick={() => handleWorkoutAnswer(false)}
                >
                  No
                </Button>
                <Button
                  variant="outline"
                  class="flex-1 border-green-600 text-green-800 hover:bg-green-50 font-medium"
                  onclick={() => handleWorkoutAnswer(true)}
                >
                  Yes
                </Button>
              </div>
              <Separator class="my-6" />

              {@render OpenTopic()}
              <Button variant="outline" class="text-red-500">
                <Flag class="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          {/if}
        </div>
      {/if}

      {#if !showSolution && hint}
        <div class="flex justify-end">
          <Dialog.Root bind:open={isHintOpen}>
            <Dialog.Trigger>
              <Button class="bg-blue-300 text-black font-bold">
                <AlertCircle class="h-4 w-4 mr-2" />
                Hint
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Hint</Dialog.Title>
                <Dialog.Description>
                  {@html hint}
                </Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      {/if}

      {#if showSolution && isCorrect !== null}
        <div class="mt-6 space-y-6" in:slide={{ duration: 300 }}>
          {#if questionType !== "workout"}
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 id="solution" class="font-semibold mb-2 text-green-800">
                Solution
              </h3>
              {@html solution}
            </div>
          {/if}

          {@render OpenTopic()}

          <div class="flex justify-between items-center">
            <Button variant="outline" class="text-red-500" onclick={report}>
              <Flag class="h-4 w-4 mr-2" />
              Report
            </Button>
            <Button onclick={handleNext}>
              {currentQuestionIndex < totalQuestions - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {/key}
</div>
{#snippet OpenTopic()}
  <Card class="mt-3 p-4 flex items-center">
    <h3 class="font-bold text-gray-900 mb-2">
      <div
        class="inline-flex items-center justify-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 mr-2 min-w-min"
      >
        Topic
      </div>
      <br />
      Introduction to Mechanics and the morning coffee of ayu
    </h3>
    <Button variant="outline" class="bg-blue-100">
      <BookOpen class="h-4 w-4 mr-2" />
      Read
    </Button>
  </Card>
{/snippet}
````

## File: src/lib/api.ts
````typescript
import type { Course, EduFocus, TopicData } from "../types.d.ts";
import { mockCourses, mockMatricExams, mockQuizQuestions } from "./mock";
export async function reportFeedback(feedback: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 3500));
  console.log("report feedback got called man the feedback is this", feedback);
}

export async function getCourses(query: string = ""): Promise<Course[]> {
  const lowerQuery = query.toLowerCase();
  return mockCourses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(lowerQuery) ||
      course.fields.some((field) => field.toLowerCase().includes(lowerQuery)),
  );
}

import { outline } from "./mock";
export async function getCourse(courseId: string): Promise<{ data: Course }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("get course got called man the outline is this", outline);
  try {
    return {
      data: {
        courseId,
        courseTitle: "Logic and Critical Thinking",
        outline: outline,
      } as Course,
    };
  } catch (error) {
    console.error("Error reading or parsing course outline:", error);
    return null as unknown as { data: Course };
  }
}

export async function searchCourses(
  query: string = "",
  limit: number = 20,
  fields?: string[],
): Promise<{ data: Course[] }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();
  const filteredCourses = mockCourses.filter((course) => {
    if (fields && fields.length > 0) {
      return (
        (fields.includes("title") &&
          course.courseTitle.toLowerCase().includes(lowerQuery)) ||
        (fields.includes("fields") &&
          course.fields.some((field) =>
            field.toLowerCase().includes(lowerQuery),
          ))
      );
    }
    return (
      course.courseTitle.toLowerCase().includes(lowerQuery) ||
      course.fields.some((field) => field.toLowerCase().includes(lowerQuery))
    );
  });

  return { data: filteredCourses.slice(0, limit) };
}

import topicData from "../../modules/freshman/logic/topics/axiology-logic.json";
export async function getTopicData(
  courseId: string,
  filename: string,
): Promise<{ data: TopicData }> {
  console.log(`giving topic data for ${courseId}/${filename}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    return { data: topicData };
  } catch (error) {
    console.error("Error reading or parsing course outline:", error);
    return { data: {} as TopicData };
  }
}

export async function getMainCourses(eduFocus: EduFocus, fieldOrGrade: string) {
  console.log("ok man", eduFocus, fieldOrGrade);
  if (eduFocus == "undergrad") {
    return { data: [] };
  }
  if (eduFocus == "highschool") {
    return {
      data: mockCourses
        .filter((course) => course.isHighschool && course.grade == fieldOrGrade)
        .map((course) => ({ ...course, outline })),
    };
  }
  if (eduFocus == "exitexam") {
    return {
      data: mockCourses
        .filter(
          (course) => course.isExitCore && course.fields.includes(fieldOrGrade),
        )
        .map((course) => ({ ...course, outline })),
    };
  }
}
export async function getRecCourses(eduFocus: EduFocus, fieldOrGrade: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (eduFocus == "highschool")
    return { data: mockCourses.map((course) => ({ ...course, outline })) };
  if (eduFocus == "exitexam" || eduFocus == "undergrad")
    return {
      data: mockCourses
        .filter((course) => course.fields.includes(fieldOrGrade))
        .map((course) => ({ ...course, outline })),
    };
}
export async function getQuizQuestions() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockQuizQuestions };
}
export async function getExitQuestions() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockQuizQuestions };
}

import { mockExitExam, mockExitExams, mockMatricExam } from "./mock";
export async function getExitExam() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockExitExam };
}

export async function getExitExams() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockExitExams };
}

export async function getMatricExam(examId: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log("fetching matric exam for id:", examId);
  return { data: mockMatricExam };
}

export async function getMatricExams() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { data: mockMatricExams };
}
````

## File: src/lib/mock.ts
````typescript
import logicOutline from "../../modules/freshman/logic/outline.json";
import courses from "../../modules/courses.json";
import type { MatricExam, ExitExam } from "src/types";

export const outline = logicOutline;
export const mockCourses = courses;

export const mockMatricExams = [
  {
    examId: "natural-science-2016",
    examTitle: "2016 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2016"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 40,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2015",
    examTitle: "2015 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2015"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 38,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 34,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 33,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2014",
    examTitle: "2014 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2014"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 37,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 34,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2013",
    examTitle: "2013 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2013"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 35,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 32,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
    ],
  },
  {
    examId: "natural-science-2012",
    examTitle: "2012 Natural Science Stream",
    tags: ["High School", "Natural Science", "Exit Exam", "2012"],
    examType: "matric",
    stream: "natural",
    subjects: [
      {
        subjectId: "math",
        subjectTitle: "Mathematics",
        duration: 180,
        totalQuestions: 33,
        totalMarks: 100,
      },
      {
        subjectId: "phy",
        subjectTitle: "Physics",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "chem",
        subjectTitle: "Chemistry",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
      {
        subjectId: "bio",
        subjectTitle: "Biology",
        duration: 180,
        totalQuestions: 30,
        totalMarks: 100,
      },
    ],
  },
];

export const mockExitExams = [
  {
    examId: "cs-exit-2016",
    examTitle: "2016 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2016"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 100,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 15,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 20,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 15,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 15,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 12,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 13,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2015",
    examTitle: "2015 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2015"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 100,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 14,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 18,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 16,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 14,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 13,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 15,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2014",
    examTitle: "2014 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2014"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 95,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 13,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 17,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 14,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 13,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 14,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 14,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2013",
    examTitle: "2013 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2013"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 90,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 12,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 16,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 15,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 13,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 12,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2012",
    examTitle: "2012 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2012"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 85,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 12,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 15,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 13,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 12,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 11,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2011",
    examTitle: "2011 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2011"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 80,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 10,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 14,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 12,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 12,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 11,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 11,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
  {
    examId: "cs-exit-2010",
    examTitle: "2010 Computer Science",
    tags: ["Computer Science", "Exit Exam", "2010"],
    examType: "exitexam",
    dept: "Computer Science",
    duration: 180,
    totalQuestions: 75,
    totalMarks: 100,
    courses: [
      {
        courseId: "cs101",
        courseTitle: "Introduction to Programming",
        questionCount: 10,
      },
      {
        courseId: "cs201",
        courseTitle: "Data Structures and Algorithms",
        questionCount: 13,
      },
      {
        courseId: "cs301",
        courseTitle: "Database Systems",
        questionCount: 11,
      },
      {
        courseId: "cs302",
        courseTitle: "Operating Systems",
        questionCount: 11,
      },
      {
        courseId: "cs401",
        courseTitle: "Computer Networks",
        questionCount: 10,
      },
      {
        courseId: "cs402",
        courseTitle: "Software Engineering",
        questionCount: 10,
      },
      {
        courseId: "cs403",
        courseTitle: "Theory of Computation",
        questionCount: 10,
      },
    ],
  },
];

export const fieldToTitle = {
  cs: "Computer Science",
  math: "Mathematics",
  eng: "Engineering",
  phy: "Physics",
  chem: "Chemistry",
  bio: "Biology",
  med: "Medicine",
  agri: "Agriculture",
  econ: "Economics",
  bus: "Business",
  hist: "History",
  socsci: "Social Sciences",
  lit: "Literature",
  hum: "Humanities",
  soc: "Sociology",
  art: "Art",
  music: "Music",
  law: "Law",
  gov: "Government",
  poli: "Political Science",
  envsci: "Environmental Science",
  mkt: "Marketing",
  health: "Health",
  design: "Design",
  film: "Film",
  perfart: "Performing Arts",
  writing: "Writing",
  fin: "Finance",
};

export const mockMatricExam: MatricExam = {
  examId: "natural-science-2023",
  examTitle: "2023 Natural Science Stream",
  tags: ["High School", "Natural Science", "Exit Exam", "2023"],

  examType: "matric",
  stream: "natural",
  subjects: [
    {
      subjectId: "math",
      subjectTitle: "Mathematics",
      duration: 180,
      totalQuestions: 40,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "math-g9-01",
          chapterTitle: "Functions and Relations",
          description:
            "Introduction to functions, domain, range, and different types of relations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-02",
          chapterTitle: "Linear Equations and Inequalities",
          description: "Solving systems of linear equations and inequalities",
          questionCount: 6,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-03",
          chapterTitle: "Polynomials",
          description:
            "Operations with polynomials, factoring, and polynomial equations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-04",
          chapterTitle: "Quadratic Equations",
          description:
            "Solving and analyzing quadratic equations and functions",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-05",
          chapterTitle: "Coordinate Geometry",
          description:
            "Points, lines, and basic geometric concepts on coordinate plane",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g9-06",
          chapterTitle: "Euclidean Geometry",
          description: "Angles, triangles, circles, and geometric proofs",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "math-g11-01",
          chapterTitle: "Trigonometry",
          description: "Trigonometric functions, identities, and equations",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-02",
          chapterTitle: "Calculus",
          description: "Limits, derivatives, and basic integration",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-03",
          chapterTitle: "Probability and Statistics",
          description:
            "Basic probability, statistical measures, and distributions",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-04",
          chapterTitle: "Vectors and 3D Geometry",
          description: "Vector operations and three-dimensional geometry",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-05",
          chapterTitle: "Complex Numbers",
          description: "Operations with complex numbers and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "math-g11-06",
          chapterTitle: "Matrices and Determinants",
          description:
            "Matrix operations, determinants, and linear transformations",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "phy",
      subjectTitle: "Physics",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "phy-g9-01",
          chapterTitle: "Mechanics",
          description: "Newton's laws, kinematics, and dynamics",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-02",
          chapterTitle: "Work, Energy, and Power",
          description:
            "Conservation of energy, work principles, and power calculations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-03",
          chapterTitle: "Heat and Thermodynamics",
          description:
            "Temperature, heat transfer, and thermal properties of matter",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-04",
          chapterTitle: "Waves",
          description: "Wave properties, sound waves, and wave phenomena",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-05",
          chapterTitle: "Light and Optics",
          description: "Reflection, refraction, and optical instruments",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g9-06",
          chapterTitle: "Electricity",
          description:
            "Static electricity, electric fields, and basic circuits",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "phy-g11-01",
          chapterTitle: "Electromagnetism",
          description:
            "Magnetic fields, electromagnetic induction, and applications",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-02",
          chapterTitle: "Quantum Physics",
          description:
            "Photoelectric effect, atomic models, and quantum principles",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-03",
          chapterTitle: "Nuclear Physics",
          description: "Radioactivity, nuclear reactions, and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-04",
          chapterTitle: "Fluid Mechanics",
          description: "Pressure, buoyancy, and fluid dynamics",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-05",
          chapterTitle: "Modern Physics",
          description:
            "Special relativity and introduction to particle physics",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "phy-g11-06",
          chapterTitle: "Solid State Physics",
          description:
            "Crystal structures, semiconductor physics, and applications",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "chem",
      subjectTitle: "Chemistry",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "chem-g9-01",
          chapterTitle: "Atomic Structure",
          description:
            "Atomic models, electron configuration, and periodic table",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-02",
          chapterTitle: "Chemical Bonding",
          description:
            "Ionic, covalent, and metallic bonds, molecular geometry",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-03",
          chapterTitle: "Stoichiometry",
          description:
            "Balanced equations, mole concept, and chemical calculations",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-04",
          chapterTitle: "States of Matter",
          description: "Properties of gases, liquids, and solids",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-05",
          chapterTitle: "Solutions",
          description: "Concentration, solubility, and colligative properties",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g9-06",
          chapterTitle: "Acids and Bases",
          description: "Properties, theories, pH, and neutralization reactions",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "chem-g11-01",
          chapterTitle: "Chemical Kinetics",
          description:
            "Reaction rates, factors affecting rates, and mechanisms",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-02",
          chapterTitle: "Chemical Equilibrium",
          description:
            "Equilibrium constants, Le Chatelier's principle, and applications",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-03",
          chapterTitle: "Thermochemistry",
          description: "Heat of reactions, enthalpy, entropy, and free energy",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-04",
          chapterTitle: "Electrochemistry",
          description:
            "Redox reactions, electrochemical cells, and electrolysis",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-05",
          chapterTitle: "Organic Chemistry",
          description: "Hydrocarbons, functional groups, and organic reactions",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "chem-g11-06",
          chapterTitle: "Analytical Chemistry",
          description: "Qualitative and quantitative analysis methods",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
    {
      subjectId: "bio",
      subjectTitle: "Biology",
      duration: 180,
      totalQuestions: 35,
      totalMarks: 100,
      chapters: [
        {
          chapterId: "bio-g9-01",
          chapterTitle: "Cell Biology",
          description: "Cell structure, function, and cellular processes",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-02",
          chapterTitle: "Biochemistry",
          description: "Biomolecules, enzymes, and metabolic pathways",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-03",
          chapterTitle: "Plant Biology",
          description: "Plant structure, physiology, and reproduction",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-04",
          chapterTitle: "Human Anatomy and Physiology I",
          description: "Digestive, respiratory, and circulatory systems",
          questionCount: 5,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-05",
          chapterTitle: "Ecology",
          description:
            "Ecosystems, populations, and environmental interactions",
          questionCount: 4,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g9-06",
          chapterTitle: "Microbiology",
          description: "Bacteria, viruses, and microorganisms",
          questionCount: 3,
          gradeGroup: "g9-10",
        },
        {
          chapterId: "bio-g11-01",
          chapterTitle: "Genetics",
          description:
            "Mendelian genetics, inheritance patterns, and genetic disorders",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-02",
          chapterTitle: "Molecular Biology",
          description:
            "DNA structure, replication, transcription, and translation",
          questionCount: 6,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-03",
          chapterTitle: "Evolution",
          description: "Natural selection, speciation, and evolutionary theory",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-04",
          chapterTitle: "Human Anatomy and Physiology II",
          description: "Nervous, endocrine, and reproductive systems",
          questionCount: 5,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-05",
          chapterTitle: "Immunology",
          description: "Immune response, disorders, and applications",
          questionCount: 4,
          gradeGroup: "g11-12",
        },
        {
          chapterId: "bio-g11-06",
          chapterTitle: "Biotechnology",
          description: "Genetic engineering, cloning, and bioethics",
          questionCount: 3,
          gradeGroup: "g11-12",
        },
      ],
    },
  ],
};

export const mockExitExam: ExitExam = {
  examId: "cs-exit-2016",
  examTitle: "2016 Computer Science",
  tags: ["Computer Science", "Exit Exam", "2016"],

  examType: "exitexam",
  dept: "Computer Science",
  duration: 180,
  totalQuestions: 100,
  totalMarks: 100,
  courses: [
    {
      courseId: "cs101",
      courseTitle: "Introduction to Programming",
      questionCount: 15,
    },
    {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      questionCount: 20,
    },
    {
      courseId: "cs301",
      courseTitle: "Database Systems",
      questionCount: 15,
    },
    {
      courseId: "cs302",
      courseTitle: "Operating Systems",
      questionCount: 15,
    },
    {
      courseId: "cs401",
      courseTitle: "Computer Networks",
      questionCount: 12,
    },
    {
      courseId: "cs402",
      courseTitle: "Software Engineering",
      questionCount: 13,
    },
    {
      courseId: "cs403",
      courseTitle: "Theory of Computation",
      questionCount: 10,
    },
  ],
};

export const mockQuizQuestions = [
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: { title: "Algorithm Analysis", filename: "algorithm-analysis" },
      difficulty: 4,
      questionType: "workout",
      subType: "mathematical",
      src: "gen",
      confidence: 0.85,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: null,
    },
    hint: `<div class="hint">Use the master theorem for recurrence relations, and identify the appropriate case.</div>`,
    solution: `<div class="solution">
      <h3>Solution Approach</h3>
      <ol>
        <li>We have the recurrence relation T(n) = 3T(n/2) + n²</li>
        <li>Comparing with the master theorem format T(n) = aT(n/b) + f(n), we have:
          <ul>
            <li>a = 3 (number of subproblems)</li>
            <li>b = 2 (factor by which input size is reduced)</li>
            <li>f(n) = n² (cost of dividing and combining)</li>
          </ul>
        </li>
        <li>Calculate n^(log_b a) = n^(log_2 3) ≈ n^1.585</li>
        <li>Since f(n) = n² and n² grows faster than n^1.585, we're in Case 3 of the master theorem</li>
        <li>For Case 3, if f(n) = Ω(n^(log_b a + ε)) for some ε > 0, and if af(n/b) ≤ kf(n) for some k < 1 and all sufficiently large n, then T(n) = Θ(f(n))</li>
        <li>Checking the regularity condition: 3(n/2)² = 3n²/4 < n² for large n, so the condition is satisfied</li>
        <li>Therefore, T(n) = Θ(n²)</li>
      </ol>
       <div class="note">This problem illustrates how to analyze the time complexity of divide-and-conquer algorithms using the master theorem.</div>
     </div>`,
    question: `<div class="question">
      <div class="question-text">
        <p>Solve the following recurrence relation and give the asymptotic time complexity:</p>
        <div class="math-display">T(n) = 3T(n/2) + n²</div>
        <p>Show all steps using the master theorem, and explain which case applies and why.</p>
      </div>
    </div>`,
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: {
        title: "Epistemology and Meta-Epistemology",
        filename: "meta-epistemo",
      },
      difficulty: 3,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.9,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 0,
    },
    hint: `<div class="hint">Think about the time complexity of common sorting algorithms.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is Quick Sort. While Quick Sort has a worst-case time complexity of O(n²), its average-case time complexity is O(n log n), making it faster than Bubble Sort and Selection Sort in practice for most datasets.</p>
      <ul>
        <li>Quick Sort: Average O(n log n), Worst O(n²)</li>
        <li>Merge Sort: Average and Worst O(n log n) but requires extra space</li>
        <li>Bubble Sort: Average and Worst O(n²)</li>
        <li>Selection Sort: Average and Worst O(n²)</li>
      </ul>
    </div>`,
    question: `<div class="question-text">Which sorting algorithm generally performs best for large datasets in practice?</div>`,
    options: [
      `<div class="option-content">Quick Sort</div>`,
      `<div class="option-content">Bubble Sort</div>`,
      `<div class="option-content">Selection Sort</div>`,
      `<div class="option-content">Linear Search</div>`,
    ],
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: {
        title: "Deductive and Inductive Reasoning",
        filename: "deduc-induc",
      },
      difficulty: 5,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.85,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 3,
    },
    hint: `<div class="hint">Think about tree traversal methods and their ordering.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is All of the above. For the given binary search tree, the traversal orders would be:</p>
      <ul>
        <li>In-order: 1, 3, 5, 7, 9, 11</li>
        <li>Pre-order: 7, 3, 1, 5, 9, 11</li>
        <li>Post-order: 1, 5, 3, 11, 9, 7</li>
      </ul>
      <p>For a binary search tree, an in-order traversal will always visit nodes in sorted order.</p>
    </div>`,
    question: `<div class="question-text">For a binary search tree with root 7, left subtree 3 (with children 1 and 5), and right subtree 9 (with right child 11), which traversal method(s) will visit the nodes in some specific order?</div>`,
    options: [
      `<div class="option-content">In-order traversal only</div>`,
      `<div class="option-content">Pre-order traversal only</div>`,
      `<div class="option-content">Post-order traversal only</div>`,
      `<div class="option-content">All of the above</div>`,
    ],
  },
  {
    metadata: {
      courseId: "cs201",
      courseTitle: "Data Structures and Algorithms",
      topic: { title: "Importance of Learning", filename: "importance-learn" },
      difficulty: 4,
      questionType: "multiple-choice",
      src: "gen",
      confidence: 0.9,
      confidenceRemark: "Generated from textbook content",
      correctAnswer: 2,
    },
    hint: `<div class="hint">Consider the properties of different data structures for rapid insertion and removal.</div>`,
    solution: `<div class="solution">
      <p>The correct answer is Linked List. Linked lists allow for O(1) insertion and deletion at any position when you have a pointer to the node, which makes them ideal for frequent insertions and deletions. Arrays require shifting elements, hash tables can have collisions, and binary trees require rebalancing.</p>
    </div>`,
    question: `<div class="question-text">Which data structure is most efficient for frequent insertions and deletions in the middle of the collection?</div>`,
    options: [
      `<div class="option-content">Array</div>`,
      `<div class="option-content">Hash Table</div>`,
      `<div class="option-content">Linked List</div>`,
      `<div class="option-content">Binary Search Tree</div>`,
    ],
  },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "multiple-choice",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: 1,
  //   },
  //   hint: `<div class="hint">Consider what happens when a hash collision occurs.</div>`,
  //   solution: `<div class="solution">
  //     <p>The correct answer is Chaining. In chaining, each bucket contains a linked list of all key-value pairs that hash to the same bucket. When a collision occurs, the new item is simply added to the list. Open addressing, on the other hand, places the colliding item in a different bucket according to a probing sequence.</p>
  //   </div>`,
  //   question: `<div class="question-text">Which collision resolution technique in hash tables stores multiple key-value pairs that hash to the same bucket in a linked list?</div>`,
  //   options: [
  //     `<div class="option-content">Linear Probing</div>`,
  //     `<div class="option-content">Chaining</div>`,
  //     `<div class="option-content">Quadratic Probing</div>`,
  //     `<div class="option-content">Double Hashing</div>`,
  //   ],
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "true",
  //   },
  //   hint: `<div class="hint">Consider the time complexity of heap operations.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is true. A binary heap supports insertion and extraction of the minimum/maximum element in O(log n) time, where n is the number of elements in the heap. This makes it an efficient implementation for priority queues where quick access to the highest-priority element is required.</p>
  //     <ul>
  //       <li>Insertion: O(log n)</li>
  //       <li>Extract-min/max: O(log n)</li>
  //       <li>Peek at min/max: O(1)</li>
  //     </ul>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">A binary heap is an efficient data structure for implementing priority queues because it allows insertion and extraction of the highest-priority element in logarithmic time.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 4,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.85,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "false",
  //   },
  //   hint: `<div class="hint">Think about the relationship between time complexity and space requirements.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is false. There is no direct correlation between an algorithm's time complexity and its space complexity. An algorithm can have excellent time complexity (e.g., O(n log n)) but poor space complexity (e.g., O(n²)), or vice versa. For example, merge sort has O(n log n) time complexity but requires O(n) additional space, while heapsort also has O(n log n) time complexity but requires only O(1) additional space.</p>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">An algorithm with better time complexity will always have better space complexity compared to algorithms with worse time complexity.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 3,
  //     questionType: "true-false",
  //     src: "gen",
  //     confidence: 0.9,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: "false",
  //   },
  //   hint: `<div class="hint">Consider the properties of different graph representations.</div>`,
  //   solution: `<div class="solution">
  //     <p>This statement is false. An adjacency matrix requires O(V²) space regardless of how many edges are in the graph, where V is the number of vertices. An adjacency list, on the other hand, requires O(V + E) space, where E is the number of edges. For sparse graphs (where E is much less than V²), adjacency lists are more space-efficient. Only for very dense graphs (where E approaches V²) would an adjacency matrix be comparable or better in terms of space efficiency.</p>
  //   </div>`,
  //   question: `<div class="question"> <div class="question-text">An adjacency matrix is always more space-efficient than an adjacency list for representing graphs.</div> </div>`,
  // },
  // {
  //   metadata: {
  //     courseId: "cs201",
  //     difficulty: 4,
  //     questionType: "workout",
  //     subType: "mathematical",
  //     src: "gen",
  //     confidence: 0.85,
  //     confidenceRemark: "Generated from textbook content",
  //     correctAnswer: null,
  //   },
  //   hint: `<div class="hint">Use the master theorem for recurrence relations, and identify the appropriate case.</div>`,
  //   solution: `<div class="solution">
  //     <h3>Solution Approach</h3>
  //     <ol>
  //       <li>We'll trace through the quick sort algorithm using the last element as pivot for each partition.</li>
  //       <li>Original array: [8, 3, 1, 7, 5, 2, 6, 4]</li>
  //       <li>First partition:
  //         <ul>
  //           <li>Pivot: 4</li>
  //           <li>After partitioning: [3, 1, 2, 4, 5, 7, 6, 8]</li>
  //           <li>Elements less than pivot: [3, 1, 2]</li>
  //           <li>Elements greater than pivot: [5, 7, 6, 8]</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort left partition [3, 1, 2]:
  //         <ul>
  //           <li>Pivot: 2</li>
  //           <li>After partitioning: [1, 2, 3]</li>
  //           <li>Left side: [1] (sorted)</li>
  //           <li>Right side: [3] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort right partition [5, 7, 6, 8]:
  //         <ul>
  //           <li>Pivot: 8</li>
  //           <li>After partitioning: [5, 7, 6, 8]</li>
  //           <li>Left side: [5, 7, 6]</li>
  //           <li>Right side: [] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Recursively sort [5, 7, 6]:
  //         <ul>
  //           <li>Pivot: 6</li>
  //           <li>After partitioning: [5, 6, 7]</li>
  //           <li>Left side: [5] (sorted)</li>
  //           <li>Right side: [7] (sorted)</li>
  //         </ul>
  //       </li>
  //       <li>Final sorted array: [1, 2, 3, 4, 5, 6, 7, 8]</li>
  //     </ol>

  //     <p>Key observations:</p>
  //     <ul>
  //       <li>Number of comparisons: 4 + 2 + 3 + 2 = 11 comparisons</li>
  //       <li>Number of swaps: 5 swaps</li>
  //       <li>Number of recursive calls: 5 calls</li>
  //       <li>Partition quality: Reasonably balanced, pivot choices led to good partitioning</li>
  //     </ul>

  //     <div class="note">This trace demonstrates how the quick sort algorithm works by repeatedly partitioning the array around a pivot element. The efficiency depends on how well the pivots divide the array, with the ideal case being equal partitions at each step.</div>
  //   </div>`,
  //   question: `<div class="question">
  //     <div class="question-text">
  //       <p>Trace through the execution of the quick sort algorithm on the following array:</p>
  //       <div class="example">[8, 3, 1, 7, 5, 2, 6, 4]</div>
  //       <p>Use the last element of each partition as the pivot. Show each step of the algorithm, including all partitioning steps and recursive calls. In your answer, include:</p>
  //       <ul>
  //         <li>The state of the array after each partitioning step</li>
  //         <li>The pivot element for each partition</li>
  //         <li>The total number of comparisons performed</li>
  //         <li>The total number of swaps performed</li>
  //       </ul>
  //     </div>
  //   </div>`,
  // },
];
````

## File: src/lib/myutils.ts
````typescript
import type { Chapter, Topic } from "../types.d.ts";

export function navigateToLink(url: string): void {
  if (!url) {
    console.error("Cannot navigate to empty URL");
    return;
  }

  try {
    new URL(url);
    window.location.href = url;
    // eslint-disable-next-line
  } catch (e) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      window.location.href = "https://" + url;
    } else {
      console.error("Invalid URL format:", url);
    }
  }
}

export function flattenOutline(outline: Chapter[]): {
  title: string;
  topics: Array<{ title: string; filename?: string; divider?: boolean }>;
}[] {
  const result = [];

  for (const chapter of outline) {
    const chapterResult = {
      title: chapter.title,
      topics: [],
    };

    // Recursively process sections and topics
    processSection(chapter, chapterResult.topics);

    result.push(chapterResult);
  }

  return result;

  function processSection(
    section: Chapter,
    resultTopics: Array<{
      title: string;
      filename?: string;
      divider?: boolean;
    }>,
  ) {
    // Process direct topics if present
    if (section.topics) {
      section.topics.forEach((topic: Topic) => {
        resultTopics.push({
          title: topic.title,
          filename: topic.filename,
        });
      });
    }
  }
}

/**
 * Generates a unique ID for course elements
 * @returns A unique string ID
 */
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
````

## File: src/lib/state.svelte.ts
````typescript
import type {
  Course,
  ExitExam,
  MatricExam,
  Quiz,
  UserReport,
} from "../types.d.ts";

const isBrowser = typeof window !== "undefined";
interface TempState {
  quiz: Quiz;
  report: UserReport;
}

interface PermState {
  userInfo?: {
    gender?: string;
    eduFocus?: string;
    examFocus?: string;
    yearOfStudy?: string;
    dept?: string;
    grade?: string;
    school?: string;
  };
  myCourses?: Course[];
  recCourses?: Course[];
  allCourses?: Course[];
  stars: number;
  qtypes: {
    multipleChoice: boolean;
    trueFalse: boolean;
    shortAnswer: boolean;
  };
  quizResults: Array<{ strongTopics: string[]; weakTopics: string[] }>;
  exitExams: ExitExam[];
  exitExamProgress: Record<
    string,
    Record<string, (string | undefined)[]> | undefined
  >;
  matricExams: MatricExam[];
  matricExamProgress: Record<
    string,
    | Record<string, Record<string, (string | undefined)[]> | undefined>
    | undefined
  >;
}

const defaultPermstate: PermState = {
  userInfo: {},
  myCourses: [],
  recCourses: [],
  allCourses: [],
  stars: 0,
  qtypes: {
    multipleChoice: true,
    trueFalse: true,
    shortAnswer: true,
  },
  quizResults: [],

  exitExams: [],
  exitExamProgress: {},
  matricExams: [],
  matricExamProgress: {},
};

// eslint-disable-next-line
export let tempstate = $state<TempState>({
  report: { issue: "" },
  quiz: {
    courseId: "",
    focus: "normal",
    examId: "",
    subjectId: "",
    chapters: [],
    courses: [],
    topics: [],
    qtypes: [],
    questions: [],
  },
});

// eslint-disable-next-line
export let permstate = $state<PermState>(
  (() => {
    if (isBrowser) {
      try {
        return (
          JSON.parse(localStorage.getItem("permstate") || "") ||
          defaultPermstate
        );
      } catch (err: unknown) {
        console.log("no state", err);
        return defaultPermstate;
      }
    }
    return defaultPermstate;
  })(),
);

export const save = (state: PermState) => {
  if (isBrowser) {
    console.log("the state to be saved", $state.snapshot(state));
    localStorage.setItem(
      "permstate",
      JSON.stringify(
        limitArrays(state, {
          allCourses: 20,
          quizResults: 20,
          exitExams: 10,
          matricExams: 10,
        }),
      ),
    );
  }
};

export const edit = (editState: Partial<PermState>) => {
  const state =
    JSON.parse(localStorage.getItem("permstate") || "") || defaultPermstate;
  const newState = { ...state, ...editState };
  console.log("the new state is", newState);
  return newState;
  // console.log("the new saved state", newState);
  // localStorage.setItem("permstate", JSON.stringify(newState));
};

export const get = () => $state.snapshot(permstate);
export const getLocal = () =>
  JSON.parse(localStorage.getItem("permstate") || "");

// Function to limit array sizes within an object
export function limitArrays<T>(target: T, filter: Record<string, number>): T {
  const output = { ...target } as Record<string, unknown>;

  for (const key in filter) {
    if (key in filter) {
      const maxSize = filter[key];
      const targetValue = key in output ? output[key] : [];

      if (Array.isArray(targetValue) && maxSize > 0) {
        output[key] = targetValue.slice(0, maxSize);
      } else if (!(key in output)) {
        output[key] = [];
      }
    }
  }

  return output as T;
}

if (isBrowser) {
  (window as unknown as { permstate: PermState }).permstate = permstate;
  (window as unknown as { save: (permstate: PermState) => void }).save = save;
  (window as unknown as { edit: (newState: Partial<PermState>) => void }).edit =
    (window as unknown as { get: () => PermState }).get = get;
  (window as unknown as { getLocal: () => PermState }).getLocal = getLocal;
  console.log("permstate has been set", permstate);
} else {
  console.log("no permstae");
}
````

## File: src/lib/utils.ts
````typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
````

## File: src/routes/Course.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Play, ChevronDown } from "lucide-svelte";
  import { push } from "svelte-spa-router";
  import { slide } from "svelte/transition";
  import { permstate, save, tempstate } from "../lib/state.svelte";
  import { onMount } from "svelte";
  import type { Course, Chapter, Topic } from "../types.d.ts";
  import { getCourse } from "$lib/api";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const { params } = $props();

  let courseData: Course | "" = $state({});
  let isLoading: boolean = $state(true);

  onMount(async () => {
    courseData =
      [...(permstate.allCourses || []), ...(permstate.myCourses || [])].find(
        ({ courseId }) => courseId == params.courseId,
      ) || null;
    if (!courseData) {
      const { data } = await getCourse(params.courseId);
      courseData = data;
      permstate.allCourses = permstate.allCourses || [];
      permstate.allCourses.push(data);
      save(permstate);
    }
    updateTopicStatus();
    courseData.outline[1].topics[2].status = "weak";
    isLoading = false;
  });

  function updateTopicStatus() {
    if (!permstate?.quizResults?.length) {
      console.log("No quiz results to map to");
      return;
    }
    const topicStatusMap = new Map();

    [...permstate.quizResults].reverse().forEach((result) => {
      (result.weakTopics || []).forEach((topic) => {
        topicStatusMap.set(topic.filename, "weak");
      });

      (result.strongTopics || []).forEach((topic) => {
        topicStatusMap.set(topic.filename, "strong");
      });
    });

    courseData.outline.forEach((chapter: Chapter) => {
      if (chapter.topics && Array.isArray(chapter.topics)) {
        chapter.topics.forEach((topic: Topic) => {
          if (!topic.divider && topic.filename) {
            topic.status = topicStatusMap.get(topic.filename) || "";
          }
        });
      }
    });
  }

  const readTopic = (topicFilename: string) => {
    push(`/topic/${params.courseId}/${topicFilename}`);
  };
  const startQuiz = (topicFilename: string) => {
    tempstate.quiz.focus = "normal";
    tempstate.quiz.courseId = params.courseId;
    if (topicFilename) tempstate.quiz.topics = [topicFilename];
    push("/select-topics");
  };

  const getStatusColor = (status: string) =>
    status === "strong"
      ? "text-green-500 bg-green-50"
      : status === "weak"
        ? "text-yellow-500 bg-yellow-50"
        : "";

  const getStatusText = (status: string) =>
    status === "strong"
      ? "Your Strong Topic"
      : status === "weak"
        ? "Your Weak Topic"
        : "";

  const toggleChapter = (chapter: { isExpanded: boolean }) => {
    chapter.isExpanded = !chapter.isExpanded;
  };

  $inspect("courseData inspected", courseData);
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      {#if isLoading}
        <Skeleton class="h-10 w-48 rounded bg-white/20" />
      {:else}
        <h1 class="text-3xl mb-2 font-bold text-white text-right">
          {courseData.courseTitle}
        </h1>
      {/if}
    </div>
    <div class="flex gap-2 justify-end">
      <Button
        variant="ghost"
        class="bg-blue-100 font-bold"
        onclick={() => startQuiz()}
      >
        <Play class="w-5 h-5 mr-2" />
        Start Quiz
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    {#if isLoading}
      <div class="space-y-4">
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
      </div>
    {:else}
      <div>
        {#each courseData.outline as chapter (chapter)}
          <button
            class="w-full bg-blue-50 mb-2 rounded-xl px-4 py-4 flex justify-between items-center"
            onclick={() => toggleChapter(chapter)}
          >
            <h2 class="text-xl text-left">{chapter.title}</h2>
            <ChevronDown
              class={"transform transition-transform " +
                (chapter.isExpanded ? "rotate-180" : "")}
            />
          </button>
          {#if chapter.isExpanded}
            <div transition:slide={{ duration: 150 }} class="space-y-4 mb-8">
              {#each chapter.topics as topic (topic)}
                {#if topic.divider}
                  <div class="font-bold text-xl text-black">{topic.title}</div>
                {:else}
                  <div class="p-3 rounded-lg border space-y-3">
                    <div class="flex items-center gap-3 flex-wrap">
                      {#if topic.status}
                        <div
                          class={`flex items-center gap-2 px-3 py-0 rounded-full w-fit ${getStatusColor(topic.status)}`}
                        >
                          <span class="text-sm font-bold"
                            >{getStatusText(topic.status)}</span
                          >
                        </div>
                      {/if}
                      <div class="font-bold text-lg text-gray-900">
                        {topic.title}
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => readTopic(topic.filename)}
                      >
                        <BookOpen class="w-4 h-4 mr-1" />
                        <span>Read</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => startQuiz(topic.filename)}
                      >
                        <Play class="w-4 h-4 mr-1" />
                        <span>Quiz Topic</span>
                      </Button>
                      <span class="flex-grow"></span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
````

## File: src/routes/Exitexam.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Play } from "lucide-svelte";
  import { permstate, tempstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExam } from "$lib/api";
  import { push } from "svelte-spa-router";
  import type { ExitExam } from "$lib/types";

  const { params } = $props();
  const examId = params.examId;

  let exam: ExitExam | null = $state(null);
  let progress: Record<string, number> = $state({});
  let loading: boolean = $state(true);

  function startExam(courseId?: string) {
    if (courseId) tempstate.quiz.courses = [courseId];
    push("/select-courses");
  }

  onMount(async () => {
    exam = permstate.exitExams?.find((e) => e.examId == examId);
    if (exam) {
      loading = false;
      return;
    }
    const { data } = await getExitExam(examId);
    exam = data;
    loading = false;
    permstate.exitExams = [...(permstate.exitExams || []), data];
    progress = getExamProgress(exam, examId, permstate.exitExamrogress);
    tempstate.quiz.focus = "exitexam";
    tempstate.quiz.examId = examId;
    save(permstate);
  });

  function getExamProgress(
    currentExam: ExitExam | null,
    examIdentifier: string,
    progressData: Record<
      string,
      Record<string, (string | undefined)[]> | undefined
    >,
  ) {
    if (!currentExam || !examIdentifier) return {};

    const progress = progressData?.[examIdentifier] || {};
    const result: Record<string, number> = {};

    if (currentExam.courses) {
      for (const course of currentExam.courses) {
        const courseId = course.courseId;
        const courseProgress = progress[courseId] || [];

        const uniqueAnsweredQuestions = new Set(
          courseProgress
            .map((answer, index) => (answer !== undefined ? index : -1))
            .filter((index) => index !== -1),
        );
        result[courseId] = uniqueAnsweredQuestions.size;
      }
    }

    return result;
  }
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      {#if loading}
        <Skeleton class="h-10 w-60 bg-blue-400/50" />
      {:else}
        <h1 class="text-3xl mb-2 font-bold text-white text-right">
          {exam?.examTitle || "Loading..."}
        </h1>
      {/if}
    </div>
    <div class="flex gap-2 justify-end">
      <Button onclick={startExam} variant="ghost" class="bg-blue-100 font-bold">
        <Play class="w-5 h-5 mr-1" />
        Start Exam
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="space-y-4 mb-8">
      {#if exam && !loading}
        {#each exam.courses as course (course)}
          <div class="mb-6">
            <div class="p-3 rounded-lg border space-y-3">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">{course.courseTitle}</h2>
                <span class="text-gray-700 font-bold text-sm text-right"
                  >{progress[course.courseId] || 0}/{course.questionCount} Qs</span
                >
              </div>
              <div class="h-3 bg-gray-200 rounded-full mb-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {((progress[course.courseId] || 0) /
                    course.questionCount) *
                    100}%"
                ></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => push(`/courses/${course.courseId}`)}
                  class="flex items-center justify-center"
                >
                  <BookOpen class="w-4 h-4 mr-1" />
                  <span>Read</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => startExam(course.courseId)}
                  class="flex items-center justify-center"
                >
                  <Play class="w-4 h-4 mr-1" />
                  <span>Exam Topic</span>
                </Button>
                <span class="flex-grow"></span>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="space-y-4">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="mb-6">
              <div class="p-3 rounded-lg border space-y-3">
                <div class="flex justify-between items-center">
                  <Skeleton class="h-7 w-40" />
                  <Skeleton class="h-5 w-16" />
                </div>
                <Skeleton class="h-3 w-full rounded-full" />
                <div class="flex flex-wrap gap-2">
                  <Skeleton class="h-9 w-20" />
                  <Skeleton class="h-9 w-28" />
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
````

## File: src/routes/Home.svelte
````
<script lang="ts">
  import { Card, CardContent } from "../lib/components/ui/card";
  import { Button } from "../lib/components/ui/button";
  import {
    ArrowRight,
    Settings,
    EllipsisVertical,
    X,
    Search,
    Plus,
    CheckCircle,
  } from "lucide-svelte";
  import { permstate, save } from "../lib/state.svelte";
  import { push } from "svelte-spa-router";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "../lib/components/ui/dialog";
  import { searchCourses } from "../lib/api";
  import type { Course } from "../types.d";
  import { Skeleton } from "../lib/components/ui/skeleton";

  let searching = $state(false);
  let searchMode = $state(false);
  let confirmDeleteDialog = $state(false);
  let courseToDelete = $state<string | null>(null);
  let searchQuery = $state("");
  let searchResults = $state<Course[]>([]);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let isLoading = $state(false);
  let addedCourses = $state<Record<string, boolean>>({});

  const removeCourse = (courseId: string) => {
    courseToDelete = courseId;
    confirmDeleteDialog = true;
  };

  const confirmRemoveCourse = () => {
    console.log("yes remove this course", courseToDelete);
    confirmDeleteDialog = false;
    courseToDelete = null;
  };

  const cancelRemoveCourse = () => {
    confirmDeleteDialog = false;
    courseToDelete = null;
  };

  const openCourse = (courseId: string) => {
    const currentIndex = permstate.myCourses.findIndex(
      (c) => c.courseId === courseId,
    );
    if (currentIndex > 0) {
      const course = permstate.myCourses.splice(currentIndex, 1)[0];
      permstate.myCourses.unshift(course);
    }
    save(permstate);
    push(`/course/${courseId}`);
  };

  const addCourse = (course) => {
    permstate.myCourses.unshift(course);
    addedCourses[course.courseId] = true;
    save(permstate);
  };

  function stopSearch() {
    searching = false;
    searchMode = false;
    searchQuery = "";
    searchResults = [];
  }

  function handleSearch(query: string) {
    searchQuery = query;
    searching = query.length > 0;
    isLoading = true;

    // Clear the previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for debounce
    searchTimeout = setTimeout(async () => {
      if (query.length > 0) {
        const results = await searchCourses(query);
        searchResults = results.data;
        isLoading = false;
      } else {
        searchResults = [];
        isLoading = false;
      }
    }, 300); // 300ms debounce
  }

  function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (
        node &&
        !node.contains(event.target as Node) &&
        event.target !== node
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<div
  class="container mx-auto p-4 pt-12 pb-20 bg-accent min-h-screen flex flex-col"
>
  <div class="flex">
    <div class="flex-1 flex items-center mb-4 rounded-lg">
      {#if searchMode}
        <X
          strokeWidth="3"
          class="text-gray-800 h-6 w-6 mx-4"
          onclick={stopSearch}
        />
      {/if}
      <div class="relative w-full border-4 border-blue-200 rounded-lg">
        <input
          type="text"
          value={searchQuery}
          onfocus={() => (searchMode = true)}
          onkeyup={(e) => handleSearch(e.currentTarget.value)}
          placeholder="Search courses..."
          class="w-full pl-4 pr-12 py-3 text-lg font-medium rounded-lg border-3 shadow-lg bg-white/95"
        />
      </div>
      <Settings
        onclick={() => push("/settings")}
        size="2rem"
        class="ml-3 mr-1 text-gray-800"
      />
    </div>
  </div>

  {#if searchMode && searching}
    <div class="mt-2">
      {#if isLoading}
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <Card class="mb-3 border-0 shadow-sm">
            <CardContent class="pb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Skeleton class="h-8 w-8 rounded-full" />
                  <Skeleton class="h-6 w-48" />
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-2">
                <Skeleton class="h-9 w-20" />
                <Skeleton class="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        {/each}
      {:else if searchResults.length > 0}
        {#each searchResults as course (course)}
          <Card class="mb-3 bg-white text-lg border-0 shadow-md">
            <CardContent class="pb-4">
              <div class="flex items-center justify-between">
                <button
                  onclick={() => openCourse(course.courseId)}
                  class="hover:underline flex items-center gap-2"
                >
                  <span class="text-2xl mr-1">{course.emoji || "📚"}</span>
                  <span class="text-left text-lg font-bold"
                    >{course.courseTitle}</span
                  >
                </button>
              </div>
              <div class="flex justify-end gap-2 mt-2">
                {#if addedCourses[course.courseId] || permstate.myCourses
                    .map(({ courseId }) => courseId)
                    .includes(course.courseId)}
                  <Button
                    variant="ghost"
                    class="bg-green-100 text-green-700 h-9"
                    >Added<CheckCircle /></Button
                  >
                {:else}
                  <Button
                    variant="ghost"
                    class="bg-blue-50 h-9"
                    onclick={() => addCourse(course)}>Add<Plus /></Button
                  >
                {/if}
                <Button
                  variant="ghost"
                  class="bg-blue-50 h-9"
                  onclick={() => openCourse(course.courseId)}
                  >Open<ArrowRight /></Button
                >
              </div>
            </CardContent>
          </Card>
        {/each}
      {:else}
        <div class="text-center p-4 text-gray-500">
          No courses found. Try a different search term.
        </div>
      {/if}
    </div>
  {:else if searchMode && !searching}
    <div class="mt-2">
      <div class="text-center p-8 text-gray-600">
        <Search class="h-8 w-8 mx-auto mb-3 text-gray-400" />
        <p class="text-xl font-medium">Start typing to search for courses</p>
        <p class="text-sm mt-2">Enter a course name, subject, or keyword</p>
      </div>
    </div>
  {:else}
    <Card
      class="mb-4 border-0 bg-blue-100 border-blue-200 border-2 relative overflow-hidden"
      onclick={() => push("/past-exams")}
    >
      <CardContent class="py-4 px-4">
        <div class="flex items-center">
          <span class="text-2xl mr-2">🗒</span>
          <div class="flex-grow">
            <div class="text-xl font-bold">
              {permstate.userInfo.examFocus == "matric"
                ? "Matric Exams"
                : "Exit Exams"}
            </div>
            <div class="text-sm">2016, 2015 and more...</div>
          </div>
          <ArrowRight />
        </div>
      </CardContent>
    </Card>
    {#each permstate.myCourses as course (course)}
      <Card class="mb-3 bg-white text-lg shadow-sm">
        <CardContent>
          <div class="flex items-center justify-between">
            <button
              onclick={() => openCourse(course.courseId)}
              class="hover:underline flex items-center gap-2"
            >
              <span class="text-2xl mr-2">{course.emoji}</span>
              <span class="text-left">{course.courseTitle}</span>
            </button>
            {#if course.isHighschool == false || course.grade != permstate.userInfo.grade}
              <div
                class="relative"
                use:clickOutside={() => (course.showMenu = false)}
              >
                <button
                  class="text-gray-700"
                  onclick={(e) => {
                    e.stopPropagation();
                    course.showMenu = !course.showMenu;
                  }}
                >
                  <EllipsisVertical />
                </button>
                {#if course.showMenu}
                  <div
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                  >
                    <div class="py-1">
                      <button
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onclick={() => openCourse(course.courseId)}>Open</button
                      >
                      <button
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onclick={() => removeCourse(course.courseId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>
    {/each}
  {/if}
</div>

<Dialog bind:open={confirmDeleteDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Remove Course</DialogTitle>
      <DialogDescription>
        Are you sure you want to remove this course? This action cannot be
        undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter class="gap-2">
      <Button variant="outline" onclick={cancelRemoveCourse}>Cancel</Button>
      <Button variant="destructive" onclick={confirmRemoveCourse}>Remove</Button
      >
    </DialogFooter>
  </DialogContent>
</Dialog>
````

## File: src/routes/IntroFour.svelte
````
<script>
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import {
    PanelRight,
    ArrowRight,
    BookOpen,
    Video,
    Brain,
    Lightbulb,
    Dices,
    HelpCircle,
    Info,
    List,
    BookMarked,
    Undo,
  } from "lucide-svelte";
  import { blur, scale } from "svelte/transition";
  import { push } from "svelte-spa-router";
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div
    class="z-10 container flex-grow flex flex-col justify-between py-8 mx-auto p-4"
    in:blur={{ duration: 200 }}
  >
    <div class="text-3xl text-white font-bold text-center">
      How GebiApp works
    </div>
    <div>
      <div class="flex justify-center" in:scale={{ delay: 100, duration: 500 }}>
        <Undo size={80} style="transform: rotate(-15deg);" class="text-white" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
        <!-- First Card -->

        <div in:blur={{ duration: 400, delay: 100 }}>
          <Card
            class="w-full shadow-md bg-black bg-opacity-20 text-white border-gray-700"
          >
            <CardHeader class="p-3">
              <PanelRight size={30} />
              <span class="text-lg font-bold">Learn about</span>
              <span class="text-sm opacity-80">Linear Equations</span>
            </CardHeader>
            <CardContent class="p-3">
              <div class="space-y-2 font-bold">
                {#each [{ icon: BookOpen, text: "Read" }, { icon: Video, text: "Videos" }, { icon: Brain, text: "Simplified" }, { icon: Lightbulb, text: "Fun Facts" }] as item}
                  <div
                    class="flex items-center gap-1 p-2 hover:bg-black hover:bg-opacity-30 rounded-md transition-all cursor-pointer text-sm"
                  >
                    <svelte:component
                      this={item.icon}
                      size={24}
                      class="text-white p-1 rounded-md"
                    />
                    <span>{item.text}</span>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Second Card -->
        <div in:blur={{ duration: 400, delay: 200 }}>
          <Card
            class="w-full shadow-md bg-black bg-opacity-20 text-white border-gray-700"
          >
            <CardHeader class="p-3">
              <Dices size={30} />
              <span class="text-lg font-bold">Quiz on</span>
              <span class="text-sm opacity-80">Linear Equations</span>
            </CardHeader>
            <CardContent class="p-3">
              <div class="space-y-2 font-bold">
                {#each [{ icon: HelpCircle, text: "Hints" }, { icon: Info, text: "Explanations" }, { icon: List, text: "Study Plan" }, { icon: BookMarked, text: "Read Topics" }] as item}
                  <div
                    class="flex items-center gap-1 p-2 hover:bg-black hover:bg-opacity-30 rounded-md transition-all cursor-pointer text-sm"
                  >
                    <svelte:component
                      this={item.icon}
                      size={24}
                      class="text-white p-1 rounded-md"
                    />
                    <span>{item.text}</span>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="flex justify-center" in:scale={{ duration: 500, delay: 400 }}>
        <Undo size={80} style="transform: rotate(165deg);" class="text-white" />
      </div>
    </div>

    <div class="flex justify-center w-full">
      <Button
        class="text-lg bg-blue-500 font-bold"
        variant="default"
        size="lg"
        onclick={() => push("/main")}
      >
        Start Quiz
        <ArrowRight class="ml-2 w-5 h-5" />
      </Button>
    </div>
  </div>
</div>
````

## File: src/routes/IntroOne.svelte
````
<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { GraduationCap, Building, Landmark } from "lucide-svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { blur } from "svelte/transition";

  let selectedFocus = $state("");

  const focusOptions = [
    { id: "highschool", label: "High School (Matric)", icon: Building },
    { id: "undergrad", label: "Undergraduate (College)", icon: Landmark },
    { id: "exitexam", label: "Exit Exam", icon: GraduationCap },
  ];

  const eduFocusClick = (eduFocus: string) => {
    permstate.userInfo = {
      ...permstate.userInfo,
      eduFocus,
      examFocus: eduFocus == "exitexam" ? "exitexam" : "matric",
    };
    save(permstate);
    push("/intro-two");
  };
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div
    in:blur={{ duration: 300 }}
    class="z-10 text-center p-6 w-full max-w-3xl mx-auto"
  >
    <div class="space-y-8">
      <h1 class="text-4xl font-bold text-white mb-16">Welcome to GebiApp</h1>
      <p class="text-xl text-white mb-12">Select your educational focus:</p>

      <div class="flex flex-col gap-2">
        {#each focusOptions as option (option)}
          <Card.Root
            class="bg-black bg-opacity-30 border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer {selectedFocus ===
            option.id
              ? 'border-blue-500'
              : 'border-gray-600'}"
            onclick={() => eduFocusClick(option.id)}
          >
            <Card.Content class="py-4 px-4 flex flex-row items-center">
              <option.icon class="w-5 h-5 text-white mr-3" />
              <h2 class="text-lg font-bold text-white">{option.label}</h2>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </div>
  </div>
</div>
````

## File: src/routes/IntroThree.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label";
  import { ArrowRight, Venus, School } from "lucide-svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { blur } from "svelte/transition";
  import { push } from "svelte-spa-router";

  let school = $state("");
  let selectedGender = $state("");

  const userInfo = permstate.userInfo;

  console.log("userInfo in intro-three", userInfo);

  const setGender = () => {
    permstate.userInfo.gender = selectedGender;
    save(permstate);
  };

  const setSchool = () => {
    permstate.userInfo.school = school;
    save(permstate);
  };

  function handleContinue() {
    push("/intro-four");
  }
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div class="z-10 text-center p-6 w-full" in:blur={{ duration: 200 }}>
    <div class="space-y-6">
      <h1 class="text-4xl font-bold text-white mb-16">
        Tell Us About Yourself
      </h1>

      <div class="w-full flex flex-col items-center gap-6">
        <div class="w-full flex md:w-[280px] mx-auto">
          <div
            class="flex flex-grow items-center gap-2 mt-2 mr-4 mb-2 text-white text-left"
          >
            <Venus class="w-5 h-5" />
            <strong>Gender:</strong>
          </div>
          <RadioGroup.Root
            class="flex gap-6"
            bind:value={selectedGender}
            onchange={() => setGender()}
          >
            <button
              onclick={() => {
                selectedGender = "male";
                setGender();
              }}
              class="flex items-center space-x-2 {selectedGender === 'male'
                ? 'bg-black bg-opacity-70'
                : 'bg-black bg-opacity-20 border-black border-2'} py-2 px-4 rounded-lg"
            >
              <RadioGroup.Item value="male" id="male" />
              <Label for="male" class="text-white">Male</Label>
            </button>
            <button
              onclick={() => {
                selectedGender = "female";
                setGender();
              }}
              class="flex items-center space-x-2 {selectedGender === 'female'
                ? 'bg-black bg-opacity-70'
                : 'bg-black bg-opacity-20 border-black border-2'} py-2 px-4 rounded-lg"
            >
              <RadioGroup.Item value="female" id="female" />
              <Label for="female" class="text-white ">Female</Label>
            </button>
          </RadioGroup.Root>
        </div>

        <div class="w-full md:w-[280px] mb-8">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <School class="w-5 h-5" />
            <strong
              >{userInfo.eduFocus == "highschool"
                ? "School Name"
                : "University/College"}</strong
            >
          </div>
          <Input
            type="text"
            placeholder={userInfo.eduFocus == "highschool"
              ? "Enter your school name"
              : "Enter your university or college"}
            bind:value={school}
            onchange={() => setSchool()}
            class="w-full md:w-[280px] bg-black bg-opacity-20 text-black border-gray-700 placeholder:text-gray-400"
          />
          <div class="text-white opacity-90 mt-2">
            This is important for <strong class="underline">past exams</strong> search
          </div>
        </div>
      </div>
      <Button
        class="mt-16 text-lg bg-blue-500 font-bold"
        variant="default"
        size="lg"
        onclick={handleContinue}
        disabled={!selectedGender || !school}
      >
        Continue
        <ArrowRight class="ml-2 w-5 h-5" />
      </Button>
    </div>
  </div>
</div>
````

## File: src/routes/IntroTwo.svelte
````
<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Combobox from "$lib/mycomps/Combobox.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { ArrowRight, BookOpenText, Calendar } from "lucide-svelte";
  import { blur } from "svelte/transition";
  import { years, fields, grades } from "../config";
  import { onMount } from "svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";

  let eduFocus = "";

  let selectedField = $state("");
  let selectedYear = $state("freshman");
  let isHighSchool = $state(false);

  const triggerContent = $derived(
    isHighSchool
      ? "Select your grade"
      : (years.find((year) => year.value === selectedYear)?.label ??
          "Select your year"),
  );

  function handleContinue() {
    permstate.userInfo = {
      ...permstate.userInfo,
      dept: selectedField,
      yearOfStudy: selectedYear,
    };
    save(permstate);
    push("/intro-three");
  }

  const selectGrade = (grade: string) => {
    permstate.userInfo.grade = grade;
    save(permstate);
    push("/intro-three");
  };

  onMount(() => {
    if (permstate?.userInfo?.eduFocus) {
      eduFocus = permstate.userInfo.eduFocus;
      isHighSchool = eduFocus === "highschool";
    }
  });
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div class="z-10 text-center p-6 w-full" in:blur={{ duration: 200 }}>
    <div class="space-y-6">
      <h1 class="text-4xl font-bold text-white mb-16">
        {isHighSchool ? "Tell us about class" : "Tell us about your field"}
      </h1>

      {#if isHighSchool}
        <div class="w-full max-w-md mx-auto">
          <div class="flex items-center gap-2 mb-4 text-white text-left">
            <Calendar class="w-5 h-5" />
            <span>Select your grade level:</span>
          </div>
          <div class="flex flex-col gap-2">
            {#each grades as grade (grade)}
              <Card.Root
                class="bg-black bg-opacity-30 border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer border-gray-600"
                onclick={() => selectGrade(grade.value)}
              >
                <Card.Content class="py-4 px-6 flex flex-row items-center">
                  <h2 class="text-lg font-bold text-white">{grade.label}</h2>
                </Card.Content>
              </Card.Root>
            {/each}
          </div>
        </div>
      {:else}
        <div class="w-full flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <BookOpenText class="w-5 h-5" />
            <span>Department/Field</span>
          </div>
          <Combobox
            items={fields}
            bind:value={selectedField}
            placeholder="Select your field of study"
            buttonClass="text-white font-bold py-6 w-full md:w-[280px] justify-between bg-opacity-95"
            contentClass="w-full md:w-[280px] p-0"
            searchPlaceholder="Search fields..."
            emptyMessage="No field found"
          />
        </div>
        <div class="w-full md:w-[280px]">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <Calendar class="w-5 h-5" />
            <span>Year of Study</span>
          </div>
          <Select.Root
            type="single"
            name="yearOfStudy"
            bind:value={selectedYear}
          >
            <Select.Trigger
              class="w-full md:w-[280px] py-6 bg-black bg-opacity-20 text-white font-bold border-white"
            >
              {triggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each years as year (year)}
                  <Select.Item value={year.value} label={year.label}>
                    {year.label}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Button
          class="mt-4 text-lg bg-blue-500 font-bold"
          variant="default"
          size="lg"
          disabled={isHighSchool ? false : !selectedField}
          onclick={handleContinue}
        >
          Continue
          <ArrowRight class="w-8 h-8" />
        </Button>
      {/if}
    </div>
  </div>
</div>
````

## File: src/routes/MainScreen.svelte
````
<script lang="ts">
  import { blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Home, Newspaper, Settings } from "lucide-svelte";
  import HomeScreen from "./Home.svelte";
  import News from "./News.svelte";
  import SettingsScreen from "./Settings.svelte";

  let activeScreen = $state("home");

  function switchScreen(screenName: string) {
    activeScreen = screenName;
  }
</script>

<div class="mx-auto bg-background">
  <div class="screen-container relative min-h-screen">
    {#if activeScreen === "home"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <HomeScreen />
      </div>
    {:else if activeScreen === "course"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <News />
      </div>
    {:else if activeScreen === "settings"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <SettingsScreen />
      </div>
    {/if}
  </div>

  <div
    class="fixed bottom-0 left-0 w-full p-1 bg-blue-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100"
  >
    <div class="flex justify-around items-center">
      <button
        onclick={() => switchScreen("home")}
        class={activeScreen === "home"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Home
          size="24"
          class={activeScreen === "home" ? "text-white" : "text-white/60"}
        />
      </button>
      <button
        onclick={() => switchScreen("course")}
        class={activeScreen === "course"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Newspaper
          size="24"
          class={activeScreen === "course" ? "text-white" : "text-white/60"}
        />
      </button>
      <button
        onclick={() => switchScreen("settings")}
        class={activeScreen === "settings"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Settings
          size="24"
          class={activeScreen === "settings" ? "text-white" : "text-white/60"}
        />
      </button>
    </div>
  </div>
</div>
````

## File: src/routes/Matric.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Loader2, Play } from "lucide-svelte";
  import { slide } from "svelte/transition";
  import { permstate, tempstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getMatricExam, getQuizQuestions } from "$lib/api";
  import type { MatricExam } from "$lib/types";

  const { params } = $props();
  const { examId, subjectId } = params;

  let exam: MatricExam | null = $state(null);
  let subject: MatricExam["subjects"] | null = $state(null);
  let progress: Record<string, number> = $state({});
  let loading: boolean = $state(true);
  let quizLoading: string | null = $state(null);
  let activeTab = $state("g9-10");

  async function startExam(id = "all") {
    quizLoading = id;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data } = await getQuizQuestions();
    if (id != "all") {
      tempstate.quiz.chapters = [id];
    }
    tempstate.quiz.questions = data;
    push("/exam");
  }

  // Fetch the exam data when component mounts
  onMount(async () => {
    tempstate.quiz.focus = "matric";
    tempstate.quiz.examId = examId;
    exam = permstate.matricExams?.find((e) => e.examId == examId);
    if (!exam) {
      const { data } = await getMatricExam(examId);
      exam = data;
    }

    subject = exam.subjects.find((s) => s.subjectId == subjectId);
    progress = getExamProgress(exam, examId, permstate.matricExamProgress);
    loading = false;

    permstate.matricExams = [...(permstate.matricExams || []), exam];
    progress = getExamProgress(exam, examId, permstate.matricExamProgress);

    save(permstate);
  });

  function getExamProgress(
    currentExam: MatricExam | null,
    examIdentifier: string,
    progressData: Record<
      string,
      | Record<string, Record<string, (string | undefined)[]> | undefined>
      | undefined
    >,
  ) {
    if (!currentExam || !examIdentifier) return {};

    const subjectProgress = progressData?.[examIdentifier]?.[subjectId] || {};
    const result: Record<string, number> = {};

    for (const chapterId in subjectProgress) {
      const nqs = [
        ...new Set(subjectProgress[chapterId]?.filter((x) => x) || []),
      ].length;
      result[chapterId] = nqs;
    }

    return result;
  }
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      {#if loading}
        <Skeleton class="h-10 w-60 bg-blue-400/50" />
      {:else}
        <h1 class="text-3xl mb-2 font-bold text-white text-right">
          {subject?.subjectTitle || "Loading..."}
        </h1>
      {/if}
    </div>
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <button
          class="px-4 py-2 text-sm rounded-full font-semibold transition-all {activeTab ===
          'g9-10'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "g9-10")}
          disabled={quizLoading !== null}
        >
          9-10
        </button>
        <button
          class="px-4 py-2 text-sm rounded-full font-semibold transition-all {activeTab ===
          'g11-12'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "g11-12")}
          disabled={quizLoading !== null}
        >
          11-12
        </button>
      </div>
      <Button
        variant="ghost"
        class="bg-blue-100 font-bold"
        onclick={() => startExam()}
        disabled={quizLoading !== null}
      >
        {#if quizLoading === "all"}
          <Loader2 class="w-5 h-5 mr-1 animate-spin" />
          Loading...
        {:else}
          <Play class="w-5 h-5 mr-1" />
          Start Exam
        {/if}
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="space-y-4 mb-8">
      {#if exam && !loading}
        {#each subject?.chapters.filter((chapter) => chapter.gradeGroup === activeTab) as chapter (chapter)}
          <div class="mb-6" in:slide={{ duration: 150 }}>
            <div class="p-3 rounded-lg border space-y-3">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">{chapter.chapterTitle}</h2>
                <span class="text-gray-700 font-bold text-sm text-right"
                  >{progress[chapter.chapterId] || 0}/{chapter.questionCount}
                  Qs</span
                >
              </div>
              <div class="h-3 bg-gray-200 rounded-full mb-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {((progress[chapter.chapterId] || 0) * 100) /
                    chapter.questionCount}%"
                ></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() =>
                    push(`/topic/${subjectId}/${chapter.chapterId}`)}
                  class="flex items-center justify-center"
                  disabled={quizLoading !== null}
                >
                  <BookOpen class="w-4 h-4 mr-1" />
                  <span>Read</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => startExam(chapter.chapterId)}
                  class="flex items-center justify-center"
                  disabled={quizLoading !== null}
                >
                  {#if quizLoading === chapter.chapterId}
                    <Loader2 class="w-4 h-4 mr-1 animate-spin" />
                    <span>Loading</span>
                  {:else}
                    <Play class="w-4 h-4 mr-1" />
                    <span>Exam Chapter</span>
                  {/if}
                </Button>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="space-y-4">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="mb-6">
              <div class="p-3 rounded-lg border space-y-3">
                <div class="flex justify-between items-center">
                  <Skeleton class="h-7 w-40" />
                  <Skeleton class="h-5 w-16" />
                </div>
                <Skeleton class="h-3 w-full rounded-full" />
                <div class="flex flex-wrap gap-2">
                  <Skeleton class="h-9 w-20" />
                  <Skeleton class="h-9 w-28" />
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
````

## File: src/routes/MatricSubjects.svelte
````
<script lang="ts">
  import {
    ArrowLeft,
    BookOpen,
    Atom,
    Calculator,
    Globe,
    Microscope,
    FlaskConical,
    Leaf,
    Camera,
    Building,
    Landmark,
    BadgeDollarSign,
    Languages,
    BookText,
    Cpu,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { permstate, save } from "$lib/state.svelte";
  import type { MatricExam } from "../types.d.ts";
  import { getMatricExam } from "$lib/api.ts";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { push } from "svelte-spa-router";

  const { params } = $props();
  let exam: MatricExam | null = $state(null);
  let loading = $state(true);
  let progress: Record<string, number> = $state({});

  function getSubjectProgress(
    progress: typeof permstate.matricExamProgress,
    exam: MatricExam,
  ): Record<string, number> {
    if (!exam || !progress || !progress[exam.examId]) {
      return {};
    }

    const result: Record<string, number> = {};
    const examProgress = progress[exam.examId];

    for (const subject of exam.subjects) {
      const subjectId = subject.subjectId;
      const subjectProgress = examProgress?.[subjectId];

      if (!subjectProgress) {
        result[subjectId] = 0;
        continue;
      }

      let answeredCount = 0;
      let totalCount = 0;

      for (const chapter of subject.chapters) {
        const chapterProgress = subjectProgress[chapter.chapterId];

        if (chapterProgress) {
          answeredCount += chapterProgress.filter(
            (q) => q !== undefined,
          ).length;
          totalCount += chapterProgress.length;
        } else {
          totalCount += chapter.questionCount;
        }
      }

      result[subjectId] =
        totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    }

    return result;
  }

  onMount(async () => {
    exam = permstate.matricExams.find((e) => e.examId == params.examId);
    if (!exam) {
      const { data } = await getMatricExam(params.examId);
      exam = data;
      permstate.matricExams = [data, ...(permstate.exitExams || [])];
      save(permstate);
    }
    progress = getSubjectProgress(permstate.matricExamProgress, exam);
    loading = false;
  });

  function handleClick(subjectId: string) {
    push(`/matric/${exam?.examId}/${subjectId}`);
  }

  $inspect("the progress of each subject", progress);

  const subjectIcons = {
    agri: Leaf,
    amh: Camera,
    bio: Microscope,
    chem: FlaskConical,
    civics: Landmark,
    eco: BadgeDollarSign,
    eng: Languages,
    general: BookText,
    bus: Building,
    geo: Globe,
    hist: BookOpen,
    ict: Cpu,
    math: Calculator,
    phy: Atom,
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white text-right">
        {loading ? "Loading..." : exam?.examTitle || "Matric Exam"}
      </h1>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    {#if loading}
      <div class="grid grid-cols-2 gap-4 mb-8">
        {#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
          <div class="p-4 rounded-lg border">
            <div class="flex flex-col items-center text-center">
              <Skeleton class="w-10 h-10 mb-2 rounded-full" />
              <Skeleton class="h-4 w-24 mb-3" />
              <Skeleton class="w-full h-2 rounded-full mt-3" />
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-4 mb-8">
        {#each exam?.subjects || [] as subject (subject.subjectId)}
          <button
            class="p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            onclick={() => handleClick(subject.subjectId)}
          >
            <div class="flex flex-col items-center text-center">
              {#if subjectIcons[subject.subjectId.toLowerCase()]}
                {@const IconComponent =
                  subjectIcons[subject.subjectId.toLowerCase()]}
                <IconComponent class="w-10 h-10 mb-2 text-blue-500" />
              {:else}
                <BookText class="w-10 h-10 mb-2 text-blue-500" />
              {/if}
              <h3 class="font-bold">{subject.subjectTitle}</h3>
              <div class="w-full h-2 bg-gray-200 rounded-full mt-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {progress[subject.subjectId] || 0}%"
                ></div>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
````

## File: src/routes/Module.svelte
````
<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowLeft } from "lucide-svelte";
  import ky from "ky";

  let start = 1;
  let end = 27;

  let pages: any[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      // Create array of promises for page fetches
      const promises = [];
      for (let i = start; i <= end; i++) {
        promises.push(ky.get(`/logic/page-${i}.html`).text());
      }

      // Fetch all pages in parallel
      pages = await Promise.all(promises);
      loading = false;
    } catch (error) {
      console.error("Error fetching pages:", error);
      loading = false;
    }
  });
</script>

<main class="h-screen flex flex-col">
  <header
    class="sticky top-0 left-0 right-0 bg-blue-500 p-4 flex items-center z-10 shadow-md rounded-b-2xl"
  >
    <button onclick={() => history.back()}>
      <ArrowLeft color="white" />
    </button>
  </header>
  <div class="overflow-y-auto">
    {#if loading}
      <div class="text-center py-8 text-xl text-gray-600">Loading...</div>
    {:else}
      {#each pages as page}
        {@html page}
      {/each}
    {/if}
  </div>
</main>
````

## File: src/routes/News.svelte
````
<script>
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Home, ArrowRight, Newspaper, Settings } from "lucide-svelte";
</script>

<div class="bg-accent min-h-screen flex flex-col" style="padding-bottom: 80px">
  <div class="flex pt-8 px-4 flex-grow items-center">
    <span class="px-4 text-center">
      <h1 class="text-2xl font-bold mb-2 text-gray-900">Coming Soon</h1>

      <p class="text-gray-600 max-w-md mx-auto">
        Personalized news feed for your learning journey coming soon!
      </p>
    </span>

    <span class="flex-grow" />
    <!-- <Card
      class="border-0 shadow-lg max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-black to-orange-950 text-white"
    >
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 rounded-full overflow-hidden">
            <img
              src="https://randomuser.me/api/portraits/men/30.jpg"
              alt="Euel"
              class="h-full w-full object-cover"
            />
          </div>
          <CardTitle style="font-size: 1.2rem"
            >Hey it's Euel, creator of this app</CardTitle
          >
        </div>
      </CardHeader>
      <CardContent>
        <p
          class="text-white opacity-80 mb-6 text-lg"
          style="font-size: 1.125rem; line-height: 1.2"
        >
          Join my telegram channel if you're interested in <strong
            class="text-white opacity-100 underline"
            >building apps and AI</strong
          >
        </p>
        <a
          href="https://t.me/euelchannel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="default"
            class="bg-orange-600 font-bold hover:bg-blue-600"
          >
            Join Channel
            <ArrowRight class="ml-1" color="white" size={18} />
          </Button>
        </a>
      </CardContent>
    </Card> -->
  </div>

  <!-- <div
    class="fixed bottom-0 left-0 w-full p-1 bg-blue-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-3xl"
  >
    <div class="flex justify-around items-center">
      <a href="/" class="p-4 rounded-lg">
        <Home size="24" color="white" />
      </a>
      <div class="py-2 px-6 rounded-lg bg-blue-100">
        <Newspaper size="24" class="text-blue-500" />
      </div>
      <div class="p-4 rounded-lg">
        <Settings size="24" color="white" />
      </div>
    </div>
  </div> -->
</div>
````

## File: src/routes/PastExams.svelte
````
<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExams, getMatricExams } from "$lib/api";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import type { ExitExam, MatricExam } from "$lib/types";

  let examFocus = $state(permstate.userInfo?.examFocus || "exitexam");
  let loading: boolean = $state(true);

  onMount(async () => {
    // Determine exam type based on user preference
    examFocus = permstate.userInfo?.examFocus || "exitexam";
    loading = true;
    // permstate.examFocus = "matric";

    if (examFocus === "exitexam") {
      // If we have exit exams in state, use them immediately but still fetch in background
      if (permstate.exitExams && permstate.exitExams.length > 0) {
        loading = false;
      }

      // Fetch exit exams in background and update permstate
      try {
        const { data } = await getExitExams();
        if (!permstate.exitExams || permstate.exitExams.length === 0) {
          permstate.exitExams = data;
          loading = false;
        } else {
          // Merge new data with existing data, preventing duplicates based on examId
          const existingExamIds = new Set(
            permstate.exitExams.map((exam) => exam.examId),
          );
          const newExams = data.filter(
            (exam) => !existingExamIds.has(exam.examId),
          );

          // Update existing exams and add new ones
          permstate.exitExams = [
            ...permstate.exitExams.map((existingExam) => {
              // Find matching exam in new data to update properties
              const updatedExam = data.find(
                (e) => e.examId === existingExam.examId,
              );
              return updatedExam
                ? { ...existingExam, ...updatedExam }
                : existingExam;
            }),
            ...newExams,
          ];
        }
        save(permstate);
      } catch (error) {
        console.error("Failed to fetch exit exams:", error);
        if (!permstate.exitExams || permstate.exitExams.length === 0) {
          loading = false;
        }
      }
    } else if (examFocus === "matric") {
      // If we have matric exams in state, use them immediately but still fetch in background
      if (permstate.matricExams && permstate.matricExams.length > 0) {
        loading = false;
      }

      // Fetch matric exams in background and update permstate
      try {
        const { data } = await getMatricExams();
        if (!permstate.matricExams || permstate.matricExams.length === 0) {
          permstate.matricExams = data;
          loading = false;
        } else {
          // Merge new data with existing data, preventing duplicates based on examId
          const existingExamIds = new Set(
            permstate.matricExams.map((exam) => exam.examId),
          );
          const newExams = data.filter(
            (exam) => !existingExamIds.has(exam.examId),
          );

          // Update existing exams and add new ones
          permstate.matricExams = [
            ...permstate.matricExams.map((existingExam) => {
              // Find matching exam in new data to update properties
              const updatedExam = data.find(
                (e) => e.examId === existingExam.examId,
              );
              return updatedExam
                ? { ...existingExam, ...updatedExam }
                : existingExam;
            }),
            ...newExams,
          ];
        }
        save(permstate);
      } catch (error) {
        console.error("Failed to fetch matric exams:", error);
        if (!permstate.matricExams || permstate.matricExams.length === 0) {
          loading = false;
        }
      }
    }
  });

  function calculateExitExamProgress(examId: string) {
    if (!examId) return { completedQuestions: 0, totalQuestions: 0 };

    const exam = permstate.exitExams?.find((e) => e.examId === examId);
    if (!exam) return { completedQuestions: 0, totalQuestions: 0 };

    const progressData = permstate.exitExamProgress?.[examId] || {};
    let totalQuestionsCount = 0;
    let totalAnsweredCount = 0;

    if (exam.courses) {
      for (const course of exam.courses) {
        const courseId = course.courseId;
        const courseProgress = progressData[courseId] || [];
        totalQuestionsCount += course.questionCount || 0;

        const uniqueAnsweredQuestions = new Set(
          courseProgress
            .map((answer, index) => (answer !== undefined ? index : -1))
            .filter((index) => index !== -1),
        );

        totalAnsweredCount += uniqueAnsweredQuestions.size;
      }
    }

    return {
      completedQuestions: totalAnsweredCount,
      totalQuestions: totalQuestionsCount,
    };
  }

  function calculateMatricExamProgress(examId: string) {
    if (!examId) return { completedQuestions: 0, totalQuestions: 0 };

    const exam = permstate.matricExams?.find((e) => e.examId === examId);
    if (!exam) return { completedQuestions: 0, totalQuestions: 0 };

    const examProgressData = permstate.matricExamProgress?.[examId] || {};
    let totalQuestionsCount = 0;
    let totalAnsweredCount = 0;

    if (exam.subjects) {
      for (const subject of exam.subjects) {
        const subjectId = subject.subjectId;
        const subjectProgress = examProgressData[subjectId] || {};

        for (const chapter of subject.chapters) {
          const chapterId = chapter.chapterId;
          const chapterProgress = subjectProgress[chapterId] || [];
          totalQuestionsCount += chapter.questionCount || 0;

          const uniqueAnsweredQuestions = new Set(
            chapterProgress.filter((answer) => answer !== undefined),
          );

          totalAnsweredCount += uniqueAnsweredQuestions.size;
        }
      }
    }

    return {
      completedQuestions: totalAnsweredCount,
      totalQuestions: totalQuestionsCount,
    };
  }

  function navigateToExam(exam: ExitExam | MatricExam) {
    if (examFocus === "exitexam") {
      push(`/exitexam/${exam.examId}`);
    } else if (examFocus === "matric") {
      // For matric exams, we need to select a subject first
      // Using the first subject as default if available
      const matricExam = exam as MatricExam;
      if (matricExam.subjects && matricExam.subjects.length > 0) {
        push(`/matric/${exam.examId}/${matricExam.subjects[0].subjectId}`);
      } else {
        push(`/matric/${exam.examId}`);
      }
    }
  }
</script>

<div class="container mx-auto p-4 pt-8 bg-accent min-h-screen">
  <div class="flex gap-4 items-center">
    <ArrowLeft />
    <span class="text-2xl"
      >{examFocus === "exitexam" ? "Exit Exams" : "Matriculation Exams"}</span
    >
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {#if loading}
      {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
        <div
          class="card bg-white border-2 border-gray-200 rounded-lg overflow-hidden p-4 space-y-3"
        >
          <div class="flex justify-between items-center">
            <Skeleton class="h-6 w-40" />
            <Skeleton class="h-4 w-16" />
          </div>
          <Skeleton class="h-4 w-full rounded-full" />
        </div>
      {/each}
    {:else}
      {#each examFocus === "exitexam" ? permstate.exitExams || [] : permstate.matricExams || [] as exam (exam.examId)}
        {@const progress =
          examFocus === "exitexam"
            ? calculateExitExamProgress(exam.examId)
            : calculateMatricExamProgress(exam.examId)}
        <button
          class="card bg-white border-2 border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onclick={() => navigateToExam(exam)}
        >
          <div class="card-header px-4 pt-4 pb-2">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">{exam.examTitle}</h2>
              <span class="text-gray-700 text-right font-bold text-sm">
                {progress.completedQuestions || 0}/{progress.totalQuestions ||
                  0} Qs
              </span>
            </div>
          </div>
          <div class="card-content px-4 py-2 pb-4">
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                class="bg-blue-400 h-4 rounded-full"
                style="width: {progress.totalQuestions
                  ? (progress.completedQuestions / progress.totalQuestions) *
                    100
                  : 0}%"
              ></div>
            </div>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
````

## File: src/routes/PostQuiz.svelte
````
<script lang="ts">
  import {
    X,
    Star,
    Clock,
    CheckSquare,
    PlayCircle,
    ClipboardList,
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { tempstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";

  let count = $state(0);
  let showContent = $state(false);
  let correctAnswers = $state(0);
  let totalQuestions = $state(0);
  let timeTaken = $state(0);
  let performanceMessage = $state("");

  function goBackUntilUrl(searchString: string) {
    const navigateBack = () => {
      const currentUrl = window.location.href;
      if (currentUrl.includes(searchString)) {
        // Found the target URL
        return;
      }

      // Go back one step in history
      window.history.back();

      // Check again after a short delay to allow navigation to complete
      setTimeout(() => {
        // If we're still not at the target URL, try again
        if (!window.location.href.includes(searchString)) {
          navigateBack();
        }
      }, 100);
    };

    navigateBack();
  }

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function getPerformanceMessage(percentage: number): string {
    if (percentage >= 90) return "Outstanding!";
    if (percentage >= 80) return "Excellent!";
    if (percentage >= 70) return "Great Job!";
    if (percentage >= 60) return "Good Work!";
    if (percentage >= 50) return "Nice Effort!";
    return "Keep Practicing!";
  }

  onMount(() => {
    totalQuestions = tempstate.quiz.questions.length;
    correctAnswers = tempstate.quiz.questions.filter(
      (q) => q.isUserCorrect === true,
    ).length;
    timeTaken = tempstate.quiz.timeTook || 0;

    // Calculate percentage and set performance message
    const percentage = (correctAnswers / totalQuestions) * 100;
    performanceMessage = getPerformanceMessage(percentage);

    // Set the target score (5 points per correct answer)
    const targetScore = correctAnswers * 5;

    // Animate the score counter
    const duration = 1000; // 1 second
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      count = Math.min(
        targetScore,
        Math.floor((progress / duration) * targetScore),
      );

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        count = targetScore;
        showContent = true;
      }
    };

    requestAnimationFrame(animate);
  });

  function handleClose() {
    console.log("idk where to go man");
  }
  const moreQuestions = () => {
    push(`/select-topics`);
  };
  const studyPlan = () => {
    push(`/study-plan`);
  };
</script>

<div
  transition:fade={{ duration: 200 }}
  class="min-h-screen bg-blue-500 flex flex-col"
>
  <div class="p-4">
    <button onclick={() => goBackUntilUrl("main")}>
      <X class="h-6 w-6 text-white" />
    </button>
  </div>

  <div class="flex flex-col flex-1 items-center justify-center">
    <div class="flex items-center justify-center gap-3 mb-4">
      <Star class="h-12 w-12 fill-yellow-400 text-yellow-400" />
      <span class="text-7xl font-bold text-white">{count}</span>
    </div>
    <div class="text-center">
      <h2 class="text-3xl font-bold text-white">{performanceMessage}</h2>
    </div>

    <div class="flex items-center justify-center gap-8 mt-8">
      <div class="flex items-center gap-2">
        <CheckSquare class="h-5 w-5 text-white" />
        <span class="text-2xl font-bold text-white"
          >{correctAnswers}/{totalQuestions}</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Clock class="h-5 w-5 text-white" />
        <span class="text-2xl font-bold text-white"
          >{formatTime(timeTaken)}</span
        >
      </div>
    </div>
  </div>

  <div
    transition:fly={{ y: 100, duration: 500 }}
    class="bg-white rounded-t-3xl flex-1 px-6 flex flex-col justify-center"
  >
    <div class="w-4/5 mx-auto space-y-4">
      <Button
        variant="primary"
        onclick={studyPlan}
        class="bg-blue-500 text-white w-full py-6 text-lg"
        ><ClipboardList class="mr-2 h-5 w-5" />Create Study Plan</Button
      >
      <Button
        variant="ghost"
        class="bg-blue-100 w-full py-6 text-lg"
        onclick={moreQuestions}
        ><PlayCircle class="mr-2 h-5 w-5" />More Questions</Button
      >
    </div>
  </div>
</div>
````

## File: src/routes/QuestType.svelte
````
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, LoaderCircle } from "lucide-svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { location } from "svelte-spa-router";
  import { getQuizQuestions } from "$lib/api";

  let isLoading = $state(false);

  let selectedTypes = $state({
    multipleChoice: permstate?.qtypes?.multipleChoice ?? true,
    trueFalse: permstate?.qtypes?.trueFalse ?? true,
    shortAnswer: permstate?.qtypes?.shortAnswer ?? true,
  });

  async function handleContinue() {
    // Map selected types to the format expected by the Quiz interface
    isLoading = true;
    const qtypes: string[] = [];

    if (selectedTypes.multipleChoice) {
      qtypes.push("choice");
    }

    if (selectedTypes.trueFalse) {
      qtypes.push("tf");
    }

    if (selectedTypes.shortAnswer) {
      qtypes.push("workout");
    }

    // Update the quiz in tempstate with selected question types
    const { data } = await getQuizQuestions();
    tempstate.quiz = {
      ...tempstate.quiz,
      qtypes: qtypes,
      questions: data,
    };
    permstate.qtypes = selectedTypes;
    save(permstate);
    push(`/quiz/0`);
  }

  let isContinueDisabled = $derived(
    !Object.values(selectedTypes).some((value) => value) || isLoading,
  );
</script>

<div
  class="flex flex-col justify-center items-center h-screen gap-8 p-8 bg-blue-50"
>
  <div class="space-y-4 text-center">
    <p class="text-3xl font-semibold mb-16">Select Question Types</p>
    <div class="flex flex-col gap-4">
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.multipleChoice}
        class:bg-blue-100={selectedTypes.multipleChoice}
      >
        <Checkbox bind:checked={selectedTypes.multipleChoice} size="lg" />
        <span class="text-xl">Multiple Choice</span>
      </label>
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.trueFalse}
        class:bg-blue-100={selectedTypes.trueFalse}
      >
        <Checkbox bind:checked={selectedTypes.trueFalse} size="lg" />
        <span class="text-xl">True/False</span>
      </label>
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.shortAnswer}
        class:bg-blue-100={selectedTypes.shortAnswer}
      >
        <Checkbox bind:checked={selectedTypes.shortAnswer} size="lg" />
        <span class="text-xl">Short Answer/Workout</span>
      </label>
    </div>
  </div>
  <Button
    onclick={handleContinue}
    disabled={isContinueDisabled}
    size="lg"
    class="text-lg font-bold w-full mt-8"
  >
    Next
    {#if isLoading}
      <LoaderCircle class="animate-spin" />{:else}
      <ArrowRight />
    {/if}
  </Button>
</div>
````

## File: src/routes/Quiz.svelte
````
<script lang="ts">
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import Question from "$lib/mycomps/Question.svelte";
  import { location } from "svelte-spa-router";

  let currentQuestionIndex = $state(parseInt(params.index) || 0);

  const { params } = $props();

  console.log(
    "the quiz given to me",
    JSON.stringify($state.snapshot(tempstate.quiz), null, 2),
  );

  let currentProgress = $state(0);
  let showSolution = $state(false);
  let selectedAnswer: string | null = $state(null);

  let isCorrect: boolean | null = $state(null);
  let solution: string = $state("");

  let seconds = $state(0);
  let timerInterval: number | null = $state(null);
  let isPaused = $state(false);

  function startTimer() {
    if (timerInterval) return; // Don't start if already running
    timerInterval = setInterval(() => {
      if (!isPaused) {
        seconds++;
      }
    }, 1000);
  }
  const showAnswerForWorkout = () => {
    showSolution = true;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true;
  };

  onMount(() => {
    updateProgress();
    startTimer();

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  });

  function updateProgress() {
    currentProgress =
      ((currentQuestionIndex + 1) / tempstate.quiz.questions.length) * 100;
  }

  function handleAnswerSelect(answer: string) {
    selectedAnswer = answer;
    const currentQuestion = tempstate.quiz.questions[currentQuestionIndex];
    isCorrect = answer == currentQuestion.metadata.correctAnswer;
    solution = currentQuestion.solution;
    showSolution = true;
    tempstate.quiz.questions[currentQuestionIndex].isUserCorrect = isCorrect;
    tempstate.quiz.questions[currentQuestionIndex].userAnswer = answer;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true; // Mark question as answered
    isPaused = true;

    setTimeout(() => {
      const solutionElement = document.getElementById("solution");
      if (solutionElement) {
        solutionElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  async function handleWorkoutAnswer(gotItRight: boolean) {
    showSolution = true;
    isCorrect = gotItRight;
    tempstate.quiz.questions[currentQuestionIndex].isUserCorrect = gotItRight;
    tempstate.quiz.questions[currentQuestionIndex].isAnswered = true; // Mark workout question as answered
    solution = tempstate.quiz.questions[currentQuestionIndex].solution;
    isPaused = true;
    handleNext();
  }

  function goBack() {
    window.history.back();
  }

  function handleDone() {
    // Remove unanswered questions from the quiz
    tempstate.quiz.questions = tempstate.quiz.questions.filter(
      (question) => question.isAnswered,
    );

    finishQuiz();
  }

  // instead of adding just the topic file names make it like courseId:filename; you can access courseId from question.courseId
  //
  function quizStudyPlan() {
    const topicCounts = tempstate.quiz.questions.reduce((acc, question) => {
      if (question.isAnswered && question.metadata.topic) {
        const topic = question.metadata.topic.filename;
        acc[topic] = acc[topic] || {
          correct: 0,
          total: 0,
          title: question.metadata.topic.title,
          courseId: question.courseId,
          courseTitle: question.courseTitle,
          chapterTitle: question.chapterTitle,
          chapterFilename: question.chapterFilename,
        };
        acc[topic].total++;
        if (question.isUserCorrect) acc[topic].correct++;
      }
      return acc;
    }, {});

    const strongTopics = [];
    const weakTopics = [];
    Object.entries(topicCounts).forEach(([topicFilename, stats]) => {
      const topicObj = {
        filename: topicFilename,
        courseId: stats.courseId,
        courseTitle: stats.courseTitle,
        title: stats.title,
        chapterTitle: stats.chapterTitle,
        chapterFilename: stats.chapterFilename,
      };
      const correctPercentage = stats.correct / stats.total;
      if (correctPercentage >= 0.7) {
        strongTopics.push({
          ...topicObj,
          total: stats.total,
          percentage: correctPercentage,
        });
      } else {
        weakTopics.push({
          ...topicObj,
          total: stats.total,
          percentage: correctPercentage,
        });
      }
    });

    // Sort weak topics by ascending percentage (worst performance first)
    weakTopics.sort((a, b) => a.percentage - b.percentage);

    // Sort strong topics by descending total number of questions (most questions first)
    strongTopics.sort((a, b) => b.total - a.total);

    // Convert back to the expected format, including title in the output
    return {
      strongTopics: strongTopics.map(
        ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }) => ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }),
      ),
      weakTopics: weakTopics.map(
        ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }) => ({
          filename,
          courseId,
          title,
          courseTitle,
          chapterTitle,
          chapterFilename,
        }),
      ),
    };
  }
  function matricStudyPlan() {}

  function createStudyPlan() {
    if (tempstate.quiz.focus == "normal" || tempstate.quiz.focus == "exitexam")
      return quizStudyPlan();
    if (tempstate.quiz.focus == "matric") return matricStudyPlan();
  }

  function finishQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    tempstate.quiz.timeTook = seconds;

    // for quiz; think for exit and matric
    permstate.quizResults = [createStudyPlan(), ...permstate.quizResults];

    permstate.stars =
      (permstate.stars || 0) +
      tempstate.quiz.questions.filter(({ isUserCorrect }) => isUserCorrect)
        .length *
        5;
    save(permstate);
    push("/post-quiz");
  }

  function handleNext() {
    if (currentQuestionIndex >= tempstate.quiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    const nextIndex = currentQuestionIndex + 1;
    selectedAnswer = null;
    showSolution = false;
    isCorrect = null;
    solution = "";
    currentQuestionIndex = nextIndex;
    updateProgress();
    isPaused = false;
    push(`/quiz/${nextIndex}`);
  }

  function getQuestionOptions(question: Question) {
    if (question.metadata.questionType === "multiple-choice") {
      // Use the options property directly
      return question.options.map((text, index) => {
        return { value: index, text };
      });
    } else if (question.metadata.questionType === "true-false") {
      return [
        { value: "true", text: "True" },
        { value: "false", text: "False" },
      ];
    }
    return [];
  }

  function report() {
    tempstate.report.question = {
      questionId: tempstate.quiz.questions[currentQuestionIndex].question.id,
      questionText: tempstate.quiz.questions[currentQuestionIndex].question,
    };
    push("/report");
  }

  $effect(() => {
    if ($location) {
      const match = $location.match(/\/quiz\/(\d+)$/);
      if (match && match[1]) {
        const newIndex = parseInt(match[1]);
        if (!isNaN(newIndex) && newIndex !== currentQuestionIndex) {
          currentQuestionIndex = newIndex;
          selectedAnswer = null;
          showSolution = false;
          isCorrect = null;
          solution = "";
          updateProgress();
        }
      }
    }
  });
</script>

{#if tempstate.quiz.questions.length > 0}
  <Question
    question={tempstate.quiz.questions[currentQuestionIndex].question}
    options={getQuestionOptions(tempstate.quiz.questions[currentQuestionIndex])}
    solution={solution ||
      tempstate.quiz.questions[currentQuestionIndex].solution}
    hint={tempstate.quiz.questions[currentQuestionIndex]?.hint}
    {showSolution}
    {selectedAnswer}
    {isCorrect}
    {handleAnswerSelect}
    {handleWorkoutAnswer}
    {handleNext}
    {currentProgress}
    {seconds}
    {goBack}
    {currentQuestionIndex}
    {showAnswerForWorkout}
    {handleDone}
    {report}
    questionType={tempstate.quiz.questions[currentQuestionIndex].metadata
      .questionType}
    totalQuestions={tempstate.quiz.questions.length}
  />
{/if}
````

## File: src/routes/Report.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, BookOpen, CircleHelp } from "lucide-svelte";
  import { tempstate } from "$lib/state.svelte.ts";
  import { reportFeedback } from "$lib/api";
  import { toast } from "svelte-sonner";
  import { Loading } from "$lib/components/ui/command";

  let issue = $state("");
  let loading = $state(false);

  const handleSend = async () => {
    loading = true;
    await reportFeedback({
      ...tempstate.report,
      issue: issue,
    });
    loading = false;
    toast("Report sent successfully");
    window.history.back();
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-4 rounded-b-3xl">
    <div class="flex items-center gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl pt-4 px-4">
    <div class="p-4">
      <div class="mb-4">
        <div
          class="flex items-center gap-3 p-4 bg-white rounded-lg border mb-6"
        >
          {#if tempstate?.report?.topic}
            <BookOpen size={24} />
            <span class="text-xl font-medium"
              >{tempstate?.report?.topic?.title || "Report on topic"}</span
            >
          {:else}
            <CircleHelp size={24} />
            {#if tempstate?.report?.question?.questionText}
              {@html tempstate?.report?.question?.questionText}
            {:else}
              <span class="text-xl font-medium">Report on question</span>
            {/if}
          {/if}
        </div>
        <label for="feedback" class="block text-lg font-medium mb-2"
          >Please describe the problem you encountered:</label
        >
        <div class="grid w-full gap-1.5">
          <Textarea
            id="feedback"
            bind:value={issue}
            rows={6}
            placeholder="Describe the issue in detail..."
          />
        </div>
      </div>

      <div class="flex justify-end">
        <Button
          size="lg"
          class="text-lg font-bold"
          onclick={handleSend}
          disabled={loading}
        >
          {#if loading}
            <span class="mr-2 inline-block">
              <Loading class="animate-spin h-4 w-4" />
            </span>
            Submitting...
          {:else}
            Submit
          {/if}
        </Button>
      </div>
    </div>
  </div>
</div>
````

## File: src/routes/SearchCourse.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Search, Plus, ArrowLeft } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";

  let searchQuery = $state("");

  let courses = $state([
    {
      id: 1,
      name: "Introduction to Computer Science",
      emoji: "💻",
      selected: false,
    },
    {
      id: 2,
      name: "Advanced Mathematics",
      emoji: "🔢",
      selected: false,
    },
    {
      id: 3,
      name: "Physics 101",
      emoji: "⚛️",
      selected: false,
    },
    {
      id: 4,
      name: "Biology Fundamentals",
      emoji: "🧬",
      selected: false,
    },
    {
      id: 5,
      name: "History of Art",
      emoji: "🎨",
      selected: false,
    },
  ]);

  let filteredCourses = $derived(
    courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );
</script>

<div class="p-8 bg-blue-50 min-h-screen">
  <div class="max-w-3xl mx-auto">
    <div class="mb-2">
      <Button
        onclick={() => window.history.back()}
        class="flex items-center gap-2 font-bold"
      >
        <ArrowLeft />
        Back
      </Button>
    </div>

    <div class="relative mb-6">
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={20}
      />
      <Input
        type="text"
        placeholder="Search courses..."
        class="pl-10 py-6 text-lg"
        bind:value={searchQuery}
      />
    </div>

    <div class="space-y-4">
      {#each filteredCourses as course}
        <Card
          class={`border-0 cursor-pointer transition-all ${course.selected ? "bg-blue-100" : ""}`}
          onclick={() => (course.selected = !course.selected)}
        >
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 hover:underline">
                <span class="text-2xl mr-2">{course.emoji}</span>
                <span>{course.name}</span>
              </span>
              <Button variant="outline" size="sm">
                Add <Plus size={16} class="ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      {/each}

      {#if filteredCourses.length === 0}
        <div class="text-center py-8 text-gray-600">
          <p>No courses found matching "{searchQuery}"</p>
        </div>
      {/if}
    </div>
  </div>
</div>
````

## File: src/routes/SelectCourses.svelte
````
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, Loader2 } from "lucide-svelte";
  import { tempstate, save, permstate } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExam, getExitQuestions } from "$lib/api";

  let isLoading = $state(true);
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);
  let courses = $state<{ id: string; name: string; selected: boolean }[]>([]);

  let firstSelectedCourseRef = $state<HTMLElement | null>(null);
  let firstSelectedCourseFound = $state(false);

  let isContinueDisabled = $derived(
    !courses?.some((course) => course.selected) || isSubmitting,
  );

  // Scroll to the first selected course when it's available
  $effect(() => {
    if (firstSelectedCourseRef) {
      firstSelectedCourseRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  onMount(async () => {
    try {
      courses = permstate?.exitExams?.find(
        (e) => e?.examId == tempstate?.quiz?.examId,
      )?.courses;

      if (courses && courses?.length > 0) {
        isLoading = false;
        return;
      }
      const { data } = await getExitExam(tempstate?.quiz?.examId);

      courses = data.courses?.map((course) => ({
        id: course.courseId,
        name: course.courseTitle,
        selected: tempstate?.quiz?.courses?.includes(course.id),
      }));
      isLoading = false;
      permstate.exitExams = [data, ...(permstate.exitExams || [])];
      save(permstate);
    } catch (err) {
      console.error("Error loading courses:", err);
      error = "Failed to load courses. Please try again.";
      isLoading = false;
    }
  });

  function setFirstSelectedCourseRef(node: HTMLElement, isSelected: boolean) {
    if (isSelected && !firstSelectedCourseFound) {
      firstSelectedCourseRef = node;
      firstSelectedCourseFound = true;
    }
    return {};
  }

  async function handleContinue() {
    try {
      isSubmitting = true;
      const selectedCourses = courses
        .filter((course) => course.selected)
        .map((course) => course.id);
      const { data } = await getExitQuestions();
      tempstate.quiz.courses = selectedCourses;
      tempstate.quiz.questions = data;
      push("/quiz/0");
    } catch (err) {
      console.error("Error during continue:", err);
      error = "Failed to proceed. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="p-8 bg-blue-50 min-h-screen flex flex-col">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-semibold">Select Courses</h1>
    <Button
      onclick={handleContinue}
      disabled={isContinueDisabled}
      size="lg"
      class="text-lg font-bold"
    >
      {#if isSubmitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Loading
      {:else}
        Next <ArrowRight />
      {/if}
    </Button>
  </div>

  {#if isLoading}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      {#each Array.from({ length: 9 }, (_, i) => i) as i (i)}
        <div class="rounded-lg bg-white p-4">
          <div class="flex items-center gap-3">
            <Skeleton class="h-5 w-5 rounded" />
            <Skeleton class="h-7 w-48" />
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="flex-grow flex items-center justify-center">
      <p class="text-xl text-red-500">{error}</p>
    </div>
  {:else}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      {#each courses as course (course)}
        <div
          class="rounded-lg bg-white p-4 transition-all cursor-pointer hover:bg-gray-50"
          class:bg-blue-100={course.selected}
          use:setFirstSelectedCourseRef={course.selected}
        >
          <label class="flex items-center gap-3 text-xl font-medium w-full">
            <Checkbox
              checked={course.selected}
              onCheckedChange={() => {
                course.selected = !course.selected;
                console.log(
                  `Course selected: ${course.name} - ${course.selected}`,
                );
              }}
            />
            <span>{course.name}</span>
          </label>
        </div>
      {/each}
    </div>
  {/if}
</div>
````

## File: src/routes/SelectTopics.svelte
````
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, ChevronDown } from "lucide-svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import { getCourse } from "$lib/api";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let chapters = $state<
    {
      title: string;
      expanded: boolean;
      selectAll: boolean;
      topics: { name: string; selected: boolean; filename: string }[];
    }[]
  >([]);

  let firstSelectedTopicRef = $state<HTMLElement | null>(null);
  let firstSelectedTopicFound = $state(false);
  $effect(() => {
    if (firstSelectedTopicRef) {
      console.log("Scrolling to first selected topic");
      firstSelectedTopicRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  onMount(async () => {
    console.log("SelectTopics onMount called");
    try {
      let course = [
        ...(permstate.allCourses || []),
        ...(permstate.myCourses || []),
      ].find(({ courseId }) => courseId === tempstate.quiz.courseId);
      let courseOutline = course?.outline;
      if (!courseOutline) {
        const { data } = await getCourse(tempstate.quiz.courseId);
        courseOutline = data.outline;
        permstate.allCourses = permstate.allCourses || [];
        permstate.allCourses.push(data);
        save(permstate);
      }
      const previouslySelectedTopics = tempstate.quiz.topics || [];
      chapters = courseOutline.map((section) => {
        const topics = section.topics
          ? section.topics.map((topic) => ({
              name: topic.title,
              filename: topic.filename,
              selected: previouslySelectedTopics.includes(topic.filename),
            }))
          : [];

        // Check if all topics in this chapter are selected
        const allTopicsSelected =
          topics.length > 0 && topics.every((topic) => topic.selected);

        return {
          title: section.title,
          expanded: topics.some((topic) => topic.selected), // Auto-expand chapters with selected topics
          selectAll: allTopicsSelected,
          topics,
        };
      });

      console.log("Transformed course outline into chapters:", chapters);
      isLoading = false;
    } catch (err) {
      console.error("Error loading topics:", err);
      error = "Failed to load topics. Please try again.";
      isLoading = false;
    }
  });

  function toggleChapter(index: number) {
    console.log(`toggleChapter called for index: ${index}`);
    console.log(`Current expanded state: ${chapters[index].expanded}`);
    chapters[index].expanded = !chapters[index].expanded;
    console.log(`New expanded state: ${chapters[index].expanded}`);
  }

  function toggleSelectAll(chapterIndex: number) {
    console.log(`toggleSelectAll called for chapterIndex: ${chapterIndex}`);
    console.log(`Current selectAll state: ${chapters[chapterIndex].selectAll}`);
    chapters[chapterIndex].selectAll = !chapters[chapterIndex].selectAll;
    console.log(`New selectAll state: ${chapters[chapterIndex].selectAll}`);

    chapters = chapters.map((chapter, idx) => {
      if (idx === chapterIndex) {
        console.log(
          `Updating all topics in chapter ${idx} to selected: ${chapter.selectAll}`,
        );
        return {
          ...chapter,
          topics: chapter.topics.map((topic) => ({
            ...topic,
            selected: chapter.selectAll,
          })),
        };
      }
      return chapter;
    });
    console.log("Updated chapters after toggleSelectAll:", chapters);
  }

  function updateSelectAll(chapterIndex: number) {
    console.log(`updateSelectAll called for chapterIndex: ${chapterIndex}`);
    const chapter = chapters[chapterIndex];
    const allSelected = chapter.topics.every((topic) => topic.selected);
    console.log(
      `All topics selected in chapter ${chapterIndex}? ${allSelected}`,
    );
    chapter.selectAll = allSelected;
    console.log(`Updated selectAll state: ${chapter.selectAll}`);
  }

  function setFirstSelectedTopicRef(node: HTMLElement, isSelected: boolean) {
    if (isSelected && !firstSelectedTopicFound) {
      firstSelectedTopicRef = node;
      firstSelectedTopicFound = true;
    }
    return {};
  }

  let isContinueDisabled = $derived(
    !chapters.some((chapter) => chapter.topics.some((topic) => topic.selected)),
  );

  function handleContinue() {
    const selectedTopics = chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.selected)
        .map((topic) => topic.filename),
    );
    tempstate.selectedTopics = selectedTopics;
    push("/quest-type");
  }
</script>

<div class="p-8 bg-blue-50 min-h-screen flex flex-col">
  <div class="flex justify-between items-center mb-2">
    <h1 class="text-3xl font-semibold">Select Topics</h1>
    <Button
      onclick={handleContinue}
      disabled={isContinueDisabled}
      size="lg"
      class="text-lg font-bold"
    >
      Next <ArrowRight />
    </Button>
  </div>

  {#if isLoading}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      <!-- Skeleton loading states for chapters -->
      {#each Array(5) as _, i}
        <div class="rounded-lg bg-white">
          <div class="w-full p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <Skeleton class="h-5 w-5 rounded" />
              <Skeleton class="h-7 w-48" />
            </div>
            <Skeleton class="h-6 w-6 rounded-full" />
          </div>
          {#if i % 2 === 0}
            <div class="p-4 border-t-2">
              <div class="space-y-3">
                {#each Array(4) as _, j}
                  <div class="flex items-center gap-3 p-2">
                    <Skeleton class="h-5 w-5 rounded" />
                    <Skeleton class="h-6 w-40" />
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="flex-grow flex items-center justify-center">
      <p class="text-xl text-red-500">{error}</p>
    </div>
  {:else}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      {#each chapters as chapter, chapterIndex}
        <div class="rounded-lg bg-white">
          <div class="w-full p-4 flex justify-between items-center">
            <label class="flex items-center gap-3 text-xl font-medium">
              <Checkbox
                checked={chapter.selectAll}
                onCheckedChange={() => toggleSelectAll(chapterIndex)}
              />
              <span>{chapter.title}</span>
            </label>
            <button onclick={() => toggleChapter(chapterIndex)}>
              <ChevronDown
                class={"transform transition-transform " +
                  (chapter.expanded ? "rotate-180" : "")}
              />
            </button>
          </div>

          {#if chapter.expanded}
            <div class="p-4 border-t-2">
              <div class="space-y-2">
                {#each chapter.topics as topic, topicIndex}
                  <label
                    class="flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-gray-50"
                    class:bg-blue-100={topic.selected}
                    use:setFirstSelectedTopicRef={topic.selected}
                  >
                    <Checkbox
                      checked={topic.selected}
                      onCheckedChange={() => {
                        topic.selected = !topic.selected;
                        console.log(
                          `Topic checkbox changed: ${chapter.title} - ${topic.name} - new state: ${topic.selected}`,
                        );
                        updateSelectAll(chapterIndex);
                      }}
                    />
                    <span class="text-lg">{topic.name}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
````

## File: src/routes/Settings.svelte
````
<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import Combobox from "$lib/mycomps/Combobox.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    Star,
    BookOpenText,
    Calendar,
    MessageCircle,
    ArrowLeft,
    User,
    FileCheck,
  } from "lucide-svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { fields, years, grades } from "../config";

  import { onMount } from "svelte";
  onMount(() => {
    permstate.userInfo.eduFocus = "highschool";
    save(permstate);
  });

  let dept = $state(permstate.userInfo.dept || fields[0].value);
  let yearOfStudy = $state(permstate.userInfo.yearOfStudy || years[0].value);
  let gender = $state(permstate.userInfo.gender || "male");
  let examFocus = $state(permstate.userInfo.examFocus || "matric");
  let grade = $state(permstate.userInfo.grade || grades[0].value);

  const triggerContent = $derived(
    permstate.userInfo.eduFocus == "highschool"
      ? "Select your grade"
      : (years.find((year) => year.value === yearOfStudy)?.label ??
          "Select your year"),
  );

  $effect(() => {
    permstate.userInfo.dept = dept;
    permstate.userInfo.yearOfStudy = yearOfStudy;
    permstate.userInfo.gender = gender;
    permstate.userInfo.examFocus = examFocus;
    permstate.userInfo.grade = grade;

    save(permstate);
  });
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white text-right">Settings</h1>
    </div>
    <div class="flex gap-2 justify-end">
      <span
        class="flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 w-fit"
      >
        <Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span class="text-md font-bold opacity-80">{permstate.stars} Stars</span
        >
      </span>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    {#if permstate.userInfo.eduFocus == "highschool"}
      <div class="w-full max-w-md mx-auto mb-4">
        <div class="flex items-center gap-2 mb-4 text-gray-800 text-left">
          <Calendar class="w-5 h-5" />
          <span>Select your grade level:</span>
        </div>
        <Select.Root type="single" name="grade" bind:value={grade}>
          <Select.Trigger
            class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
          >
            Grade {grade}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each grades as grade (grade)}
                <Select.Item value={grade.value} label={grade.label}>
                  {grade.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {:else}
      <div class="w-full flex flex-col justify-center mt-4 mb-4">
        <div class="flex items-center gap-2 text-gray-800 text-left">
          <BookOpenText class="w-5 h-5" />
          <span>Department/Field</span>
        </div>
        <Combobox
          items={fields}
          bind:value={dept}
          placeholder="Select your field of study"
          buttonClass="text-gray-800 font-bold py-6 w-full md:w-[280px] justify-between bg-white border border-gray-300"
          contentClass="w-full md:w-[280px] p-0"
          searchPlaceholder="Search fields..."
          emptyMessage="No field found"
        />
      </div>
      <div class="w-full md:w-[280px] mb-4">
        <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
          <Calendar class="w-5 h-5" />
          <span>Year of Study</span>
        </div>
        <Select.Root type="single" name="yearOfStudy" bind:value={yearOfStudy}>
          <Select.Trigger
            class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
          >
            {triggerContent}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each years as year (year)}
                <Select.Item value={year.value} label={year.label}>
                  {year.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {/if}

    <!-- Gender Radio -->
    <div class="w-full md:w-[280px] mb-4">
      <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
        <User class="w-5 h-5" />
        <span>Gender</span>
      </div>
      <Select.Root type="single" name="gender" bind:value={gender}>
        <Select.Trigger
          class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
        >
          {gender === "male" ? "Male" : "Female"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="male" label="Male">Male</Select.Item>
            <Select.Item value="female" label="Female">Female</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Past Exams -->
    <div class="w-full md:w-[280px] mb-6">
      <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
        <FileCheck class="w-5 h-5" />
        <span>Past Exams</span>
      </div>

      <Select.Root type="single" name="gender" bind:value={examFocus}>
        <Select.Trigger
          class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
        >
          {examFocus === "exitexam" ? "Exit Exam" : "Matric Exam"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="exitexam" label="Exit Exam"
              >Exit Exam</Select.Item
            >
            <Select.Item value="matric" label="Matric Exam"
              >Matric Exam</Select.Item
            >
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <Card
      class="bg-blue-100 transition-colors duration-200 cursor-pointer border border-blue-100"
      style="margin-bottom: 80px"
    >
      <a href="mailto:dev@example.com" class="block p-4 no-underline">
        <div class="flex items-center gap-3">
          <span class="flex-grow text-gray-900 font-bold">Contact Us</span>
          <MessageCircle size="20" />
        </div>
      </a>
    </Card>
  </div>
</div>
````

## File: src/routes/StudyPlan.svelte
````
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import {
    ArrowLeft,
    BookOpen,
    Play,
    CircleAlert,
    ChevronDown,
    CheckCircle,
  } from "lucide-svelte";
  import { tempstate, permstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { slide, fade, fly } from "svelte/transition";
  import { Skeleton } from "$lib/components/ui/skeleton";

  let activeTab = $state("weak"); // 'weak' or 'strong'
  let studyPlanData = $state({
    chapters: [],
  });
  let isLoading = $state(true);
  let displayPlan = $derived({
    chapters: studyPlanData.chapters
      .map((chapter) => ({
        ...chapter,
        topics: chapter.topics.filter((topic) => topic.status === activeTab),
      }))
      .filter((chapter) => chapter.topics.length > 0),
  });
  async function createMatricOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by chapter
    const chapterMap = new Map();

    // Track the order of chapters as they first appear in topics
    const chapterOrder = [];

    // Combine weak and strong topics to process them in the original order
    const allTopics = [...weakTopics, ...strongTopics];

    // Process all topics in order
    allTopics.forEach((topic) => {
      const chapterKey = topic.chapterFilename || topic.chapterTitle;

      // If this is the first time we see this chapter, add it to our order array
      if (!chapterMap.has(chapterKey)) {
        chapterMap.set(chapterKey, {
          title: topic.chapterTitle,
          topics: [],
          isExpanded: true,
          grade: topic.grade || "",
        });
        chapterOrder.push(chapterKey);
      }

      // Determine if this is a weak or strong topic
      const status = weakTopics.includes(topic) ? "weak" : "strong";

      chapterMap.get(chapterKey).topics.push({
        title: topic.title,
        status: status,
        filename: topic.filename,
      });
    });

    // Convert map to array using the order we tracked
    result.chapters = chapterOrder.map((key) => chapterMap.get(key));

    return result;
  }
  async function createExitOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by course
    const courseMap = new Map();

    // Process weak topics
    weakTopics.forEach((topic) => {
      const courseId = topic.courseId;
      const courseTitle = topic.courseTitle;

      if (!courseId || !courseTitle) {
        console.warn("Topic missing courseId or courseTitle", topic);
        return;
      }

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          title: courseTitle,
          topics: [],
          isExpanded: true,
        });
      }

      courseMap.get(courseId).topics.push({
        title: topic.title,
        status: "weak",
        filename: topic.filename,
        courseId: courseId,
      });
    });

    // Process strong topics
    strongTopics.forEach((topic) => {
      const courseId = topic.courseId;
      const courseTitle = topic.courseTitle;

      if (!courseId || !courseTitle) {
        console.warn("Topic missing courseId or courseTitle", topic);
        return;
      }

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          title: courseTitle,
          topics: [],
          isExpanded: true,
        });
      }

      courseMap.get(courseId).topics.push({
        title: topic.title,
        status: "strong",
        filename: topic.filename,
        courseId: courseId,
      });
    });

    // Convert map to array and add to result
    for (const chapter of courseMap.values()) {
      if (chapter.topics.length > 0) {
        result.chapters.push(chapter);
      }
    }

    return result;
  }

  async function createQuizOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by chapter
    const chapterMap = new Map();

    // Track the order of chapters as they first appear in topics
    const chapterOrder = [];

    // Combine weak and strong topics to process them in the original order
    const allTopics = [...weakTopics, ...strongTopics];

    // Process all topics in order
    allTopics.forEach((topic) => {
      const chapterKey = topic.chapterFilename || topic.chapterTitle;

      // If this is the first time we see this chapter, add it to our order array
      if (!chapterMap.has(chapterKey)) {
        chapterMap.set(chapterKey, {
          title: topic.chapterTitle,
          topics: [],
          isExpanded: true,
        });
        chapterOrder.push(chapterKey);
      }

      // Determine if this is a weak or strong topic
      const status = weakTopics.includes(topic) ? "weak" : "strong";

      chapterMap.get(chapterKey).topics.push({
        title: topic.title,
        status: status,
        filename: topic.filename,
      });
    });

    // Convert map to array using the order we tracked
    result.chapters = chapterOrder.map((key) => chapterMap.get(key));

    return result;
  }
  onMount(async () => {
    isLoading = true;

    if (tempstate.quiz.focus == "normal") studyPlanData = createQuizOutline();
    if (tempstate.quiz.focus == "exitexam") studyPlanData = createExitOutline();
    if (tempstate.quiz.focus == "matric") studyPlanData = createMatricOutline();
    isLoading = false;
  });

  // $inspect("how study plan changes", studyPlanData);

  const getStatusColor = (status: string) =>
    status === "strong"
      ? "text-green-500 bg-green-50"
      : status === "weak"
        ? "text-red-500 bg-red-50"
        : "";
  const getStatusText = (status: string) =>
    status === "strong"
      ? "Strong Topic"
      : status === "weak"
        ? "Weak Topic"
        : "";

  const readTopic = (topic: { filename: string; courseId: string }) => {
    if (tempstate.quiz.focus == "normal") {
      push(`/topic/${tempstate.quiz?.courseId || "default"}/${topic.filename}`);
    }
    if (
      tempstate.quiz.focus == "exitexam" ||
      tempstate.quiz.focus == "matric"
    ) {
      push(`/topic/${topic.courseId}/${topic.filename}`);
    }
  };

  const practice = (topic: { filename: string; courseId: string }) => {
    if (tempstate.quiz.focus == "normal") {
      tempstate.quiz.topics = [topic.filename];
      push("/select-topics");
    }
    if (tempstate.quiz.focus == "exitexam") {
      tempstate.quiz.courses = [topic.courseId];
      push("/select-courses");
    }
  };

  const toggleChapter = (chapter: { isExpanded: boolean }) => {
    chapter.isExpanded = !chapter.isExpanded;
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white">Study Plan</h1>
    </div>
    <div class="flex gap-1 justify-end">
      <button
        class="px-6 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'weak'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "weak")}
      >
        Weak Topics
      </button>
      <button
        class="px-6 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'strong'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "strong")}
      >
        Strong Topics
      </button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="flex items-center justify-between py-2">
      <div
        class={`flex items-center gap-2 px-3 py-1.5 rounded-full ${activeTab === "weak" ? "text-yellow-500 bg-yellow-50" : "text-green-500 bg-green-50"}`}
      >
        <div class="flex items-center gap-2">
          {#if activeTab === "weak"}
            <CircleAlert class="w-6 h-6" />
            <span class="text-xl font-semibold">Topics to Focus On</span>
          {:else}
            <CheckCircle class="w-6 h-6" />
            <span class="text-xl font-semibold">Mastered Topics</span>
          {/if}
        </div>
      </div>
    </div>

    <div>
      {#if isLoading}
        <!-- Skeleton loader while loading -->
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <div class="mb-4">
            <Skeleton class="w-full h-14 mb-2 rounded-xl" />
            <div class="space-y-4 pl-2">
              {#each Array.from({ length: 3 }, (_, j) => j) as j (j)}
                <div class="p-3 space-y-3">
                  <div class="flex items-center gap-3">
                    <Skeleton class="h-6 w-3/4" />
                    <Skeleton class="h-5 w-20 rounded-full" />
                  </div>
                  <div class="flex gap-2">
                    <Skeleton class="h-9 w-24" />
                    <Skeleton class="h-9 w-24" />
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {:else if displayPlan.chapters.length === 0}
        <!-- Empty state messages -->
        <div class="text-center py-10 px-4" in:fade={{ duration: 300 }}>
          {#if activeTab === "weak"}
            <div class="flex flex-col items-center gap-4">
              <CircleAlert class="w-16 h-16 text-yellow-400" />
              <h3 class="text-xl font-semibold text-gray-800">
                No Weak Topics Found
              </h3>
              <p class="text-gray-600 max-w-md">
                Great job! You don't have any topics that need improvement. Keep
                up the good work or check your strong topics.
              </p>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-4">
              <CheckCircle class="w-16 h-16 text-green-400" />
              <h3 class="text-xl font-semibold text-gray-800">
                No Mastered Topics Yet
              </h3>
              <p class="text-gray-600 max-w-md">
                You haven't mastered any topics yet. Keep practicing and take
                more quizzes to identify your strengths.
              </p>
            </div>
          {/if}
        </div>
      {:else}
        {#each displayPlan.chapters as chapter (chapter)}
          <button
            in:slide={{ duration: 300 }}
            class="w-full bg-blue-50 mb-2 rounded-xl px-4 py-4 flex justify-between items-center"
            onclick={() => toggleChapter(chapter)}
          >
            <h2 class="text-xl text-left">
              {chapter.title}{!chapter.grade ? "" : ` (${chapter.grade})`}
            </h2>
            <ChevronDown
              class={"transform transition-transform " +
                (chapter.isExpanded ? "rotate-180" : "")}
            />
          </button>
          {#if chapter.isExpanded}
            <div class="space-y-4 mb-8">
              <div class="space-y-4">
                {#each chapter.topics.filter( (topic) => (activeTab === "weak" ? topic.status === "weak" : topic.status === "strong"), ) as topic, i (topic)}
                  <div
                    class="p-3 rounded-lg border space-y-3 mb-4"
                    in:fly={{ y: -50, duration: 300, delay: i * 50 }}
                    out:fade={{ duration: 0 }}
                  >
                    <div class="flex items-center gap-3 flex-wrap">
                      <div class="font-bold text-lg text-gray-900">
                        {topic.title}
                      </div>
                      <div
                        class={`flex items-center gap-2 px-3 py-0 rounded-full w-fit ${getStatusColor(topic.status)}`}
                      >
                        <span class="text-xs font-bold"
                          >{getStatusText(topic.status)}</span
                        >
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => readTopic(topic)}
                      >
                        <BookOpen class="w-4 h-4 mr-1" />
                        <span>Read</span>
                      </Button>
                      {#if tempstate.quiz.focus != "matric"}
                        <Button
                          size="sm"
                          variant="secondary"
                          class="flex items-center justify-center"
                          onclick={() => practice(topic)}
                        >
                          <Play class="w-4 h-4 mr-1" />
                          <span>Practice Topic</span>
                        </Button>
                      {/if}
                      <span class="flex-grow"></span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>
````

## File: src/routes/Topic.old.svelte
````
<script lang="ts">
  import { getTopicData } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    ArrowLeft,
    BookOpen,
    Play,
    Flag,
    Video,
    Book,
    Info,
  } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const styles = `<style> /* Heading Structure */ h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; color: #1e3a8a; } h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: #1e40af; } h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e3a8a; } /* Content Containers */ p { margin-bottom: 1rem; line-height: 1.6; } .definition { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } .example { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } .note { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } /* Mathematical Content */ .math-inline { font-style: italic; font-family: "Georgia", serif; } .math-display { margin: 1rem 0; padding: 1rem; background-color: #f8fafc; border-radius: 0.25rem; overflow-x: auto; } /* Code Sections */ pre { background-color: #1e293b; border-radius: 0.25rem; padding: 1rem; margin-bottom: 1rem; overflow-x: auto; } code { font-family: "Consolas", "Monaco", monospace; color: #f8fafc; } /* List Structures */ ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; } ul { list-style-type: disc; } ol { list-style-type: decimal; } li { margin-bottom: 0.5rem; } /* Text Emphasis */ strong { font-weight: 700; color: #0f172a; } em { font-style: italic; } u { text-decoration: underline; } /* Special Elements */ blockquote { font-style: italic; border-left: 4px solid #cbd5e1; padding-left: 1rem; margin: 1rem 0; color: #475569; } table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; } th, td { border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; } th { background-color: #f1f5f9; font-weight: 600; } tr:nth-child(even) { background-color: #f8fafc; } hr { border: 0; height: 1px; background-color: #cbd5e1; margin: 2rem 0; }</style>`;

  let { params } = $props();
  let topicData: TopicData | null = $state(null);

  console.log("the html is", topicData?.content);

  onMount(async () => {
    const { data } = await getTopicData(params.courseId, params.filename);
    topicData = data;
  });

  let activeTab = $state("main"); // 'main' or 'videos'
  const openTextbook = () => {
    console.log("yes my g open the fucking text book");
  };

  // Sample video data (replace with actual data source)
  let videos = [
    {
      videoId: "abc123",
      videoTitle: "Introduction to Matrices and Vectors",
      channelTitle: "Math Explained",
      thumbnails: ["https://i.ytimg.com/vi/abc123/hqdefault.jpg"],
      duration: "12:34",
    },
    {
      videoId: "def456",
      videoTitle: "Linear Transformations Explained",
      channelTitle: "Professor Linear",
      thumbnails: ["https://i.ytimg.com/vi/def456/hqdefault.jpg"],
      duration: "8:45",
    },
    {
      videoId: "ghi789",
      videoTitle: "Eigenvalues and Eigenvectors - Visual Guide",
      channelTitle: "Math with Visual Proofs",
      thumbnails: ["https://i.ytimg.com/vi/ghi789/hqdefault.jpg"],
      duration: "15:20",
    },
  ];

  const openVideo = (videoId) => {
    // Implement video opening functionality
    console.log(`Opening video: ${videoId}`);
    // Could navigate to a video player component or open YouTube
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 pt-6 pb-2 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white">Linear Algebra II</h1>
    </div>
    <div class="flex gap-2 justify-end">
      <!-- <Button variant="default">
        <BookOpen class="w-4 h-4 mr-2" />
        Open Textbook
      </Button> -->
      <Button variant="ghost" class="bg-blue-100 font-bold">
        <Play class="w-5 h-5 mr-2" />
        Start Quiz
      </Button>
    </div>
    <div class="flex gap-2 mt-4">
      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'main'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "main")}
      >
        Home
      </button>
      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'videos'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "videos")}
      >
        Videos
      </button>

      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all bg-blue-400 text-white"
        onclick={openTextbook}
      >
        Textbook
      </button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl pt-4 pb-8 px-4">
    {#if activeTab === "main"}
      <div in:fade={{ duration: 300 }}>
        {#if topicData === null}
          <div class="flex gap-2 items-center bg-gray-100 px-4 py-3 rounded-lg">
            <Skeleton class="h-20 w-full" />
          </div>
          <div class="mt-8"></div>
          <div class="mt-8">
            <Card class="pb-4">
              <CardHeader>
                <CardTitle>
                  <Skeleton class="h-5 w-40 mb-2" />
                  <Skeleton class="h-6 w-3/4 mb-4" />
                  <Skeleton class="h-10 w-36" />
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div class="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton class="h-5 w-24 mb-2" />
                  <Skeleton class="h-6 w-4/5 mb-4" />
                  <Skeleton class="h-10 w-36" />
                </CardTitle>
              </CardHeader>
              <CardContent class="m-0 p-2"></CardContent>
            </Card>
          </div>
        {:else}
          <!-- <div
            class="flex gap-2 items-center bg-pink-50 px-4
            py-3 rounded-lg"
          >
            <div class="text-gray-600">
              <strong>Fun Fact:</strong> Linear algebra is used in Google's
              PageRank algorithm to determine the importance of web pages.
              <button
                class="font-bold text-gray-900 underline text-right ml-auto"
                >More</button
              >
            </div>
          </div> -->

          <div class="mt-8">
            {@html `${styles}${topicData?.content}`}
          </div>
          <div class="mt-8">
            <Card class="pb-4">
              <CardHeader>
                <CardTitle>
                  <div
                    class="bg-blue-100 text-blue-500 rounded-full
                    px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Next Topic
                  </div>
                  Matrices and Vectors

                  <Button class="bg-blue-500 text-white font-bold mt-4">
                    Open
                    <ArrowRight class="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div class="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div
                    class="bg-green-100 text-green-500 rounded-full
                                    px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Textbook
                  </div>
                  <p>Linear Algebra: A Modern Introduction</p>
                  <Button variant="outline" class="mt-4">
                    <BookOpen class="w-4 h-4 mr-2" />
                    Open Textbook
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent class="m-0 p-2"></CardContent>
            </Card>
          </div>
        {/if}
      </div>
    {:else if activeTab === "videos"}
      <div in:fade={{ duration: 300 }}>
        <div class="mt-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Recommended Videos
          </h2>
          <div class="grid gap-4">
            {#if topicData === null}
              {#each Array(3) as _, i}
                <div
                  class="bg-white rounded-xl text-left overflow-hidden shadow border border-gray-100"
                >
                  <div class="relative">
                    <Skeleton class="w-full h-40" />
                  </div>
                  <div class="p-4">
                    <Skeleton class="h-6 w-3/4 mb-1" />
                    <Skeleton class="h-4 w-1/3" />
                  </div>
                </div>
              {/each}
            {:else}
              {#each videos as video}
                <button
                  class="bg-white rounded-xl text-left overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onclick={() => openVideo(video.videoId)}
                >
                  <div class="relative">
                    <img
                      src={video.thumbnails[0]}
                      alt={video.videoTitle}
                      class="w-full h-40 object-cover"
                    />
                    <div
                      class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md font-medium"
                    >
                      {video.duration}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">
                      {video.videoTitle}
                    </h3>
                    <p class="text-sm text-gray-600 flex items-center">
                      <Video class="w-3 h-3 mr-1" />
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="mt-8 flex">
      <Button
        variant="outline"
        class="text-red-500"
        onclick={() => push("/report")}
      >
        <Flag class="h-4 w-4 mr-2" />
        Report
      </Button>

      <span class="flex-grow"></span>
      <Button class="font-bold ">
        <Play strokeWidth="4" />
        Start Quiz
      </Button>
    </div>
  </div>
</div>
````

## File: src/routes/Topic.svelte
````
<script lang="ts">
  import { getTopicData } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import { navigateToLink } from "$lib/myutils";
  import type { TopicData } from "../types.d.ts";
  import { fade } from "svelte/transition";
  import { tempstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { Card, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { ArrowLeft, Clock, ArrowRight, Flag, Video } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const styles = `<style>
    .course h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course p {
          margin-bottom: 1rem;
          line-height: 1.5; /* A bit more readable line height */
          color: #121212; /* Regular readable paragraph color */
          font-size: 1.125rem;
        }

    .course ul,
    .course ol {
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }

    .course li {
          margin-bottom: 0.5rem;
          margin-left: 16px;
          color: #161616;
          list-style-type: disc !important;
          font-size: 1.125rem;
        }

    .course .definition {
          border-left: 4px solid rgb(96 165 250); /* Tailwind's 'blue-400' */
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: rgb(232 240 254); /*Light blue*/
          font-size: 1.125rem;
        }

    .course .definition strong {
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course .note {
    font-size: 1.125rem;
          background-color: rgb(239 246 255); /* Tailwind's 'blue-50' */
          border-left: 6px solid rgb(37 99 235); /* Tailwind's 'blue-700' */
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 0.25rem;
        }

    .course .example {
    font-size: 1.125rem;
    border: 1px solid rgb(219 234 254); /* Tailwind's 'blue-100' */
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 0.25rem;
          color: #121212;
        }

    .course .math-inline {
          font-style: italic;
        }

    .course .math-display {
          display: block;
          margin: 1rem 0;
          padding: 0.5rem;
          background-color: rgb(232 240 254);
          border: 1px solid rgb(147 197 253);
          border-radius: 0.25rem;
          color: rgb(37 99 235); /* Tailwind 'blue-600'*/
        }

    .course pre {
          padding: 1rem;
          overflow-x: auto;
          border-radius: 0.25rem;
        }

    .course code {
          font-family: monospace;
        }

    .course strong {
          font-weight: bold;
        }

    .course em {
            font-style: italic;
        }

    .course u {
          text-decoration: underline;
        }

    .course table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }

    .course th,
    .course td {
          border: 1px solid rgb(156 163 175); /* Tailwind's 'gray-400' */
          padding: 0.5rem;
          text-align: left;
        }

    .course th {
          background-color: rgb(232 240 254); /* Tailwind's 'blue-100' */
          font-weight: bold;
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course hr {
          border: 0;
          height: 1px;
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(96, 165, 250, 0.75),
            rgba(0, 0, 0, 0)
          );
          margin: 1.5rem 0; /* Larger margin for emphasis */
        }
  </style>`;

  let { params } = $props();
  let topicData: TopicData | null = $state(null);
  let funfactIndex = $state(0);
  let slideIndex = $state(7);
  let difficultyLabel = $derived(
    topicData?.difficulty <= 5
      ? "Easy"
      : topicData?.difficulty <= 8
        ? "Medium"
        : "Challenging",
  );

  const nextFunfact = () => {
    funfactIndex = (funfactIndex + 1) % topicData?.funfacts.length;
  };
  const prevTopic = () => {
    push(`/topic/${params.courseId}/${topicData?.prevTopic?.filename}`);
  };
  const nextTopic = () => {
    push(`/topic/${params.courseId}/${topicData?.nextTopic?.filename}`);
  };
  const startQuiz = () => {
    tempstate.quiz.courseId = params.courseId;
    tempstate.quiz.topics = [topicData?.filename];
    tempstate.quiz.focus = "normal";
    push("/select-topics");
  };

  onMount(async () => {
    const { data } = await getTopicData(params.courseId, params.filename);
    topicData = data;
  });

  let activeTab = $state("main"); // 'main' or 'videos'
  const openVideo = (videoId) => {
    navigateToLink(`https://www.youtube.com/watch?v=${videoId}`);
  };
  const report = () => {
    tempstate.report.topic = {
      title: topicData.title,
      courseId: topicData.courseId,
      filename: params.filename,
    };
    push("/report");
  };
</script>

<div class="bg-blue-500 min-h-screen flex flex-col">
  <div class="px-4 pt-6 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <button onclick={() => history.back()}>
        <ArrowLeft color="white" size="28" />
      </button>
      <div class="flex flex-grow gap-2 ml-2 items-center">
        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all {activeTab ===
          'main'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "main")}
        >
          Slides
        </button>
        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all {activeTab ===
          'videos'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "videos")}
        >
          Videos
        </button>

        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all bg-blue-400 text-white"
          onclick={startQuiz}
        >
          Quiz
        </button>
      </div>
    </div>
  </div>

  <div class="bg-white flex flex-col flex-grow rounded-t-3xl pt-4 pb-4 px-4">
    {#if activeTab === "main"}
      <div in:fade={{ duration: 250 }} class="flex-grow flex flex-col">
        {#if topicData === null}
          <Skeleton class="h-12 w-full rounded-md" />
          <div class="mt-4 space-y-4">
            <Skeleton class="h-4 w-3/5 rounded-md" />
            <Skeleton class="h-4 w-4/5 rounded-md" />
            <Skeleton class="h-4 w-2/5 rounded-md" />
          </div>

          <div class="mt-8">
            <Skeleton class="h-4 w-1/2 rounded-md" />
            <div class="mt-4 space-y-2">
              <Skeleton class="h-24 w-full rounded-md" />
              <Skeleton class="h-4 w-full rounded-md" />
              <Skeleton class="h-4 w-5/6 rounded-md" />
            </div>
          </div>

          <div class="mt-8">
            <Skeleton class="h-4 w-1/3 rounded-md" />
            <div class="mt-4 space-y-2">
              <Skeleton class="h-24 w-full rounded-md" />
              <Skeleton class="h-4 w-full rounded-md" />
              <Skeleton class="h-4 w-5/6 rounded-md" />
            </div>
          </div>
        {:else}
          <div class="flex-grow">
            <div class="overflow-y-auto">
              {#if slideIndex == 0}
                <div class="flex gap-2 flex-wrap mb-2">
                  <span
                    class="flex items-center w-fit bg-green-200 rounded-full px-3 py-1 text-sm font-bold text-green-800"
                  >
                    <Clock class="w-4 h-4 mr-2" />
                    {topicData.duration} minutes
                  </span>

                  <span
                    class="flex items-center w-fit bg-orange-100 rounded-full px-3 py-1 text-sm font-bold text-orange-800"
                  >
                    <Flag class="w-4 h-4 mr-2" />
                    {difficultyLabel} Topic
                  </span>
                </div>

                <div class="flex gap-2 flex-wrap mb-3">
                  {#each topicData.bloomsLevels.slice(0, 2) as level (level)}
                    <span
                      class="flex items-center w-fit bg-blue-100 rounded-full px-3 py-1 text-sm font-bold text-blue-900"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  {/each}
                </div>
              {/if}

              {@html `${styles}<div class="course">${topicData?.slides[slideIndex].slideContent}</div>`}
              {#if slideIndex == topicData.slides.length - 1}
                <Button
                  variant="outline"
                  class="text-red-500 ml-auto"
                  onclick={report}
                >
                  <Flag class="h-4 w-4 mr-2" />
                  Report Feedback
                </Button>
              {/if}
            </div>
          </div>

          {#if slideIndex == topicData.slides.length - 1}
            <Card class="pb-2 pt-1 mb-4">
              <CardHeader class="mt-0 pt-2 px-6">
                <CardTitle class="mt-0 flex flex-col items-start">
                  <div
                    class="bg-blue-100 text-blue-500 rounded-full
                                                px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Next Topic
                  </div>
                  {topicData.nextTopic.title}

                  <Button
                    class="bg-blue-500 text-white font-bold mt-4 ml-auto"
                    onclick={nextTopic}
                  >
                    Open
                    <ArrowRight class="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          {/if}

          <div class="flex justify-between items-center">
            {#if slideIndex == 0}
              <Button
                class="bg-blue-500 text-white font-bold"
                onclick={prevTopic}
              >
                <ArrowLeft class="h-4 w-4" />
                Previous Topic
              </Button>
            {:else}
              <Button
                class="bg-blue-500 text-white"
                size="icon"
                onclick={() => {
                  slideIndex = Math.max(0, slideIndex - 1);
                }}
              >
                <ArrowLeft class="h-4 w-4" />
              </Button>
            {/if}

            <strong>
              {slideIndex + 1} / {topicData.slides.length}
            </strong>
            {#if slideIndex != topicData.slides.length - 1}
              <Button
                size="icon"
                class="bg-blue-500 text-white"
                onclick={() => {
                  slideIndex = Math.min(
                    topicData.slides.length - 1,
                    slideIndex + 1,
                  );
                }}
              >
                <ArrowRight class="h-4 w-4" />
              </Button>
            {/if}
          </div>
        {/if}
      </div>
    {:else if activeTab === "videos"}
      <div in:fade={{ duration: 300 }}>
        <div class="mt-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Recommended Videos
          </h2>
          <div
            class="flex gap-2 items-center bg-pink-50 px-4 py-3 rounded-lg mb-4"
          >
            <div class="text-gray-600 flex flex-col">
              <strong>Fun Fact:</strong>
              {topicData?.funfacts[funfactIndex]}
              <button
                class="font-bold text-gray-900 underline ml-auto"
                onclick={() => nextFunfact()}>More</button
              >
            </div>
          </div>

          <div class="grid gap-4">
            {#if topicData === null}
              {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
                <div
                  class="bg-white rounded-xl text-left overflow-hidden shadow border border-gray-100"
                >
                  <div class="relative">
                    <Skeleton class="w-full h-40" />
                  </div>
                  <div class="p-4">
                    <Skeleton class="h-6 w-3/4 mb-1" />
                    <Skeleton class="h-4 w-1/3" />
                  </div>
                </div>
              {/each}
            {:else}
              {#each topicData.videos as video (video)}
                <button
                  class="bg-white rounded-xl text-left overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onclick={() => openVideo(video.videoId)}
                >
                  <div class="relative">
                    <img
                      src={video.thumbnails[0]}
                      alt={video.videoTitle}
                      class="w-full h-40 object-cover"
                    />
                    <div
                      class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded-md font-medium"
                    >
                      {video.duration}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">
                      {video.videoTitle}
                    </h3>
                    <p class="text-sm text-gray-600 flex items-center">
                      <Video class="w-3 h-3 mr-1" />
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
````

## File: src/app.css
````css
:root {
  font-family: "Inter", sans-serif;
}
html {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 72.2% 50.6%;
    --destructive-foreground: 210 40% 98%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
````

## File: src/App.svelte
````
<script>
  import { Toaster } from "svelte-sonner";
  import Router from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import Course from "./routes/Course.svelte";
  import Topic from "./routes/Topic.svelte";
  import QuestType from "./routes/QuestType.svelte";
  import SelectTopics from "./routes/SelectTopics.svelte";
  import Quiz from "./routes/Quiz.svelte";
  import PostQuiz from "./routes/PostQuiz.svelte";
  import StudyPlan from "./routes/StudyPlan.svelte";
  import Module from "./routes/Module.svelte";
  import Report from "./routes/Report.svelte";
  import News from "./routes/News.svelte";
  import Settings from "./routes/Settings.svelte";
  import PastExams from "./routes/PastExams.svelte";
  import Exitexam from "./routes/Exitexam.svelte";
  import IntroOne from "./routes/IntroOne.svelte";
  import IntroTwo from "./routes/IntroTwo.svelte";
  import IntroThree from "./routes/IntroThree.svelte";
  import IntroFour from "./routes/IntroFour.svelte";
  import MatricSubjects from "./routes/MatricSubjects.svelte";
  import MainScreen from "./routes/MainScreen.svelte";
  import Matric from "./routes/Matric.svelte";
  import SelectCourses from "./routes/SelectCourses.svelte";

  const routes = {
    "/home": Home,
    "/course/:courseId": Course,
    "/topic/:courseId/:filename": Topic,
    "/quest-type": QuestType,
    "/select-topics": SelectTopics,
    "/select-courses": SelectCourses,
    "/quiz/:index": Quiz,
    "/post-quiz": PostQuiz,
    "/study-plan": StudyPlan,
    "/module": Module,
    "/report": Report,
    "/news": News,
    "/settings": Settings,
    "/intro-one": IntroOne,
    "/intro-two": IntroTwo,
    "/intro-three": IntroThree,
    "/intro-four": IntroFour,

    "/past-exams": PastExams,
    "/matric-subjects/:examId": MatricSubjects,
    "/matric/:examId/:subjectId": Matric,
    "/exitexam/:examId": Exitexam,
    "/main": MainScreen,
  };
</script>

<Toaster theme="dark" />
<Router {routes} />
````

## File: src/config.ts
````typescript
export const years = [
  { value: "1", label: "1st year (Freshman)" },
  { value: "2", label: "2nd year" },
  { value: "3", label: "3rd year" },
  { value: "4", label: "4th year" },
  { value: "5", label: "5th year" },
  { value: "6", label: "6th year" },
  { value: "7", label: "7th year" },
  { value: "8", label: "8th year" },
  { value: "9", label: "9th year" },
  { value: "10", label: "10th year" },
];

export const grades = [
  { value: "9", label: "Grade 9" },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

export const fields = [
  { value: "freshman-social", label: "Freshman (Social)" },
  { value: "freshman-natural", label: "Freshman (Natural)" },
  { value: "preeng", label: "Pre-Engineering" },
  { value: "compsci", label: "Computer Science" },
  { value: "bio", label: "Biology" },
  { value: "eng", label: "Engineering" },
  { value: "bus", label: "Business" },
  { value: "psych", label: "Psychology" },
];
````

## File: src/main.ts
````typescript
import { mount } from "svelte";
import "@fontsource/inter";
import "@fontsource/inter/700.css";
import "./app.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
````

## File: src/types.d.ts
````typescript
export type EduFocus = "highschool" | "undergrad" | "exitexam";

export interface UserReport {
  question?: { questionId?: string; questionText: string };
  topic?: { courseId: string; title: string; filename: string };
  issue: string;
}

export type Qtype = "choice" | "tf" | "workout";
export interface Quiz {
  questions: Question[];
  focus: "matric" | "normal" | "exitexam";

  examId: string;
  courses: string[];
  chapters: string[];
  subjectId: string;

  courseId: string;
  topics: string[];
  qtypes: QType[];

  timeTook?: number;
}

export interface MatricExam {
  examId: string;
  examTitle: string;
  tags?: string[];

  examType: "matric";
  stream: "social" | "natural";
  subjects: Array<{
    subjectId: string;
    subjectTitle: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    chapters: {
      chapterId: string;
      chapterTitle: string;
      description: string;
      questionCount: number;
      gradeGroup: "g9-10" | "g11-12";
    }[];
  }>;
}
export interface ExitExam {
  examId: string;
  examTitle: string;
  tags?: string[];

  examType: "exitexam";
  dept: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  courses: Array<{
    courseId: string;
    courseTitle: string;
    questionCount: number;
  }>;
}

export interface Question {
  metadata: {
    questionId: string;
    examId?: string;

    courseId: string;
    courseTitle: string;
    chapterTitle: string;
    chapterId: string;
    grade?: string;
    topic: { title: string; filename: string };

    difficulty: number;
    questionType: "multiple-choice" | "true-false" | "workout";
    subType?: "mathematical" | "conceptual";
    src: string;
    confidence: number;
    confidenceRemark: string;
    correctAnswer: string | null;
  };
  hint: string;
  solution: string;
  question: string;
  options: string[];
  isUserCorrect?: boolean;
  isAnswered?: boolean;
}

export interface Topic {
  title: string;
  filename: string;
  paragraphs: number;
  pageStart: number;
  pageEnd: number;
}

export interface Chapter {
  title: string;
  filename: string;
  pageStart: number;
  pageEnd: number;
  topics: Topic[];
}

export type Outline = Chapter[];

export interface Course {
  courseId: string;
  courseTitle: string;
  emoji: string;
  isHighschool: boolean;
  isExitCore: boolean;
  grade: string;
  fields: string[];

  showMenu?: boolean;
  outline?: Outline;
}

export interface TopicData {
  difficulty: number;
  duration: number;
  bloomsLevels: string[];
  flexibility: string;
  confidence: number;
  confidenceRemark: string;
  pageStart: number;
  pageEnd: number;
  funfacts: string[];
  youtubeKeywords: string;
  videos: Array<{
    videoId: string;
    videoTitle: string;
    channelTitle: string;
    thumbnails: string[];
    duration: string;
  }>;
  slides: Array<{
    slideTitle: string;
    slideContent: string;
  }>;

  nextTopic?: { title: string; filename: string };
  prevTopic?: { title: string; filename: string };
}
````

## File: src/vite-env.d.ts
````typescript
/// <reference types="svelte" />
/// <reference types="vite/client" />
````

## File: .gitignore
````
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
modules
docs
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
````

## File: components.json
````json
{
	"$schema": "https://next.shadcn-svelte.com/schema.json",
	"style": "default",
	"tailwind": {
		"config": "tailwind.config.ts",
		"css": "src/app.css",
		"baseColor": "slate"
	},
	"aliases": {
		"components": "$lib/components",
		"utils": "$lib/utils",
		"ui": "$lib/components/ui",
		"hooks": "$lib/hooks"
	},
	"typescript": true,
	"registry": "https://next.shadcn-svelte.com/registry"
}
````

## File: eslint.config.js
````javascript
// eslint.config.js
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    // See more details at: https://typescript-eslint.io/packages/parser/
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte
        parser: ts.parser,
        // Specify a parser for each language, if needed:
        // parser: {
        //   ts: ts.parser,
        //   js: espree,    // Use espree for .js files (add: import espree from 'espree')
        //   typescript: ts.parser
        // },

        // We recommend importing and specifying svelte.config.js.
        // By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
        // While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
        // explicitly specifying it ensures better compatibility and functionality.
        svelteConfig,
      },
    },
  },
  {
    rules: {
      // Override or add rule settings here, such as:
      // 'svelte/rule-name': 'error'
      "svelte/no-at-html-tags": "off",
    },
  },
);
````

## File: index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gebi App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
````

## File: mynotes.md
````markdown
googleaistudeokey = AIzaSyB8PHWafA078UG1aq4JvSI7-afiIT7Io2M
geminiaistudeokeyhana = AIzaSyAnC3ptwWNPzlpnzATVsKNC-sFpo0FMtSk

# when writing documents; make sure to do an intro for each Section object;
# dont forget to check for filename duplicates in the outline;
# dont ever make the student feel stupid, tnsh echin kanebebsh beka pis nw; esti let's try this one
# dont forget a reporting mechanism
# you should think of exam multipiers

# these are some contents that can be omitted in the outline so look out when creating the file output;
Content to Consider Omitting:
1. Review questions/summaries at chapter ends
2. Self-assessment quizzes
3. Learning objectives listings
4. Glossary sections
5. References/bibliography sections
6. Historical sidebars/boxes
7. "Further Reading" sections
8. Online resource links
9. Appendices with supplementary material
10. "For Advanced Readers" sections

# metadatas
-difficulty from 1 through 10
-estimated duration in minutes
-prerequisites
-bloomsLevel: [remember, understand, apply, analyze, evaluate, create] - [memorize, conceptual, steps, logic, analysis, create],
-flexibility: [must-read, essential, optional]


please clearly isolate responsiblities in system and user prompt, giving more context in the user prompt, and for your questions:
the prerequisites array should be small in number, and there is no need to validate at this state, just prompt it to only focus on metadata generation while not fucking up the existing structure

I am building an agent to convert a textbook PDF to a highly segmented html files based on topics;
the first step is to change the PDF to a big html file with zero styling then to strip every tag except image tags to preserve image info
the reason for i did not just convert it to text file and feed it into the LLM is because i wanted to link the images
then after that is to get an outline from the LLM based on the file, after that recursively going to each topic in it to create an html file with images in the input file
can you write a prompt for me to do the final step; i am expecting an output of something like;
<script type="application/ld+json">{{metadata about topic}}</script>
{{the rest of html content}

the meta data is these infos
- **Difficulty (1-10):** Evaluate based on content complexity relative to the overall course.
- **Duration:** Estimate the reading/understanding time in minutes, considering content length and complexity.
- **BloomsLevels:** Determine one or more applicable levels from: [memorize, conceptual, steps, logic, analysis, create]. Always output these as an array.
- **Flexibility:** Categorize the topic’s importance as one of: [must-read, essential, optional].
before writing the prompt do you have questions for me

It took me a long time to work out why it had been so easy and why this
time I hadn’t suffered those terrifying withdrawal pangs. The reason is that
they do not exist. It is the doubt and uncertainty that cause the pangs. The
beautiful truth is: IT IS EASY TO STOP SMOKING. It is only the
indecision and moping about it that make it difficult. Even while they are
addicted to nicotine, smokers can go for relatively long periods at certain
times in their lives without bothering about it. It is only when you want a
cigarette but can’t have one that you suffer.

-<p>, <div>, and <span> with optionally these class names: "definition", "example", "note (for tips, warnings, importants)"
-class: "math" <div> and <span> for math
-<h1>, <h2>, <h3> for heading and <p> for paragraphes
-<ul>, <ol>, <li>
-<pre><code></code></pre> for code to be highlighted by highlight.js
-<blockquote> for important quotes or callouts
-<strong>, <em>, <u> tag for styling
-<table>, <th>, <tr>, <td> - For tabular data

# image to exams convertor
i am trying to plan an agent that will input images of past exams, and will output structured data of the questions;
the outputs i was thinking are questions, answer with explanation or steps (be extensive if you have to), hint, and metadata about difficulty, questiontype and even the topic;
what else should i consider outputting? please answer briefly

i am trying to plan an agent that will input images of past exams, and will output structured data of the questions;
what i have in mind is something like an HTML that uses KaTeX for math and highlight.js for code;

# course folder structure

## INPUT:
dept1.pdf
dept2.pdf

## OUTPUT:
dept/
  coursename/
    topic1.html
    topic2.html
    img1.jpg
    img2.jpg
    progress.json
    coursename.ot.json

### For Mid/Final contents
## INPUT:
dept/
  bmu-10988537395/
    img1.jpg
    img2.jpg
    img3.jpg
  bmu-10938287493/
    img1.jpg
    img2.jpg
    img3.jpg

## OUTPUT:
dept/
  bmu-10988537395/
    exams.html
    img1.jpg
    img2.jpg
    img3.jpg
  bmu-10938287493/
    exams.html
    img1.jpg
    img2.jpg
    img3.jpg

### For Exit Exam contents
## INPUT:
model1/
  img1.png
  img2.png
model2/
  raw.html
  raw-clean.txt

## OUTPUT:
model1/
  exams.html
  img1.png
  img2.png
model2/
  exams.html
  raw.html
  raw-clean.txt


create a prompt for an agent that extrats exams from a bunch of images taken from past exams;
these images may be incomplete or blurry, or they might have incomplete questions; for that just inform
the model through the prompt to fill the missing parts of question by itself, and with the image the model will be given an outline JSON
of the course topics from which those questions have been extracted; therefore the model will output metadata about each question;
i expect an output something like
<script id="course-metadata" type="application/ld+json">
{ ...metadata JSON...; which includes hint, topic, difficulty (1 through 10), questionType }
</script>
<div id="question-1">
  <div class="question"> </div>
  <div class="options"> {{ which can be ABCD choices or True or False} </div>
  <div class="solution"> </div>
</div>

update on the output structure: the output should be like:
<script id="metadata-1" type="application/ld+json">
{{ ...metadata JSON...}
</script>
<div id="question-1">
{{... question content here ...}
</div>

also the hint should be in the question tag like: <div class="hint"></div>

## img to exam prompt

You are an expert exam question analyzer and reconstructor. Your task is to process images of exam questions, analyze them, and output structured questions with metadata. You must work with the provided course outline JSON to properly categorize questions.

COURSE OUTLINE:
[COURSE_OUTLINE_JSON_PLACEHOLDER]

CORE RESPONSIBILITIES:
1. Process exam question images (single or multiple questions per image)
2. Reconstruct unclear/incomplete questions while maintaining topic relevance
3. Generate structured output with metadata and content
4. Convert questions to supported formats (multiple-choice, true/false, workout/short answer)
5. Map questions to course topics

OUTPUT STRUCTURE:
For each question, generate:

1. Metadata script:
<script id="metadata-{n}" type="application/ld+json">
{
    "id": "string",
    "topics": ["filename1", "filename2"],
    "difficulty": number(1-10),
    "questionType": "multiple-choice" | "true-false" | "workout",
    "originType": "real" | "reconst",
    "imageRefs": ["img1.jpg"], // if needed
    "confidence": number(1-10),
    "confidenceRemark": "string",
    "correctAnswer": "A"|"B"|"C"|"D"|"E"|"True"|"False"|null
}
</script>

2. Question content:
<div id="question-{n}">
    <div class="question-text">...</div>
    <div class="hint">...</div>
    <div class="options">...</div> // if applicable
    <div class="solution">...</div>
</div>

RULES AND GUIDELINES:

1. Question Processing:
- Mark as "real" only if question is completely clear and readable
- Mark as "reconst" if ANY part needs reconstruction
- Maintain topic relevance when reconstructing
- Preserve original difficulty level when determinable
- Convert matching/fill-in-blank to multiple-choice

2. Topic Mapping:
- Map to ALL relevant topics from course outline
- Use topic filenames in metadata
- Include confidence remark if topic mapping is uncertain

3. Content Formatting: ALLOWED HTML ELEMENTS AND USAGE

  Heading Structure:
  <h1> - Main topic title only
  <h2> - Major section divisions
  <h3> - Subsection headings
  Maintain strict hierarchy; no skipping levels

  Content Containers:
  <p> - Standard paragraphs
  <div> and <span> with classes:
  - class="definition" - Formal term definitions
  - class="example" - Illustrative examples
  - class="note" - Tips, important points, warnings

  Mathematical Content:
  <span class="math-inline"> - For inline mathematics
  <div class="math-display"> - For displayed equations
  [Use combination of LaTeX and unicode; ensure proper delimiters]

  Code Sections:
  <pre><code class="language-[name]"> - For code snippets
  [Always specify language; ensure proper formatting]

  List Structures:
  <ul> - Unordered lists (concepts, points)
  <ol> - Ordered lists (steps, procedures)
  <li> - List items
  [Maintain proper nesting for complex multi-level lists; use appropriate type]

  Text Emphasis:
  <strong> - Critical emphasis
  <em> - Secondary emphasis
  <u> - Underlining
  [Use sparingly and meaningfully]

  Special Elements:
  <blockquote> - Significant quotes or key points
  <table>, <th>, <tr>, <td> - Tabular data
  <hr> - Major section breaks

4. Mathematical Content:
- Use KaTeX for mathematical expressions
- Use appropriate math-inline or math-display classes
- Combine with Unicode where appropriate

5. Image References:
- Include imageRefs if diagrams/tables are essential
- Reference images sequentially (img1.jpg, img2.jpg, etc.)
- Reconstruct tables in HTML when possible

EXAMPLES:

1. Clear Multiple Choice Question:
[Example image of a clear question about DFS algorithm]

<script id="metadata-1" type="application/ld+json">
{
    "id": "1",
    "topics": ["dfs", "problem-solving-search"],
    "difficulty": 7,
    "questionType": "multiple-choice",
    "originType": "real",
    "imageRefs": [],
    "confidence": 9,
    "confidenceRemark": "Clear question with direct topic mapping",
    "correctAnswer": "B"
}
</script>
<div id="question-1">
    <div class="question-text">
        Consider the following graph traversal using DFS:
        <div class="math-display">
            [Graph representation in KaTeX]
        </div>
        What is the correct sequence of visited nodes?
    </div>
    <div class="hint">
        Remember that DFS explores as far as possible along each branch before backtracking.
    </div>
    <div class="options">
        <div class="option" data-option="A">1-2-4-3-5</div>
        <div class="option" data-option="B">1-2-3-4-5</div>
        <div class="option" data-option="C">1-3-2-4-5</div>
        <div class="option" data-option="D">1-2-3-5-4</div>
    </div>
    <div class="solution">
        <p>The correct answer is B (1-2-3-4-5). Here's why:</p>
        <ol>
            <li>Starting at node 1</li>
            <li>Following DFS principle, we go deep through the leftmost path first</li>
            <li>This leads us to sequence 1-2-3</li>
            <li>After backtracking, we visit 4 and finally 5</li>
        </ol>
        <p>Alternative approach: You could also verify this by drawing the DFS tree.</p>
    </div>
</div>

VALIDATION REQUIREMENTS:
1. Ensure correctAnswer matches available options
2. Verify topic filenames exist in course outline
3. Confirm difficulty and confidence are 1-10
4. Validate HTML structure matches allowed elements
5. Verify image references when needed
6. Ensure mathematical expressions are properly formatted

When processing new questions:
1. Analyze the image thoroughly
2. Determine question type and reconstruction needs
3. Map to course topics
4. Generate structured output
5. Include detailed solutions with explanations
6. Provide helpful hints
7. Validate all metadata and content

Process the exam questions and output structured data according to these specifications.


getUnprocessedExamFolders(courseRoot)
readAndCleanOutline(courseRoot)
getImgsForFolder(folderName) -- accepts only the folderName from output of getUnprocessedExamFolders and then returns the an array of { inlineData: { data: buffer, mimeType }} for Gemini to process
createExams(cleanOutline, imgList) -- inputs from above two functions then gives it to callGemini function and then outputs the HTML content
writeExam(courseRoot, folderName, htmlContent) -- writes the output to exams.html under folderName under exams folder of the courseRoot folder

# a letter
eshi with tips, because i care for you should read this hawisha, lidu endatsasachibegn echin echin ewekilign;
asayegn ena fetnegn estiii eya CHESSS
( so a screen before topic course to tell me learn this and i will test you eshi hawisha,
  also give her a question then when things look hard give her an option to learn about it,
  also give her hints, and directions, no problem tnsh asebina... (abren enesraw?)
)
keza tedy endeza hone nw melesh hahaha;
(
  so be tedy fanta make it Kebede, Miki, Nati, or Josh or Roba (roba it is tewesnual the boys and even chikochu ywedutal eko) and Beti
)
so be video call asayshalew anchi demo;
(
  live help, hand yezo masayet
)
(
  an argument against points; or no points make hawi happy it also makes lidu happy
  but argument against streaks because no one studies every day,
  maybe a weekend study reminder and a week streak with notifications is a good idea
)
(
  also: interesting facts for Abresh in the app and the intellectuals woowwww
  also: did you know questions before the fun facts and even between screens sometimes in the onboarding
    and start of lesson plans and the start of quizzes
)
esti from start ke basicsuu from the begineerrr asrejign; endeeee hayu baby
* i really shouldve called her lideta eyalen and take her places besmamm;
* call her and go tmrw bezaw meseraw sera yenoral ekahen yezeh hid
and talk business with her too;; haha enesu yetsumu egna mn ageban hahaha

i am a really interesting kid gn enezan hula chikoch zm beye metewew; and that makes me ambitious
and even more attractive to girls; and all of this is because of my mother! the love she gave me;
the love of my mother is my power and fuel for my ambition

(
  tadya lidu mech nw menatenawww eee; slide into her DMs in the trial peroid with a personalized message on how Logic kicked her ass
  and also my username is notrobasorry sorrynotroba
  gn demo echin neger kakomk tetamaleh, so atakuma endewm the virality from your timely checks in nicely stolen from Duo
)
(
  Robertoooo with a malia as the story of my page
  Roba in exams and roba in answer explanations Roba in topic summarie wait...
  Roba betam mebzat yelebatm beka
)
(
  be like Dominate Nur, like That Four Juma, like those girls new jema, like Ethio Trollers, like Ela and the childhood friends
  like Panda (consider to open a Panda branch); even document your life journey wowww, an amazing fan base and series!
  do a build in public on tiktok be it like Dominate! even that kid Beki started it like this just to sell Minoxil
  did you see how Minoxil have added other benefits wowwww
  i see how computer makes my productivity 10x and how AI will make my productivity 100x when competing with iStore;
  funny, my nemesis is iStore haha;
)
my goal is to make a big social experiment too, one of a kind!
even move to Grade 12 students, and later high school for this year;
and that video of first apply is with the tekuru susegna tiktoker
  and those chikoch highschool jema for the matric app
i will take over Ethiopia's education;
i have won this system once and i will win it again in an even more marvelous way,
i am a teacher's son right, i will make mama proud with this one!
(
  eee brother first apply tignalesh migerm chewe nw yeze yemetawt;
  so the Applied form this.....
  endeeee
  second apply alew papi;
  abo 3 4te apply abelugn
  ke script atuta eshi;
  gebi temari hono ke fresh eske exit exam wesaj yhen app endayameltwo
)
the fact that i care so much about this is valid because think about 1 Birr and Arada Beer;
I will recreate that impact with this very thought about video and script and story and personalities;
my goal is to make 10M Birr with the way 1 Birr did, we both ye lideta chulelewoch so why not
(
  yaw esun churche nw mimertelegn haha semteshal mommy
)
Also collab with Ale in the media side

(
  the amazing point i have understood today is that my market is so small and limited,
  and not infinity
)
(
  this 500 is to give all the time you have spent in Gebi worth it;
  you have learned all these years, make all that time worth it!
  this will carry you to the long future from grade 12 to job
    and even abroad studies
)
a message to the world, i climbed in the rooftop, metbes sesh and was reading to
  Psalms and listening to a Jazz Christian song, Jesus is a very personal God
  tekekel neberku? no but He is my God
    (my mother, my father, my bf, my wife, my first son; all have replacements except
    maybe my mother and father; maybe thats a reflection of how the Creator has no replacement.
    but God is the only God (in Orit the Dagim) and that shows how precious He is.)
    so mnm hatiyateh kesu mehret aybeltemena mnm ke amlakeh ke Geta ayarekeh
maybe this is a message to the world to call people into my clinic

-when apps that are veryyy big and started from a niche;
then forget their niche when they are big that is the opportunity to
take my niche because controlling a small market is enough for you eyu
-backgrounds blurred, faded or gradient of AAU in the onboarding!
its nice when you invite people into your life, the ones that have seen the resistance love it so much

-remember your good teachers; the ones that are passionate about their fields; be that

in designing an AI study app; i am stuck at a decision;
after quizzes students will be given an assessment on their weakness and strength based on the topics tested in the quiz; i am having troubles deciding:
1. how to display the strength and weaknesses and the report in general
2. if to store the assessment for future reference how would i list it, and how would things get handled when the students takes new quizzes
before giving recommendations you are free to ask me questions
 pleae be brief and with high word to value ratio in your responses
````

## File: package.json
````json
{
  "name": "gebiapp",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "lint": "eslint src",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.app.json && tsc -p tsconfig.node.json"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^5.0.3",
    "@tailwindcss/container-queries": "^0.1.1",
    "@tailwindcss/forms": "^0.5.10",
    "@tailwindcss/typography": "^0.5.16",
    "@tsconfig/svelte": "^5.0.4",
    "@typescript-eslint/eslint-plugin": "^8.26.1",
    "@typescript-eslint/parser": "^8.26.1",
    "autoprefixer": "^10.4.20",
    "bits-ui": "^1.3.6",
    "clsx": "^2.1.1",
    "eslint": "^9.22.0",
    "eslint-plugin-svelte": "^3.1.0",
    "globals": "^16.0.0",
    "lucide-svelte": "^0.475.0",
    "svelte": "^5.19.6",
    "svelte-check": "^4.1.4",
    "tailwind-merge": "^3.0.1",
    "tailwind-variants": "^0.3.1",
    "tailwindcss": "^3.4.17",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.26.1",
    "vite": "^6.1.0"
  },
  "dependencies": {
    "@fontsource/inter": "^5.1.1",
    "@fontsource/manrope": "^5.1.1",
    "@fontsource/nunito": "^5.1.1",
    "@fontsource/poppins": "^5.1.1",
    "@fontsource/space-grotesk": "^5.1.1",
    "ky": "^1.7.5",
    "svelte-sonner": "^0.3.28",
    "svelte-spa-router": "^4.0.1"
  }
}
````

## File: postcss.config.js
````javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
````

## File: README.md
````markdown
# Svelte + TS + Vite

This template should help get you started developing with Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
````

## File: svelte.config.js
````javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
````

## File: tailwind.config.ts
````typescript
import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          // DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          DEFAULT: "#005ce6",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "#F6FAFF",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--bits-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--bits-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
````

## File: tsconfig.app.json
````json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "resolveJsonModule": true,
    "allowJs": true,
    "checkJs": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte"]
}
````

## File: tsconfig.json
````json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "types": [],
    "baseUrl": ".",
    "paths": {
      "$lib": ["./src/lib"],
      "$lib/*": ["./src/lib/*"]
    }
  },

  "include": ["src/**/*.ts", "src/**/*.js", "src/**/*.svelte", "src/types.d.ts"]
}
````

## File: tsconfig.node.json
````json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
````

## File: vite.config.ts
````typescript
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
});
````
