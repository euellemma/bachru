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
