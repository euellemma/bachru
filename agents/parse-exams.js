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
