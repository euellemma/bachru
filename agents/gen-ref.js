/*
 * Generate reference documentation for Svelte screens
 *
 * This agent scans a directory of Svelte files and generates markdown reference
 * documentation for each screen component.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { callModel, retry } from "./agent-utils.js";

// Convert PascalCase/camelCase to kebab-case
function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
    .toLowerCase();
}

// Create docs directory if it doesn't exist or backup existing one
async function setupOutputDirectory(outputDir) {
  try {
    // Handle both relative and absolute paths
    const normalizedPath = path.normalize(outputDir);

    // Check if directory already exists
    try {
      const stats = await fs.promises.stat(normalizedPath);
      if (stats.isDirectory()) {
        // Generate random 4-digit string
        const randomString = Math.floor(1000 + Math.random() * 9000).toString();
        const backupDir = `${normalizedPath}.backup.${randomString}`;

        console.log(`Output directory exists. Renaming to: ${backupDir}`);
        await fs.promises.rename(normalizedPath, backupDir);
      }
    } catch (error) {
      // Directory doesn't exist, which is fine
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Create fresh directory
    await fs.promises.mkdir(normalizedPath, { recursive: true });
    console.log(`Created fresh output directory: ${normalizedPath}`);
  } catch (error) {
    console.error(`Error setting up directory ${outputDir}:`, error);
    throw error;
  }
}

// Generate reference documentation for a single Svelte file
async function generateReference(
  svelteFilePath,
  outputDir,
  stateContent,
  typesContent,
) {
  const fileName = path.basename(svelteFilePath);
  const componentName = fileName.replace(".svelte", "");
  const kebabName = toKebabCase(componentName);
  const outputPath = path.join(outputDir, `${kebabName}.md`);

  console.log(`Processing ${fileName}...`);

  try {
    // Read Svelte file content
    const svelteContent = await fs.promises.readFile(svelteFilePath, "utf8");

    // Prepare prompt
    const prompt = `
Generate a reference.md file for an app screen based on the Svelte code I provide. Structure it with these sections:

- **Goal**: Concise purpose of the screen
- **API Functions and State**: List of API functions called and state variables used
- **UI Description**: Clear breakdown of UI components and their functionality; make sure to spend time here providing max details and be extensive
- **Navigation**: Outgoing navigation paths with context
- **Special Notes**: Important implementation details or edge cases
- **TODO**: Actionable checklist organized in two parts:
  1. Essential TODOs - immediate action items
  2. Future TODOs - longer-term improvements

When providing the TODO list do not title it or add speical stylings. Open [ ] checkboxes with sentences is enough

I'll provide the relevant Svelte component code along with state management and global type declarations to give you full context.

SVELTE COMPONENT:
\`\`\`svelte
${svelteContent}
\`\`\`

STATE MANAGEMENT:
\`\`\`typescript
${stateContent}
\`\`\`

TYPE DECLARATIONS:
\`\`\`typescript
${typesContent}
\`\`\`
`;

    // Call the LLM to generate the reference documentation
    const markdownContent = await retry(() =>
      callModel(prompt, { json: false, images: [] }),
    );

    // Write the generated markdown to file
    await fs.promises.writeFile(outputPath, markdownContent);
    console.log(`✅ Generated reference documentation: ${outputPath}`);

    return true;
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error);
    return false;
  }
}

// Create a combined markdown file with all screen documentation
async function createCombinedMarkdown(outputDir, processedFiles) {
  const combinedPath = path.join(outputDir, "screens.md");
  console.log(`Creating combined markdown file: ${combinedPath}`);

  try {
    let combinedContent = "# App Screens Reference Documentation\n\n";

    for (const file of processedFiles) {
      const filePath = path.join(outputDir, file);
      const fileName = file.replace(".md", "");

      // Add a header for each file using its name
      combinedContent += `\n\n## ${fileName}\n\n`;

      // Read and append the file content
      const content = await fs.promises.readFile(filePath, "utf8");
      combinedContent += content;

      // Add a separator
      combinedContent += "\n\n---\n\n";
    }

    // Write the combined file
    await fs.promises.writeFile(combinedPath, combinedContent);
    console.log(`✅ Created combined markdown file: ${combinedPath}`);

    return true;
  } catch (error) {
    console.error(`❌ Error creating combined markdown:`, error);
    return false;
  }
}

// Main function to process all Svelte files
async function main() {
  // Check if running as script
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const inputDir = process.argv[2];
    const outputDir = process.argv[3] || "../docs/screens";

    if (!inputDir) {
      console.log(
        "Usage: node gen-ref.js <svelte-files-directory> [output-directory]",
      );
      console.log("Default output directory: docs/screens");
      return;
    }

    console.log(`Starting reference documentation generation...`);
    console.log(`Input directory: ${inputDir}`);
    console.log(`Output directory: ${outputDir}`);

    try {
      // Setup output directory (backup if exists, then create fresh)
      await setupOutputDirectory(outputDir);

      // Get list of Svelte files
      const files = await fs.promises.readdir(inputDir);
      const svelteFiles = files.filter((file) => file.endsWith(".svelte"));

      console.log(`Found ${svelteFiles.length} Svelte files to process`);

      // Load state and types files
      const stateFilePath = path.join(inputDir, "../lib/state.svelte.ts"); // Adjust path as needed
      const typesFilePath = path.join(inputDir, "../types.d.ts"); // Adjust path as needed

      let stateContent = "";
      let typesContent = "";

      try {
        stateContent = await fs.promises.readFile(stateFilePath, "utf8");
        console.log(`Loaded state file: ${stateFilePath}`);
      } catch (error) {
        console.warn(`Warning: Could not load state file: ${error.message}`);
      }

      try {
        typesContent = await fs.promises.readFile(typesFilePath, "utf8");
        console.log(`Loaded types file: ${typesFilePath}`);
      } catch (error) {
        console.warn(`Warning: Could not load types file: ${error.message}`);
      }

      // Process each Svelte file
      let processed = 0;
      let failed = 0;
      const successfullyProcessedFiles = [];

      for (let i = 0; i < svelteFiles.length; i++) {
        const fileName = svelteFiles[i];
        const filePath = path.join(inputDir, fileName);
        const componentName = fileName.replace(".svelte", "");
        const kebabName = toKebabCase(componentName);
        const mdFileName = `${kebabName}.md`;

        console.log(
          `[${i + 1}/${svelteFiles.length}] Processing ${fileName}...`,
        );

        const success = await generateReference(
          filePath,
          outputDir,
          stateContent,
          typesContent,
        );
        if (success) {
          processed++;
          successfullyProcessedFiles.push(mdFileName);
        } else {
          failed++;
        }
      }

      // Create combined markdown file with all documentation
      if (successfullyProcessedFiles.length > 0) {
        await createCombinedMarkdown(outputDir, successfullyProcessedFiles);
      }

      console.log("\n=== Reference Documentation Generation Complete ===");
      console.log(`Total Svelte files: ${svelteFiles.length}`);
      console.log(`Successfully processed: ${processed}`);
      console.log(`Failed: ${failed}`);
      console.log(`Output directory: ${outputDir}`);
      console.log(`Combined markdown: ${path.join(outputDir, "screens.md")}`);
    } catch (error) {
      console.error("Error in main process:", error);
    }
  }
}

main();
