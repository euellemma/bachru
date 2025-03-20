```md
## Goal

The Exit Exam Detail Screen displays information about a specific exit exam, including its title, associated courses, and progress, and allows the user to start the exam.

## API Functions and State

- **API Functions:**
  - `getExitExam(examId: string)`: Fetches the exit exam details from the API based on the provided exam ID.

- **State Variables:**
  - `examId: string`:  Retrieved from the route parameters, identifies the current exit exam.
  - `exam: ExitExam | null`: Stores the fetched exit exam object. Initialized to `null`, updated with the fetched data.
  - `progress: Record<string, number>`: Stores the progress of the user for each course within the exam. The keys are course IDs, and the values are the number of questions answered.
  - `loading: boolean`: Indicates whether the exam data is currently being fetched from the API.

- **State Management:**
  - `permstate`: (From `$lib/state.svelte`) Persistent state for storing exit exams and exam progress.
    - `permstate.exitExams: ExitExam[]`: Array of all exit exams fetched.
    - `permstate.exitExamProgress: Record<string, Record<string, (string | undefined)[]> | undefined>`: Stores progress data for each exam. The outer key is the examId, the inner key is the courseId, and the value is an array of answers to the questions for each course.
  - `tempstate`: (From `$lib/state.svelte`) Temporary state.
    - `tempstate.quiz.focus: string`: Set to "exitexam" when the component mounts.
    - `tempstate.quiz.examId: string`: Set to the current exam ID when the component mounts.

## UI Description

The Exit Exam Detail Screen consists of a header section (blue background) and a content section (white background).

**Header Section (Blue Background):**

- **Back Button:**
  - Positioned at the top-left corner.
  - Uses the `ArrowLeft` icon from `lucide-svelte`.
  - When clicked, it navigates the user back to the previous page in history using `history.back()`.
- **Exam Title:**
  - Positioned at the top-right corner.
  - Displays the `examTitle` from the `exam` object.
  - If `loading` is true, displays a `Skeleton` component as a placeholder.
  - Uses `text-3xl`, `mb-2`, `font-bold`, `text-white`, and `text-right` classes for styling.
- **Start Exam Button:**
  - Positioned at the top-right corner, below the exam title.
  - Uses the `Button` component from `$lib/components/ui/button`.
  - Variant is set to `ghost` with `bg-blue-100` for background and `font-bold` for text.
  - Includes a `Play` icon from `lucide-svelte`.
  - When clicked, calls the `startExam()` function, which navigates the user to the `/select-courses` route. If `courseId` is provided as an argument, it is added to `tempstate.quiz.courses`.

**Content Section (White Background):**

- **Course List:**
  - Iterates through the `exam.courses` array (if `exam` is not `null` and `loading` is false).
  - Uses the `{#each}` block to render a course card for each course.
  - Each course card includes:
    - **Course Title:**
      - Displays the `courseTitle` of the course.
      - Uses `text-xl` and `font-bold` classes for styling.
    - **Progress Indicator:**
      - Displays the user's progress for the course in the format "{answered}/{total} Qs".
      - `answered` represents the number of questions answered, retrieved from the `progress` object.
      - `total` represents the total number of questions in the course, retrieved from `course.questionCount`.
      - Uses `text-gray-700`, `font-bold`, `text-sm`, and `text-right` classes for styling.
    - **Progress Bar:**
      - A visual representation of the user's progress in the course.
      - Uses a `div` with `h-3`, `bg-gray-200`, and `rounded-full` classes as the background.
      - A nested `div` with `h-full`, `bg-blue-400`, and `rounded-full` classes represents the progress.
      - The width of the progress `div` is dynamically calculated based on the progress percentage: `((progress[course.courseId] || 0) / course.questionCount) * 100}%`.
    - **Action Buttons:**
      - **Read Button:**
        - Uses the `Button` component with `secondary` variant and `sm` size.
        - Includes a `BookOpen` icon.
        - Navigates to the course details page (`/courses/${course.courseId}`) using `push`.
      - **Exam Topic Button:**
        - Uses the `Button` component with `secondary` variant and `sm` size.
        - Includes a `Play` icon.
        - Calls the `startExam(course.courseId)` function to start the exam with a specific course context.
        - Navigates to the `/select-courses` route.

- **Loading Skeleton:**
  - If `exam` is `null` or `loading` is true, displays a series of skeleton placeholders.
  - Uses the `Skeleton` component from `$lib/components/ui/skeleton`.
  - Renders three skeleton cards, each with placeholders for the title, progress, and action buttons.

## Navigation

- **Incoming:**
  - From any page with a link to an exit exam details page (e.g., `/exit-exam/{examId}`).
  - Receives the `examId` as a route parameter.

- **Outgoing:**
  - **Back Button:** Navigates back to the previous page in the browser history using `history.back()`.
  - **Read Button:** Navigates to the course details page: `/courses/{courseId}`.
  - **Start Exam Button (Header and Course Card):** Navigates to the `/select-courses` route to start the quiz. The courseId is passed as an argument in the course card exam button, to specify a narrower quiz
  - svelte-spa-router's `push` method is used for navigation to `/courses/{courseId}` and `/select-courses`

## Special Notes

- The component uses reactive state (`$state`) to manage the `exam`, `progress`, and `loading` variables.
- The `onMount` lifecycle hook is used to fetch the exam data and calculate the initial progress.
- The `getExamProgress` function calculates the user's progress for each course based on the `exam` and `permstate.exitExamProgress`.  It iterates through the courses in the current exam and the stored progress data to determine the number of unique questions answered for each course.  The progress is calculated by filtering the array of answers for questions that are answered and removing non-valid indices with `-1`, then turning them into a `Set` to remove duplicates.
-  The component attempts to retrieve the exam data from `permstate.exitExams` before making an API call.  This is a caching mechanism.
- The state is persisted to `localStorage` using the `save` function.
- The UI dynamically renders either the exam details or a loading skeleton based on the `loading` state.
- The component uses utility functions (`limitArrays`, `edit`, `getLocal`, `get`) to interact with the state management defined in `$lib/state.svelte`.

[ ] Implement error handling for the `getExitExam` API call.
[ ] Add a more informative loading state, such as a loading message, if initial loading takes too long.
[ ] Add tests for the component to ensure its functionality and UI.
[ ] Consider adding a "Resume Exam" button if the user has already started the exam.
[ ] Implement a more robust caching strategy for the exam data.
[ ] Refactor the `getExamProgress` function for improved readability and performance.
[ ] Consider adding a refresh button to manually refresh the exam data.
```