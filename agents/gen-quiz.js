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
