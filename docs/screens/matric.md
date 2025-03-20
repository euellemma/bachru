```markdown
## Goal
Display a specific matric exam subject, its chapters, and provide options to read chapter topics or start chapter-specific or full exams.

## API Functions and State

- **API Functions**:
  - `getMatricExam(examId: string)`: Fetches the complete matric exam data from the API. Called only if the exam data is not already available in the `permstate.matricExams`.
  - `getQuizQuestions()`: Fetches quiz questions for the exam.

- **State Variables**:
  - `params`: Route parameters from `svelte-spa-router`, containing `examId` and `subjectId`.
  - `exam: MatricExam | null`: Stores the current matric exam data. Initialized to `null`.
  - `subject: MatricExam["subjects"] | null`: Stores the specific subject within the exam. Initialized to `null`.
  - `progress: Record<string, number>`: Stores the user's progress (number of answered questions) for each chapter within the subject. The key is the chapter ID, and the value is the number of answered questions.
  - `loading: boolean`: Indicates whether the exam data is currently being fetched. Initialized to `true`.
  - `quizLoading: string | null`: Stores the chapter ID that is currently loading for an exam. If `null`, no exam is currently loading. If equal to "all", means a full exam is loading.
  - `activeTab: string`: Represents the active grade group tab ("g9-10" or "g11-12"). Initialized to "g9-10".
  - `permstate`: Persistent state object containing user information, courses, and exam data.
  - `tempstate`: Temporary state object for managing the quiz state.

## UI Description

The UI is structured to display information about a specific subject within a matric exam and allow the user to start exams (full or chapter-specific) or read chapter topics.

1.  **Header (Blue Background):**
    *   **Back Button:** A button with an arrow icon that navigates the user back to the previous page using `history.back()`.  It is placed on the left side.
    *   **Subject Title:** Displays the title of the subject. A skeleton loader is shown while `loading` is `true`. It's aligned to the right.
    *   **Grade Group Tabs:** A `flex` container holding two buttons to toggle between the grade groups "9-10" and "11-12".
        *   **Functionality**: Each button updates the `activeTab` state variable to either "g9-10" or "g11-12". The active tab's button is styled with a white background and blue text, while the inactive tab has a blue background and white text.  The buttons are disabled while `quizLoading` is not `null`.
    *   **Start Exam Button:** A button labeled "Start Exam" that initiates a full exam for the subject.
        *   **Functionality**: Calls the `startExam()` function (described below). While the exam is loading (`quizLoading === "all"`), the button displays a loading indicator and the text "Loading...". The button is a `Button` component from `$lib/components/ui/button` with `variant="ghost"` styling, giving it a transparent background by default. The button is disabled when `quizLoading` is not `null`.

2.  **Chapter List (White Background):**
    *   A `div` with a white background and rounded top corners, containing a list of chapters. Uses `space-y-4` for vertical spacing between chapters and `mb-8` to give the whole block space from the bottom.
    *   **Conditional Rendering:** The chapter list is conditionally rendered based on the `exam` and `loading` state. If `exam` is truthy and `loading` is `false`, the chapter list is displayed. Otherwise, a set of skeleton loaders are rendered as placeholders.
    *   **Chapter Display:**
        *   Uses `{#each}` to iterate through the chapters of the subject that belong to the `activeTab` grade group (`subject?.chapters.filter((chapter) => chapter.gradeGroup === activeTab)`). The chapters are filtered based on the currently selected grade group (`activeTab`).  The `in:slide` transition provides a sliding animation when chapters are rendered. Each chapter is rendered within a `div` with `mb-6` margin and a nested `div` with `p-3`, rounded corners, a border, and `space-y-3`.
        *   **Chapter Title:** Displays the title of the chapter in bold text.
        *   **Progress Indicator:** Shows the user's progress for the chapter as a fraction (e.g., "2/10 Qs").  The number of answered questions is retrieved from the `progress` object, and the total number of questions is retrieved from the `chapter.questionCount` property. It is aligned to the right.
        *   **Progress Bar:** A visual representation of the user's progress, using a colored bar that fills proportionally to the percentage of answered questions.  It uses a `div` with `h-3`, `bg-gray-200` and rounded corners as the background and a nested `div` with `h-full`, `bg-blue-400`, and rounded corners for the filled part. The width of the filled part is dynamically set using inline styles (`style="width: ...%"`).
        *   **Chapter Actions:** A `flex` container holding buttons to "Read" the chapter topics or start a chapter-specific exam.
            *   **Read Button:** Navigates the user to the topic view for the chapter using `push(\`/topic/\${subjectId}/\${chapter.chapterId}\`)`. It displays a book icon and the text "Read". It calls the `push` function from `svelte-spa-router` to navigate. It's a `Button` component from `$lib/components/ui/button` with `variant="secondary"` styling. The button is disabled when `quizLoading` is not `null`.
            *   **Exam Chapter Button:** Starts an exam specifically for the chapter using `startExam(chapter.chapterId)`.  It displays a play icon and the text "Exam Chapter". The text changes to "Loading..." and displays a loading indicator while the exam is loading for that specific chapter (`quizLoading === chapter.chapterId`). It calls the `startExam` function with the chapter ID. The button is disabled when `quizLoading` is not `null`.
    *   **Skeleton Loaders:** If `exam` is falsy or `loading` is `true`, a series of skeleton loaders are displayed as placeholders for the chapter information. Each skeleton consists of boxes with rounded corners.  There are 3 skeleton loaders, and they mirror the structure of a displayed chapter.

**startExam Function:**

*   **Purpose**: Initiates a quiz either for all chapters or for a specific chapter.
*   **Parameters**: Takes an optional `id` parameter, defaulting to "all". The `id` represents the chapter ID if starting a chapter-specific exam; otherwise, if `id` is "all", it starts a full exam.
*   **Functionality**:
    1.  Sets the `quizLoading` state variable to the `id` to indicate which exam is loading.
    2.  Introduces a 2-second delay using `setTimeout` to simulate a loading process.
    3.  Calls the `getQuizQuestions()` API function to fetch the quiz questions.
    4.  If the `id` is not "all" (i.e., a chapter-specific exam), it sets the `tempstate.quiz.chapters` array to contain only the specified chapter ID.
    5.  Sets the `tempstate.quiz.questions` array to the fetched quiz questions.
    6.  Navigates the user to the "/exam" route using `push("/exam")`.

**getExamProgress Function:**
*   Purpose: Determines and returns the progress for each chapter of a subject in an exam.  Progress is determined by counting the number of unique answered questions for each chapter based on the `permstate.matricExamProgress` data.
*   Parameters:
    * `currentExam`: The MatricExam object.
    * `examIdentifier`: The ID of the exam.
    * `progressData`: The `permstate.matricExamProgress` data.
*   Functionality:
    1. Returns an empty object if `currentExam` or `examIdentifier` is null or undefined.
    2. Retrieves the subject progress data from the `progressData` using `examIdentifier` and `subjectId`.
    3. Iterates through the `subjectProgress` for each `chapterId`.
    4. Creates a set of answered question ID's for each chapter and returns the length of the set.

## Navigation

-   **Back Navigation:** Clicking the back button in the header navigates the user to the previous page in the browser history using `history.back()`. No specific context is passed.
-   **Chapter Topic Navigation:** Clicking the "Read" button navigates the user to the topic view for the selected chapter using `push(\`/topic/\${subjectId}/\${chapter.chapterId}\`)`. The navigation context includes the `subjectId` and `chapter.chapterId`.
-   **Exam Navigation:** Clicking the "Start Exam" or "Exam Chapter" buttons navigates the user to the "/exam" route using `push("/exam")`. The navigation context is stored in `tempstate.quiz` and includes the exam ID, subject ID, and chapter IDs (if a chapter-specific exam is started).

## Special Notes

-   The component relies on the `permstate` and `tempstate` Svelte stores for managing application state.
-   The `save(permstate)` function is called after fetching the exam data to persist the data in local storage.
-   The skeleton loaders are used to provide a better user experience while the exam data is loading.
-   The component filters the chapter list based on the `activeTab` state variable, allowing the user to switch between grade groups.
-   The `quizLoading` state variable is used to prevent the user from starting multiple exams simultaneously.
-   The progress calculation relies on the structure of the `permstate.matricExamProgress` object.
-   The component uses the `slide` transition from `svelte/transition` to animate the chapter list.
-   The `getExamProgress` function handles cases where the `progressData` might be missing or incomplete.

## TODO

[ ] Add error handling for API calls (e.g., display an error message if `getMatricExam` fails).
[ ] Implement a more robust loading indicator for the "Start Exam" button.
[ ] Optimize the progress calculation logic for better performance.

[ ] Consider adding pagination for long chapter lists.
[ ] Implement a confirmation dialog before navigating back to the previous page.
[ ] Add a feature to filter chapters by difficulty level.
[ ] Explore adding support for different question types beyond multiple-choice.
```