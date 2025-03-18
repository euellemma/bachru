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
