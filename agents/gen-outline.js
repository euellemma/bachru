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
