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
