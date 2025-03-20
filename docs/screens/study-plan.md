```markdown
# Reference: Study Plan Screen

- **Goal**: To display a personalized study plan based on the user's quiz results, allowing them to focus on weak areas or review strong ones.

- **API Functions and State**:
  - **API Functions**: None directly. Data is generated client-side using `permstate.quizResults`.
  - **State Variables**:
    - `activeTab`: `$state("weak")` -  Indicates the active tab, either "weak" or "strong", determining which topics are displayed.
    - `studyPlanData`: `$state({ chapters: [] })` - Stores the raw study plan data, an object containing an array of chapters with topics.
    - `isLoading`: `$state(true)` - Controls the loading state, displaying a skeleton UI while `true`.
    - `displayPlan`: `$derived` - A derived state that filters `studyPlanData` based on the `activeTab`, showing only weak or strong topics. Depends on `studyPlanData` and `activeTab`.
    - `tempstate`: stores temporary application state such as the quiz focus, course and topic selection, and report information.
    - `permstate`: stores persistent application state such as user info, courses, quiz results, and exam data.

- **UI Description**:

  The screen is divided into two main sections: a header and a content area.

  1.  **Header (Blue Background)**:
    *   **Back Button**: A button with an arrow icon (using `lucide-svelte`) that navigates the user back to the previous page using `history.back()`.
    *   **Title**: A "Study Plan" heading.
    *   **Tab Buttons**: Two buttons, "Weak Topics" and "Strong Topics".
        *   Clicking each button updates the `activeTab` state, triggering a re-render of the content area to display corresponding topics.
        *   The active tab button has a white background and blue text, while the inactive tab has a blue background and white text.

  2.  **Content Area (White Background)**:

    *   **Information Bar**: Displays a message based on the active tab.
        *   "Weak Topics" tab: displays a yellow background with an alert icon and the text "Topics to Focus On".
        *   "Strong Topics" tab: displays a green background with a checkmark icon and the text "Mastered Topics".
    *   **Loading State**:
        *   If `isLoading` is `true`, a skeleton loader is displayed, consisting of multiple `Skeleton` components (from `$lib/components/ui/skeleton`) to simulate the layout of the study plan. Multiple skeleton blocks are rendered in a loop. Each block has a chapter-level skeleton and multiple topic-level skeletons.
    *   **Empty State**:
        *   If `displayPlan.chapters.length` is 0 and `isLoading` is `false`, an empty state message is displayed, using `fade` transition:
            *   "Weak Topics" tab: Displays a yellow alert icon, a "No Weak Topics Found" heading, and a congratulatory message.
            *   "Strong Topics" tab: Displays a green checkmark icon, a "No Mastered Topics Yet" heading, and an encouraging message.
    *   **Study Plan Display**:
        *   If `displayPlan.chapters.length` is greater than 0 and `isLoading` is `false`, the study plan is rendered. The list of topics uses a `slide` transition.
        *   For each chapter in `displayPlan.chapters`:
            *   **Chapter Header**:
                *   A button that toggles the `isExpanded` property of the chapter, expanding or collapsing the chapter content. Uses a `slide` transition when rendered.
                *   Displays the chapter title and, optionally, the chapter grade (e.g., "Chapter Title (Grade)").
                *   Includes a `ChevronDown` icon (using `lucide-svelte`) that rotates 180 degrees when the chapter is expanded.
            *   **Chapter Content (Topics)**:
                *   Displayed only when `chapter.isExpanded` is `true`.
                *   A `space-y-4` div contains topic information.
                *   For each topic in `chapter.topics` (filtered based on `activeTab`):
                    *   A `div` with rounded corners, a border, and padding. Uses a `fly` transition on enter and `fade` transition on exit.
                    *   **Topic Title**: Displays the topic title in bold text.
                    *   **Topic Status**:
                        *   Displays the status of the topic ("Weak Topic" or "Strong Topic") with a corresponding color and background.  The color styling is handled by the `getStatusColor` and `getStatusText` functions.
                    *   **Action Buttons**:
                        *   "Read" Button: Navigates to the topic reading page using the `readTopic` function. Displays a `BookOpen` icon.
                        *   "Practice Topic" Button: Navigates to the practice page using the `practice` function, only if `tempstate.quiz.focus` is not "matric." Displays a `Play` icon.

- **Navigation**:
    -   **Back Button**: Navigates to the previous page in the browser history.
    -   **Read Button (Topic)**: Navigates to `/topic/{courseId}/{topic.filename}`.
        *   For `normal` quiz focus, `courseId` is taken from `tempstate.quiz?.courseId || "default"`.
        *   For `exitexam` and `matric` quiz focus, `courseId` is taken from `topic.courseId`.
    -   **Practice Topic Button**: Navigates to `/select-topics` or `/select-courses` depending on the quiz focus, setting topic or course context:
        *   If the quiz focus is "normal", the app navigates to "/select-topics" and sets `tempstate.quiz.topics` to `[topic.filename]`.
        *   If the quiz focus is "exitexam", the app navigates to "/select-courses" and sets `tempstate.quiz.courses` to `[topic.courseId]`.

- **Special Notes**:

  *   The study plan is dynamically generated based on the user's quiz results stored in `permstate.quizResults`.
  *   The `createMatricOutline`, `createExitOutline`, and `createQuizOutline` functions handle the logic for creating the study plan based on the `quiz.focus` value in `tempstate`.  These functions filter weak and strong topics from the quiz results and group them by chapter (for matric and quiz focus) or course (for exit exam focus).
  *   The `displayPlan` derived state ensures that only topics matching the active tab (weak or strong) are displayed.
  *   The skeleton loader provides a better user experience during the loading process.
  *   The component uses several Svelte transitions (`slide`, `fade`, `fly`) to enhance the UI.
  *   The `getStatusColor` and `getStatusText` functions are used to dynamically generate the color and text based on topic status, avoiding redundant code.
  *   The component adapts its behavior based on the `tempstate.quiz.focus` value, supporting different quiz types (normal, exit exam, matric).  Notably, the "Practice Topic" button is disabled for matric exams.
  *   The `save` and `edit` functions from `$lib/state.svelte` are available for managing the persistent state (`permstate`).
  *   The application makes use of local storage to persist state between user sessions.

-
  [ ] Display a loading indicator inside the active tabs in the event the study plan takes longer than expected.
  [ ] Add error handling for when the data from permstate.quizResults is malformed or missing expected data.
  [ ] Consider a toast notification when the data fails to load to alert the user to the unexpected error

  [ ] Add a setting to allow users to configure the number of topics displayed per chapter.
  [ ] Implement a feature to track the user's progress through the study plan.
  [ ] Explore alternative UI patterns for displaying the study plan, such as a more visual or interactive representation.
```