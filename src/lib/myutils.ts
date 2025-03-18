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
