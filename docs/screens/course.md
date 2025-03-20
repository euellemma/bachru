```md
# Course Detail Screen

- **Goal**: To display the outline of a course, allowing users to navigate to specific topics or start a quiz.

- **API Functions and State**:
  - `getCourse(courseId: string)`: Fetches course data from the API based on the `courseId` parameter.
  - `courseData: Course | ""`: Stores the fetched course data, or an empty object if the data is not yet available.
  - `isLoading: boolean`: Indicates whether the course data is currently being loaded.
  - `permstate` (from `../lib/state.svelte`): Persistent state that holds user-related information, including course data (`allCourses`, `myCourses`) and quiz results (`quizResults`).
  - `tempstate` (from `../lib/state.svelte`): Temporary state that holds quiz-related information such as `quiz.focus` and `quiz.courseId`.

- **UI Description**:

  The screen is structured into two main sections, separated by a background color change: a blue header and a white body.

  1.  **Blue Header**:
    *   *Background*:  `bg-blue-500`
    *   *Layout*: `px-4 py-6 rounded-b-3xl`
    *   *Back Button*:
        *   *Component*: A button containing an `ArrowLeft` icon.
        *   *Functionality*: Navigates the user back to the previous page using `history.back()`.
    *   *Course Title*:
        *   *Display*:  A heading (`h1`) that displays the `courseData.courseTitle`.
        *   *Loading State*:  If `isLoading` is true, a `Skeleton` component is displayed in place of the title.
        *   *Styling*: `text-3xl mb-2 font-bold text-white text-right`
    *   *Start Quiz Button*:
        *   *Component*:  A `Button` component.
        *   *Functionality*:
            *   Sets `tempstate.quiz.focus` to "normal".
            *   Sets `tempstate.quiz.courseId` to the current `params.courseId`.
            *   If a `topicFilename` is provided it is set as the sole item in `tempstate.quiz.topics` array.
            *   Navigates the user to the `/select-topics` route (quiz setup screen) using `push()`.
        *   *Styling*: `variant="ghost" class="bg-blue-100 font-bold"`
        *   *Icon*:  A `Play` icon is displayed within the button.

  2.  **White Body**:
    *   *Background*:  `bg-white rounded-t-3xl py-4 px-4`
    *   *Course Outline*:
        *   *Loading State*: If `isLoading` is true, a series of `Skeleton` components are displayed as placeholders for the course outline.
        *   *Chapter List*:
            *   *Rendering*:  The `courseData.outline` array is iterated over using `{#each}` to generate a list of chapters.
            *   *Chapter Header*:
                *   *Component*: A button with styling `w-full bg-blue-50 mb-2 rounded-xl px-4 py-4 flex justify-between items-center`.
                *   *Functionality*:  Calls the `toggleChapter()` function to toggle the `isExpanded` property of the chapter.
                *   *Chapter Title*:  Displays the `chapter.title` within an `h2` element with styling `text-xl text-left`.
                *   *Expand/Collapse Icon*: A `ChevronDown` icon rotates based on the `chapter.isExpanded` state (180 degrees when expanded). The rotation is animated using CSS transitions.
            *   *Chapter Content (Topics)*:
                *   *Conditional Rendering*:  Displayed only when `chapter.isExpanded` is true.  Uses the `slide` transition for animation.
                *   *Topic List*:
                    *   *Rendering*:  The `chapter.topics` array is iterated over using `{#each}` to generate a list of topics.
                    *   *Divider*: If `topic.divider` is true, a heading with styling `font-bold text-xl text-black` is displayed.
                    *   *Topic Item*:
                        *   *Layout*: `p-3 rounded-lg border space-y-3`
                        *   *Status Indicator*:
                            *   *Conditional Rendering*: Displays a status indicator if `topic.status` is present (i.e., "strong" or "weak").
                            *   *Styling*: The color of the indicator and text is determined by the `getStatusColor()` and `getStatusText()` functions, respectively.
                        *   *Topic Title*:  Displays the `topic.title` with styling `font-bold text-lg text-gray-900`.
                        *   *Buttons*:
                            *   *"Read"* Button:
                                *   *Component*:  A `Button` component with styling `size="sm" variant="secondary" class="flex items-center justify-center"`.
                                *   *Functionality*:  Calls the `readTopic()` function with the `topic.filename`, which navigates the user to the topic reading screen using `push()`.
                                *   *Icon*: A `BookOpen` icon is displayed within the button.
                            *   *"Quiz Topic"* Button:
                                *   *Component*:  A `Button` component with styling `size="sm" variant="secondary" class="flex items-center justify-center"`.
                                *   *Functionality*:
                                    *   Sets `tempstate.quiz.focus` to "normal".
                                    *   Sets `tempstate.quiz.courseId` to the current `params.courseId`.
                                    *   Sets `tempstate.quiz.topics` to an array containing only the current `topic.filename`.
                                    *   Navigates the user to the `/select-topics` route (quiz setup screen) using `push()`.
                                *   *Icon*: A `Play` icon is displayed within the button.

- **Navigation**:
  *   **Back Navigation**: Clicking the back arrow navigates the user to the previous page in the browser history using `history.back()`.
  *   **Topic Navigation**: Clicking the "Read" button navigates the user to the topic reading screen at `/topic/${params.courseId}/${topic.filename}`.
  *   **Quiz Navigation**: Clicking either "Start Quiz" or "Quiz Topic" navigates the user to the quiz setup screen at `/select-topics`.  Context is passed via `tempstate` to specify the course or topic for the quiz.

- **Special Notes**:
  *   The `onMount` lifecycle hook is used to fetch the course data when the component is mounted.
  *   Course data is first checked in `permstate` before fetching from API.
  *   The `updateTopicStatus()` function is responsible for updating the status of each topic based on the user's quiz results stored in `permstate.quizResults`.  It iterates through the quiz results and maps weak/strong topics to their corresponding filenames.  The status is then applied to the `courseData.outline` object. The last result in the quizResult array has the most precedence.
  *   The `permstate.quizResults` array is iterated in reverse order in the `updateTopicStatus` function to prioritize the most recent quiz results.
  *   The component uses reactive statements (`$state`) to manage state variables.
  *   The `slide` transition is used for animating the expansion and collapse of chapters.
  *   The `$inspect` statement is used for debugging and inspecting the `courseData` object.
  *   Topic `status` defaults to `''` if not specified

- **TODO**:
 [ ] Implement proper error handling for API calls (e.g., display an error message if `getCourse` fails).
 [ ] Add accessibility attributes (e.g., `aria-label`, `aria-expanded`) to improve accessibility for screen reader users.
 [ ] Implement a more robust loading state, potentially with a progress indicator.
 [ ] Consider adding pagination or infinite scrolling for courses with very large outlines.
 [ ] Review the `updateTopicStatus` function to optimize performance for large quiz result sets.
 [ ] Ensure topic status updates when a quiz is completed by updating localstorage and state.
 [ ] Implement a better system for updating topics beyond just the status.
 [ ] Create better logic for `updateTopicStatus` so we do not need to reverse the order of `permstate.quizResults`.
 [ ] Display `status` even if the topic is only on strong topics list.
 [ ] Consider fetching course data on the server-side using `load` function for improved SEO and initial load performance.
 [ ] Implement a way to refresh course data if it changes on the server.
 [ ] Add a "Last Updated" timestamp to the course data and display it on the screen.
 [ ] Add a confirmation dialog before navigating back if the user has unsaved changes.
 [ ] Implement a search functionality to allow users to quickly find specific topics within the course outline.
```