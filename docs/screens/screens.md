# App Screens Reference Documentation



## course

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

---



## exitexam

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

---



## home

```reference.md
### Goal
The app screen serves as a central hub for users to discover, manage, and access courses. It provides a search interface, displays added courses, and allows navigation to settings and past exams.

### API Functions and State

*   **API Functions:**
    *   `searchCourses(query: string)`:  Fetches courses based on a search query.
*   **State Variables:**
    *   `searching: boolean`: Indicates whether a search is currently active (true if the search query is not empty).
    *   `searchMode: boolean`:  Controls the visibility of the search interface.
    *   `confirmDeleteDialog: boolean`: Controls the visibility of the confirmation dialog for removing a course.
    *   `courseToDelete: string | null`: Stores the `courseId` of the course to be deleted.
    *   `searchQuery: string`: Stores the current search query entered by the user.
    *   `searchResults: Course[]`: Stores the results of the course search.
    *   `searchTimeout: ReturnType<typeof setTimeout> | null`: Stores the timeout ID for debouncing the search input.
    *   `isLoading: boolean`: Indicates whether the search results are currently loading.
    *   `addedCourses: Record<string, boolean>`: Stores a map of `courseId` to boolean, indicating if a course has been added. Used for real-time state of the `Add` button.
    * `permstate`:  Global state object (defined in `../lib/state.svelte`) containing user information, added courses, recommended courses, settings, and other app-wide data. It is used to store user-specific course data and settings.

### UI Description

The screen is divided into the following main sections:

1.  **Search Bar and Settings:**
    *   A `div` with `flex` layout containing the search bar and settings button.
    *   Conditionally renders a close icon (`X`) that clears the search query and closes the search interface (sets `searchMode` to false) when clicked. Only visible in `searchMode`.
    *   `input` element: This is the primary search input field.
        *   `type="text"`: Specifies a single-line text input.
        *   `value={searchQuery}`: Binds the input field's value to the `searchQuery` state variable, ensuring two-way data binding.
        *   `onfocus={() => (searchMode = true)}`:  When the input gains focus, it sets the `searchMode` state variable to `true`, triggering the display of the search results area.
        *   `onkeyup={(e) => handleSearch(e.currentTarget.value)}`: This event handler is triggered whenever the user releases a key while typing in the search input. It calls the `handleSearch` function, passing the current value of the input field as the search query.  `e.currentTarget.value` safely accesses the input value.
        *   `placeholder="Search courses..."`:  Provides a hint to the user about the expected input.
        *   Styling classes provide visual appearance and layout.
    *   A `Settings` icon (`lucide-svelte`) that, when clicked, navigates the user to the "/settings" route using `push` from `svelte-spa-router`.

2.  **Search Results / Initial Search Screen:**

    This section is conditionally rendered based on the state of `searchMode` and `searching`.

    *   **If `searchMode` is true and `searching` is true:** Displays the search results or a loading state.

        *   **Loading State:** If `isLoading` is true, displays three `Card` components with `Skeleton` components to indicate loading.  Each skeleton card contains:
            *   A skeleton circle for a potential image/emoji.
            *   A skeleton rectangle for the course title.
            *   Two skeleton rectangles for potential buttons.
        *   **Search Results:** If `isLoading` is false and `searchResults.length > 0`, iterates through the `searchResults` array and displays each course in a `Card` component.

            *   Each course `Card` contains:
                *   A clickable area (using a `<button>` element for semantic correctness) with the class `hover:underline flex items-center gap-2` that, when clicked, calls the `openCourse(course.courseId)` function to navigate to the specific course.
                *   The button contains the course emoji (`course.emoji`) and `course.courseTitle`.
                *   Conditional rendering for "Add" or "Added" buttons:
                    *   If `addedCourses[course.courseId]` is true OR the current course is present within `permstate.myCourses` the **"Added"** `<Button>` is rendered, with a `CheckCircle` icon. The button is styled with green background and text to visually confirm that the course has been added.
                    *   Otherwise the **"Add"** `<Button>` is rendered, along with a `Plus` icon. Clicking the button calls `addCourse(course)` which adds the given course to the user's list of courses.
                *   An "Open" `<Button>` that calls `openCourse(course.courseId)` function to navigate to the specific course.

        *   **No Results:** If `isLoading` is false and `searchResults.length` is 0, displays a "No courses found" message.

    *   **If `searchMode` is true and `searching` is false:**  Displays an initial search screen.

        *   Displays a `Search` icon, a title "Start typing to search for courses", and a subtitle "Enter a course name, subject, or keyword".

3.  **User's Courses / Matric Exams Card:**

    This section is conditionally rendered when `searchMode` is false (when the user is not actively searching).

    *   **Matric Exams Card:** Displays a `Card` component with information about available matric exams.
        *   Clicking the card navigates the user to the "/past-exams" route using `push`.
        *   Displays the exam type based on `permstate.userInfo.examFocus` ("Matric Exams" or "Exit Exams").
        *   Displays a description indicating available years.
    *   **Iterates through `permstate.myCourses`:** For each course in the user's list, it renders a `Card` component.

        *   Each course `Card` contains:
            *   A clickable area (a `<button>` element) with the class `hover:underline flex items-center gap-2` that calls the `openCourse(course.courseId)` function to navigate to the specific course when clicked.
            *   The button contains the course emoji and `course.courseTitle`.
            *   A conditional menu (using `EllipsisVertical` icon and `clickOutside` action) that allows the user to "Open" or "Remove" the course. The menu is only rendered if `course.isHighschool == false || course.grade != permstate.userInfo.grade`.

4.  **Confirmation Dialog:**

    *   A `Dialog` component (from `../lib/components/ui/dialog`) that is displayed when `confirmDeleteDialog` is true.
    *   The dialog prompts the user to confirm the removal of a course.
    *   It includes "Cancel" and "Remove" buttons.  Clicking "Cancel" calls `cancelRemoveCourse`, and clicking "Remove" calls `confirmRemoveCourse`.

**Important UI Components:**

*   **Card:** A reusable UI component (from `../lib/components/ui/card`) used to display course information and exams.
*   **Button:** A reusable UI component (from `../lib/components/ui/button`) used for actions like adding, opening, and removing courses.  Uses `variant="ghost"` and styles customized with classes.
*   **Icons:** `lucide-svelte` icons are used for visual cues like navigation, settings, search, and actions.
*   **Skeleton:** A reusable UI component (from `../lib/components/ui/skeleton`) used to show a loading state.
*   **Dialog:** A reusable UI component (from `../lib/components/ui/dialog`) used to display confirmation messages.

### Navigation

*   `/settings`: Navigates to the settings screen (triggered by clicking the Settings icon).
*   `/course/${courseId}`: Navigates to the details page for a specific course (triggered by clicking on a course item).
*   `/past-exams`: Navigates to the past exams screen (triggered by clicking the Matric Exams card).

### Special Notes

*   **State Management:** The component uses `$state` to manage local state and `permstate` (from `../lib/state.svelte`) for persistent, global state.  `save(permstate)` is called after modifications to the `permstate` to persist them to local storage.
*   **Debouncing:** The `handleSearch` function uses a `setTimeout` to debounce the search input, preventing excessive API calls.
*   **Click Outside Action:** The `clickOutside` action is used to close the course menu when the user clicks outside of it.
*   **Added Course Visual Cue:** The `addedCourses` state, along with checking if a course exists in `permstate.myCourses`, is used to immediately update the "Add" button to an "Added" state without waiting for the API to respond.

### TODO

- [ ] Handle potential errors from the `searchCourses` API call gracefully. Display an error message to the user.
- [ ] Implement the actual removal logic in `confirmRemoveCourse` (likely involving updating `permstate.myCourses` and calling `save`).
- [ ] Implement server-side handling of adding courses to the user's account if needed and sync with local storage.

- [ ] Add pagination to the search results if the number of results is large.
- [ ] Consider adding a loading indicator within the search input itself.
- [ ] Implement a more sophisticated search algorithm (e.g., fuzzy search).
- [ ] Add tooltips to the icons for accessibility.
- [ ] Make the UI responsive for different screen sizes.
- [ ] Implement a "Recently Viewed" courses section.
- [ ] Allow users to reorder their courses in the "My Courses" section.


---



## intro-four

```markdown
## Goal

The screen aims to introduce users to the GebiApp platform, showcasing its learning and quiz functionalities, and then navigates them to the course selection page based on their profile information.

## API Functions and State

*   **API Functions:**
    *   `getCourseForEduFocus(eduFocus: EduFocus, deptOrGrade: string)`: Fetches course data based on the user's educational focus and department/grade.
*   **State Variables:**
    *   `loading: boolean`: Controls the visibility of the loading indicator during the course fetching process.
    *   `permstate: PermState`: Stores persistent user information, including `userInfo` (containing `eduFocus`, `grade`, `dept`), and `myCourses`. See STATE MANAGEMENT for definition.

## UI Description

The screen's UI is designed to be visually appealing and informative, guiding the user towards initiating a quiz based on customized course selections. The whole screen is wrapped in a relative-positioned div with a minimum height equal to the screen, a flexbox for content layout, and an `overflow-hidden` property. This allows for the blurred background to work without clipping content.

1.  **Background:**

    *   A gradient background is applied using CSS (`bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618]`).
    *   A blur effect is added using `backdrop-filter: blur(100px)`. The opacity is set to 80%.
    *   The background is positioned absolutely behind the main content (`z-0`).

2.  **Container:**

    *   A container div with `z-10` ensures the content is above the background.
    *   It uses `flex-grow` to take up available vertical space.
    *   The layout is a vertical flexbox (`flex flex-col`) with content distributed `justify-between`.
    *   Padding of `py-8` and `p-4` is applied for spacing.

3.  **Title:**

    *   A centered title "How GebiApp works" is displayed using `text-3xl`, `text-white`, `font-bold`, and `text-center` classes.

4.  **Feature Showcase:**

    *   Two `Undo` icons are displayed on the screen rotated slightly to draw visual attention to the cards below.
    *   A grid layout (`grid grid-cols-2 md:grid-cols-2 gap-3`) is used to display two cards side-by-side on larger screens, and stacked on smaller screens.
    *   Each card is wrapped in a `div` element with a blur transition.
    *   **First Card ("Learn about Linear Equations"):**
        *   A `Card` component is used with shadow, background, text color, and border styles.  The backgroun is black with 20% opacity and the border is gray.
        *   The `CardHeader` contains a `PanelRight` icon, a "Learn about" text, and a "Linear Equations" sub-text.  The text-lg font-bold styles the heading, and text-sm opacity-80 styles the subtext.
        *   The `CardContent` contains a list of learning resources using a loop.
        *   Each resource (`BookOpen`, `Video`, `Brain`, `Lightbulb`) is displayed with an icon and text within a clickable `div`.
        *   Each clickable div has the hover style of black with 30% opacity
    *   **Second Card ("Quiz on Linear Equations"):**
        *   Similar structure to the first card, but with different content.
        *   The `CardHeader` contains a `Dices` icon, a "Quiz on" text, and a "Linear Equations" sub-text.
        *   The `CardContent` contains a list of quiz features (`HelpCircle`, `Info`, `List`, `BookMarked`) using a loop.
        *   Each quiz feature is displayed with an icon and text within a clickable `div`.
        *   Each clickable div has the hover style of black with 30% opacity

5.  **Continue Button:**

    *   A `Button` component is used with `text-lg`, `bg-blue-500`, and `font-bold` classes.
    *   The button text changes to "Loading Courses" with a loading indicator (`Loader`) when `loading` is true.
    *   Otherwise, it displays "Start Quiz" with an `ArrowRight` icon.
    *   The button's `onclick` event is bound to the `handleContinue` function.
    *   The button is disabled when `loading` is true.

## Navigation

*   **Outgoing:**
    *   Navigates to the `/search-courses` route using `push("/search-courses")` after successfully fetching courses.  It passes no explicit parameters, but the destination page will read the `permstate.myCourses` value set on this page.

## Special Notes

*   The `handleContinue` function fetches courses based on `permstate.userInfo.eduFocus` and either `permstate.userInfo.grade` (for "highschool") or `permstate.userInfo.dept` (for other educational focuses).
*   Error handling is implemented within the `handleContinue` function to catch and log errors during course fetching.
*   The component uses Svelte's `$state` and `save` functions for state management and persistence.
*   The blurred background effect relies on the `backdrop-filter` CSS property, which may not be supported by all browsers.
*   Animations are used on the `Undo` icons.

## TODO

[ ] Implement click actions for each item in the cards.
[ ] Add more descriptive text in the cards for the features that will be present in the app.
[ ] Handle cases where `permstate.userInfo` or its nested properties are undefined.

[ ] Add more robust error handling, potentially displaying an error message to the user.
[ ] Consider pre-loading some data in the background to improve perceived performance.
[ ] Implement a more sophisticated animation for the loading indicator.
[ ] Make the background gradient dynamic or customizable.
[ ] Add keyboard navigation support.
```

---



## intro-one

```md
## Goal

The "Educational Focus Selection" screen allows users to select their primary educational focus (High School, Undergraduate, or Exit Exam) to tailor the app's content and functionality to their needs.

## API Functions and State

- **API Functions**: None. All state management is handled client-side.
- **State Variables**:
    - `selectedFocus` (local state): String representing the currently selected educational focus. This is a Svelte `$state` variable, meaning changes to it will trigger component re-renders.
    - `permstate` (global state): Object conforming to the `PermState` interface, managed by `$lib/state.svelte`.  Specifically, `permstate.userInfo` is updated.
    - `permstate.userInfo`: Contains user information including `eduFocus` (string) and `examFocus` (string).  These are set based on the user's selection.

## UI Description

The screen presents the user with a selection of educational focuses, each represented by a card with an icon and label.

-   **Overall Layout**:
    -   The screen uses a `div` with `min-h-screen` to ensure it always takes up at least the full screen height.
    -   The content is centered both horizontally and vertically using `flex justify-center items-center flex-col`.
    -   An overlaid blurred background is present behind all the elements.
-   **Background**:
    -   A `div` with `position: absolute` and `inset-0` creates a full-screen background.
    -   A gradient (`bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618]`) is applied to the background for visual appeal.
    -   `opacity-80` makes the background slightly transparent.
    -   `backdrop-filter: blur(100px)` applies a blur effect, enhancing the depth.
-   **Main Content Area**:
    -   A `div` with `z-10` (to ensure it's above the background) contains the main content.
    -   `text-center` aligns the content horizontally.
    -   `p-6` adds padding around the content.
    -   `w-full max-w-3xl mx-auto` limits the width of the content and centers it horizontally.
    -   `in:blur={{ duration: 300 }}` applies a blur-in transition when the component is mounted.
-   **Heading and Description**:
    -   `h1`: "Welcome to GebiApp" with `text-4xl`, `font-bold`, `text-white`, and `mb-16` (margin-bottom).
    -   `p`: "Select your educational focus:" with `text-xl`, `text-white`, and `mb-12`.
-   **Focus Options (Cards)**:
    -   A `div` with `flex flex-col gap-2` arranges the focus options in a column with a gap between them.
    -   `{#each focusOptions as option (option)}`: Iterates over the `focusOptions` array. The `(option)` is a key expression for Svelte's keyed each block, improving performance when the array changes.
    -   **`Card.Root` (Custom Card Component)**:
        -   `bg-black bg-opacity-30`: Sets a semi-transparent black background.
        -   `border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer`: Adds a border, transition for hover effects, and cursor style to indicate it's clickable.
        -   `{selectedFocus === option.id ? 'border-blue-500' : 'border-gray-600'}`: Conditionally applies a blue border if the card is selected, otherwise a gray border.
        -   `onclick={() => eduFocusClick(option.id)}`: Calls the `eduFocusClick` function when the card is clicked, passing the `option.id` as the selected focus.
    -   **`Card.Content` (Card Content Component)**:
        -   `py-4 px-4 flex flex-row items-center`: Adds padding and aligns the icon and label horizontally.
        -   `<option.icon class="w-5 h-5 text-white mr-3" />`: Renders the icon associated with the focus option, with styling for size, color, and margin.  The icon component is dynamically rendered from the `focusOptions` array.
        -   `<h2 class="text-lg font-bold text-white">{option.label}</h2>`: Displays the label of the focus option with styling for font size, weight, and color.
-   **`focusOptions` array**:
    - `id`: internal id for tracking
    - `label`: User facing text for display
    - `icon`: Lucide SVG icon component to display

## Navigation

-   **Outgoing**:
    -   Clicking on a focus option card triggers the `eduFocusClick` function.
    -   `eduFocusClick` updates the `permstate.userInfo` with the selected `eduFocus` and `examFocus`.
    -   `save(permstate)` saves the updated `permstate` to local storage.
    -   `push("/intro-two")` navigates to the "/intro-two" route (presumably the next screen in the onboarding flow).  The user's educational focus is passed implicitly via the updated `permstate` in local storage.

## Special Notes

-   The component uses Svelte's reactive statements (`$state`) for state management, making it efficient in updating the UI in response to state changes.
-   The `save` function persists the `permstate` to local storage.  This means the user's selected focus will be remembered even if they close and reopen the app.
-   The blurred background is implemented using CSS backdrop-filter, which requires browser support (most modern browsers support it).
- The examFocus field is defaulted to "matric" unless the eduFocus chosen is "exitexam".
- The `limitArrays` function in `save` is used to prevent local storage from becoming too large by limiting the size of certain arrays within the `permstate`.
- The keyed each block `{#each focusOptions as option (option)}` is crucial for performance, especially if the `focusOptions` array were to change dynamically.  Without it, Svelte would have to re-render all the card components on any change, which could be inefficient.

## TODO

- [ ] Add error handling to the `save` function in case local storage is full or unavailable.
- [ ] Provide visual feedback (e.g., a loading indicator) while the state is being saved to local storage.
- [ ] Consider adding accessibility attributes (e.g., `aria-label`, `role`) to the cards for screen reader users.
- [ ] Implement a mechanism to handle cases where the user's selected focus needs to be updated or reset.

- [ ] Implement analytics tracking to monitor which focus options are most frequently selected.
- [ ] Allow users to change their educational focus later in the app (e.g., in a settings screen).
- [ ] Create a custom card component instead of relying on a general-purpose one to simplify the code.
- [ ] Explore alternative background effects or animations to enhance the visual appeal.


---



## intro-three

```reference.md
# Intro Screen Three

- **Goal**: Collect user's gender and school/university information to personalize their experience and improve search functionality.

- **API Functions and State**:

  *   **API Functions**: None.
  *   **State**:
      *   `school`: Local Svelte state variable (string) bound to the school/university input field. Stores the school name entered by the user.
      *   `selectedGender`: Local Svelte state variable (string) bound to the selected gender radio button. Stores the selected gender ("male" or "female").
      *   `permstate`: Global Svelte state variable (PermState interface). It's a reactive object holding persistent application state.
          *   `permstate.userInfo`: Nested object within `permstate` that stores user information.
              *   `permstate.userInfo.gender`: String representing the user's gender. Updated when the user selects a gender and clicks a radio button.
              *   `permstate.userInfo.school`: String representing the user's school/university. Updated when the user enters a school name and clicks the input.
              *    `permstate.userInfo.eduFocus`: String representing the user's Education focus, whether highschool or undergrad. This is set in a previous screen, and dictates the label of the input.
      *  `save(permstate)`: Function from `"$lib/state.svelte"` used to persist the `permstate` to local storage.

- **UI Description**:

  The screen consists of the following UI components, rendered within a full-screen `div` with a blurred background gradient:

    1.  **Background**:

        *   A `div` with absolute positioning, covering the entire screen.
        *   A nested `div` with a gradient background (`bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618]`) and opacity of 80%.
        *   The `backdrop-filter: blur(100px)` style is applied to the nested `div` to create the blur effect.

    2.  **Main Content Area**:

        *   A `div` with `z-10`, `text-center`, `p-6`, and `w-full` classes, ensuring it's above the background and occupies the full width.
        *   The `in:blur={{ duration: 200 }}` transition is applied, causing the content to fade in with a blur effect upon entering the screen.

    3.  **Title**:

        *   An `h1` element with the text "Tell Us About Yourself".
        *   Styling: `text-4xl`, `font-bold`, `text-white`, `mb-16`.

    4.  **Input Form**:

        *   A `div` with `w-full`, `flex`, `flex-col`, `items-center`, and `gap-6` classes, arranging the input fields vertically and centering them.
            *   A div which houses the gender radio inputs
                *   A `div` containing the "Gender:" label and a `Venus` icon. Styling includes `flex flex-grow items-center gap-2 mt-2 mr-4 mb-2 text-white text-left`. The Venus icon adds visual appeal.
                *   A `RadioGroup.Root` component (from `$lib/components/ui/radio-group/index.js`) manages the radio button group.
                    *   `bind:value={selectedGender}` binds the selected radio button's value to the `selectedGender` state variable.
                    *   `onchange={() => setGender()}` calls the `setGender` function whenever the selected radio button changes.
                    *   Two `button` elements representing the "Male" and "Female" options.
                        *   Each `button` includes a `RadioGroup.Item` (with `value="male"` or `value="female"`) and a `Label` (with `for="male"` or `for="female"`) for accessibility.
                        *   Clicking a button updates `selectedGender` and calls `setGender`.
                        *   The button's styling changes dynamically based on whether it is selected (using a ternary operator to apply different background and border classes).  When selected, `bg-black bg-opacity-70` is applied; otherwise, `bg-black bg-opacity-20 border-black border-2` is applied.
            *   A div which houses the School Name Input
                *   A `div` containing the school/university label and a `School` icon. The label text changes dynamically between "School Name" and "University/College" based on the `userInfo.eduFocus` value ("highschool" or other value).
                *   An `Input` component (from `$lib/components/ui/input`) for entering the school/university name.
                    *   `type="text"` specifies a text input field.
                    *   `placeholder` dynamically sets the placeholder text based on `userInfo.eduFocus`.
                    *   `bind:value={school}` binds the input value to the `school` state variable.
                    *    `onchange={() => setSchool()}` calls the `setSchool` function whenever the input changes.
                    *   Styling includes `w-full md:w-[280px] bg-black bg-opacity-20 text-black border-gray-700 placeholder:text-gray-400` for appearance.
                    *   A descriptive text (`This is important for past exams search`) below the input.

    5.  **Continue Button**:

        *   A `Button` component (from `$lib/components/ui/button`).
        *   `class="mt-16 text-lg bg-blue-500 font-bold"` provides styling.
        *   `variant="default"` and `size="lg"` set the button's appearance.
        *   `onclick={handleContinue}` calls the `handleContinue` function when the button is clicked.
        *   `disabled={!selectedGender || !school}` disables the button unless both `selectedGender` and `school` have values.
        *   An `ArrowRight` icon is included within the button.

    **Functionality Breakdown**

    *   **Gender Selection:** The user selects their gender by clicking either the "Male" or "Female" radio button. This updates the `selectedGender` state and triggers the `setGender` function.
    *   **School/University Input:** The user enters their school or university name in the input field. This updates the `school` state and triggers the `setSchool` function. The placeholder text adapts based on the value of `userInfo.eduFocus`.
    *   **Data Persistence:**
        *   `setGender` and `setSchool` functions update the `permstate.userInfo.gender` and `permstate.userInfo.school` values respectively.
        *   The `save(permstate)` function is called after each update to persist the changes to local storage.
    *   **Continue Navigation:** The "Continue" button navigates the user to the "/intro-four" route when clicked, *only if* both gender and school are selected.
    *   **Conditional UI**: The placeholder text and label for the school input change between "School Name" and "University/College" based on the `userInfo.eduFocus` value. This demonstrates conditional rendering based on the user's educational focus.  The button is also dynamically disabled using the `disabled` attribute.

- **Navigation**:

  *   **Outgoing**: Navigates to the `/intro-four` route when the "Continue" button is clicked. No context is passed directly in the `push` call, but the updated `permstate.userInfo` (containing gender and school) will be available on the next screen due to local storage persistence.

- **Special Notes**:

  *   The screen uses local storage to persist the user's information. The `permstate` variable is loaded from local storage on component initialization and saved to local storage whenever the gender or school information is updated.
  *   The school name input uses the `userInfo.eduFocus` value (presumably set on a previous screen) to dynamically change the placeholder text.
  *   The `in:blur` transition provides a smooth entry animation.

- **TODO**:
 [ ] Add validation to the school input to ensure the user enters a valid school name.
 [ ] Consider adding a "Prefer not to say" option for gender.
 [ ] Implement error handling for local storage operations.
 [ ] Debounce the `setSchool` and `setGender` functions to avoid excessive local storage updates.
 [ ] Implement more robust input validation and sanitization.
 [ ] Explore alternative UI patterns for gender selection (e.g., a dropdown menu).
 [ ] Add accessibility enhancements, such as ARIA attributes and keyboard navigation.
 [ ] Implement analytics tracking to monitor user behavior and identify areas for improvement.
```

---



## intro-two

```markdown
## Goal

This screen prompts the user to provide information about their field of study and year of study (or grade level if in high school) to personalize their learning experience.

## API Functions and State

*   **API Functions**: None. This screen does not directly call any APIs.
*   **State Variables**:
    *   `eduFocus`: (string) Stores the user's education focus ("highschool", "undergrad", etc.) fetched from `permstate.userInfo.eduFocus` on mount.  This dictates whether the high school or undergraduate UI is displayed.
    *   `selectedField`: (string, state) Stores the selected field of study from the Combobox component.
    *   `selectedYear`: (string, state) Stores the selected year of study from the Select component (e.g., "freshman", "sophomore"). Defaults to "freshman".
    *   `isHighSchool`: (boolean, state)  Derived from `eduFocus` on mount; determines if the user is in high school.
    *   `triggerContent`: (string, derived state)  Determines the text displayed within the Select component's trigger button.  If `isHighSchool` is true, it displays "Select your grade"; otherwise, it displays the label of the `selectedYear` or "Select your year" if no year is selected.
    *   `permstate`: (PermState, global state) - Global state object containing user information, courses, and other application data.  Specifically, `permstate.userInfo` is accessed and modified.

## UI Description

The screen features a conditional UI based on the `isHighSchool` state variable:

**Common Elements:**

*   **Background:** A full-screen background with a gradient and blur effect is achieved using absolute positioning and CSS `backdrop-filter`.
*   **Container:** A centered `div` containing the main content with `flex` for vertical centering.
*   **Title:** A large, white, bold title that dynamically changes based on the `isHighSchool` value: "Tell us about class" (if high school) or "Tell us about your field" (otherwise).

**High School UI (`isHighSchool` is true):**

*   **Grade Selection:**
    *   A heading indicating that the user should select their grade level.
    *   A series of `Card.Root` components, each representing a grade option.  The `grades` array (imported from `../config`) provides the data for these cards.
    *   Each `Card.Root` has the following styles: `bg-black bg-opacity-30 border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer border-gray-600`
    *   Each `Card.Root` contains a `Card.Content` to hold a grade `label` element.
    *   Clicking a `Card.Root` triggers the `selectGrade` function, passing the grade's value.

**Undergraduate UI (`isHighSchool` is false):**

*   **Field of Study Selection:**
    *   A heading indicating that the user should select their department or field.
    *   A `Combobox` component (from `$lib/mycomps/Combobox.svelte`) is used for selecting the field of study.
        *   `items`: Populated with the `fields` array (imported from `../config`).
        *   `bind:value`: Binds the selected value to the `selectedField` state variable.
        *   `placeholder`: "Select your field of study".
        *   `buttonClass`: "text-white font-bold py-6 w-full md:w-[280px] justify-between bg-opacity-95"
        *   `contentClass`: "w-full md:w-[280px] p-0"
        *   `searchPlaceholder`: "Search fields..."
        *   `emptyMessage`: "No field found"

*   **Year of Study Selection:**
    *   A heading indicating that the user should select their year of study.
    *   A `Select.Root` component (from `$lib/components/ui/select/index.js`) is used for selecting the year of study.
        *   `type`: "single" indicating single select
        *   `name`: "yearOfStudy".
        *   `bind:value`: Binds the selected value to the `selectedYear` state variable.
        *   `Select.Trigger`:  Displays the current selection or a placeholder. The `triggerContent` derived state variable determines its content.
        *   `Select.Content`: Contains a `Select.Group` with `Select.Item` components for each year in the `years` array (imported from `../config`).  Each `Select.Item` displays the year's label.

*   **Continue Button:**
    *   A `Button` component (from `$lib/components/ui/button`).
        *   `class`: "mt-4 text-lg bg-blue-500 font-bold"
        *   `variant`: "default".
        *   `size`: "lg".
        *   `disabled`: Disabled if `selectedField` is empty (meaning no field of study has been selected).
        *   `onclick`: Triggers the `handleContinue` function when clicked.
        *   Includes an `ArrowRight` icon (from `lucide-svelte`).

## Navigation

*   **High School (Grade Selection):**
    *   Clicking a grade `Card.Root` navigates to `/intro-three` using `push("/intro-three")`. The selected grade is saved to `permstate.userInfo.grade`.
*   **Undergraduate (Field and Year Selection):**
    *   Clicking the "Continue" button navigates to `/intro-three` using `push("/intro-three")`. The selected field (`selectedField`) and year of study (`selectedYear`) are saved to `permstate.userInfo.dept` and `permstate.userInfo.yearOfStudy`, respectively.

## Special Notes

*   The `onMount` lifecycle hook is used to fetch the `eduFocus` value from `permstate` and initialize the `isHighSchool` state variable. This allows the screen to remember the user's previous selection.
*   The `save(permstate)` function is used to persist the selected information to local storage.
*   The `years`, `fields`, and `grades` arrays are assumed to be defined in the `../config` file.
*   The background gradient and blur are implemented using CSS classes and inline styles.
*   The component uses Svelte's state management (`$state` and derived states) and reactive statements (`$derived`).
*   The disabling of the "Continue" button ensures that the user selects a field of study before proceeding.

## TODO

[ ] Add validation or error handling for the Combobox component in case the user enters an invalid field.
[ ] Implement a loading state or visual feedback while fetching `eduFocus` from `permstate` on mount.
[ ]  Consider adding a "Back" button to allow the user to change their education focus if they made a mistake on the previous screen.
[ ] Ensure accessibility of the UI components (e.g., proper ARIA attributes for the Combobox and Select components).
[ ] Refactor the background styling into a reusable component or CSS class.
[ ] Create better error handling for unexpected issues with `permstate` and/or local storage calls.
[ ] Add unit tests to cover the component's functionality and state management.
```

---



## main-screen

```markdown
## Goal
The main screen provides a bottom navigation bar allowing users to switch between three main sections: Home, News, and Settings.

## API Functions and State

*   **State**:
    *   `activeScreen`: A string state variable that determines which screen is currently displayed (`"home"`, `"course"`, or `"settings"`).

## UI Description

The UI consists of a container div with a background color and a main content area that displays different screens based on the `activeScreen` state. Below is a detailed breakdown:

1.  **Outer Container (`div.mx-auto bg-background`)**:
    *   This is the outermost container, responsible for centering the content horizontally (`mx-auto`) and setting the overall background color (`bg-background`). The `bg-background` class should be defined elsewhere in the CSS to provide a color, and it's not part of the Svelte code itself.
2.  **Screen Container (`div.screen-container relative min-h-screen`)**:
    *   This container holds the currently active screen.
    *   `relative`:  Positions the container relatively, allowing absolute positioning of children (though none are used in this snippet).
    *   `min-h-screen`: Sets the minimum height to the full viewport height, ensuring the content stretches to fill the screen vertically.
3.  **Conditional Screen Rendering (`{#if activeScreen === ...}`)**:
    *   This section uses Svelte's conditional rendering to display different screens based on the value of `activeScreen`.
    *   `in:blur`: A Svelte transition that applies a blur effect when a screen is shown.
        *   `duration: 500`: The blur transition lasts for 500 milliseconds.
        *   `easing: quintOut`: Specifies the easing function for the transition, providing a smooth, decelerating effect.  `quintOut` is imported from `svelte/easing`.
    *   `<HomeScreen />`:  Renders the `HomeScreen` component when `activeScreen` is `"home"`.  (Defined in `Home.svelte`).
    *   `<News />`: Renders the `News` component when `activeScreen` is `"course"`. (Defined in `News.svelte`).
    *   `<SettingsScreen />`: Renders the `SettingsScreen` component when `activeScreen` is `"settings"`. (Defined in `SettingsScreen.svelte`).
4.  **Bottom Navigation Bar (`div.fixed bottom-0 ...`)**:
    *   This section creates a fixed navigation bar at the bottom of the screen.
    *   `fixed bottom-0 left-0 w-full`: Fixes the navigation bar to the bottom of the viewport, stretching across the full width.
    *   `p-1 bg-blue-500`: Adds padding and sets the background color to blue.
    *   `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`:  Applies a subtle shadow to the top of the navigation bar.  The shadow is defined using a CSS box-shadow property.
    *   `rounded-t-3xl`: Rounds the top corners of the navigation bar.
    *   `border-t border-gray-100`: Adds a subtle border to the top.
5.  **Navigation Buttons (`button[onclick]` x3)**:
    *   These buttons are responsible for switching between the different screens.
    *   `onclick={() => switchScreen("home")}`: Calls the `switchScreen` function (defined in the `<script>` section) when clicked, updating the `activeScreen` state and triggering a re-render.  The other two buttons work similarly for "course" and "settings".
    *   `class={activeScreen === ... ? "py-2 my-1 px-6 rounded-lg bg-blue-700" : "py-2 my-1 px-6 rounded-lg"}`:  Dynamically applies a background color (`bg-blue-700`) to the button that corresponds to the currently active screen, visually indicating the active screen. `py-2` and `my-1` provide padding and margin. `px-6` sets padding on left and right.
    *   `<Home size="24" ... />`:  Uses the `Home`, `Newspaper`, and `Settings` components from `lucide-svelte` to display icons.
        *   `size="24"`: Sets the size of the icon to 24 pixels.
        *   `class={activeScreen === ... ? "text-white" : "text-white/60"}`:  Dynamically sets the text color of the icon to white for the active screen and a semi-transparent white for the inactive screens.

## Navigation

*   Clicking the Home icon navigates to the `HomeScreen`.
*   Clicking the News icon navigates to the `News` screen.
*   Clicking the Settings icon navigates to the `SettingsScreen`.
*   No parameters are passed during navigation.

## Special Notes

*   The `blur` transition provides a visual cue when switching between screens, improving the user experience.
*   The dynamic class binding on the buttons in the navigation bar highlights the currently selected screen.
*   The state management uses localStorage to persist user data across sessions.
*   The `limitArrays` function is used to limit the size of arrays stored in localStorage, preventing the storage from becoming too large.

## TODO

[ ] Create a loading state to display while switching between screens.
[ ] Implement proper error handling for localStorage operations.
[ ] Add accessibility features, such as ARIA attributes, to the navigation bar.
[ ] Implement better UI feedback mechanism other than backgroun color change.

[ ] Implement a more sophisticated transition effect between screens.
[ ] Allow users to customize the appearance of the navigation bar.
[ ] Refactor state management to use a more robust solution like Zustand or Jotai.
[ ] Implement screen history to allow users to navigate back to previous screens.
```

---



## matric

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

---



## matric-subjects

```md
# Reference: Matric Exam Screen

## Goal
Display a list of subjects within a selected matric exam, showing progress for each subject and allowing navigation to a subject-specific screen.

## API Functions and State
*   **API Functions:**
    *   `getMatricExam(examId: string)`: Fetches matric exam data from the API based on the `examId`.
*   **State Variables:**
    *   `params`: (From `$props()`) An object containing route parameters, specifically `examId`.
    *   `exam: MatricExam | null`: Stores the fetched `MatricExam` object, initially null.
    *   `loading: boolean`: Indicates whether the exam data is currently being fetched (true) or not (false).
    *   `progress: Record<string, number>`: Stores the progress percentage for each subject within the exam. The keys are `subjectId` and the values are the percentage of questions answered.
    *   `permstate`: Global state management object imported from `$lib/state.svelte`, contains persistent user data like exam progress and user info.

## UI Description
The screen is divided into two main sections: a header (blue background) and a content area (white background).

**Header (bg-blue-500):**

*   **Background:** Blue (#007bff, class `bg-blue-500`).  Has rounded bottom corners (`rounded-b-3xl`).
*   **Padding:** Horizontal (`px-4`) and vertical (`py-6`).
*   **Back Button:**
    *   A button containing an `ArrowLeft` icon (from `lucide-svelte`).
    *   The button's `onclick` handler calls `history.back()` to navigate to the previous screen.
    *   The icon is white (`color="white"`) and has a size of 28 (`size="28"`).
*   **Exam Title:**
    *   An `h1` element displaying the exam title.
    *   **Loading State:** If `loading` is true, it displays "Loading...".
    *   **Data State:** If `loading` is false and `exam` is not null, it displays `exam.examTitle`. Otherwise, it displays "Matric Exam".
    *   **Styling:**
        *   Text size: `text-3xl`
        *   Font weight: `font-bold`
        *   Text color: `text-white`
        *   Text alignment: `text-right`

**Content Area (bg-white):**

*   **Background:** White (`bg-white`). Has rounded top corners (`rounded-t-3xl`).
*   **Padding:** Horizontal (`px-4`) and vertical (`py-4`).
*   **Conditional Rendering:**  Displays either a loading skeleton or the subject list based on the `loading` state.

    *   **Loading Skeleton (if `loading` is true):**
        *   A grid layout (`grid grid-cols-2 gap-4 mb-8`) containing 10 skeleton items.
        *   Each skeleton item represents a subject card and contains:
            *   A rounded-full skeleton for the subject icon (`Skeleton class="w-10 h-10 mb-2 rounded-full"`).
            *   A short, horizontal skeleton for the subject title (`Skeleton class="h-4 w-24 mb-3"`).
            *   A full-width, rounded-full skeleton for the progress bar (`Skeleton class="w-full h-2 rounded-full mt-3"`).
    *   **Subject List (if `loading` is false):**
        *   A grid layout (`grid grid-cols-2 gap-4 mb-8`) displaying the subjects.
        *   Iterates through the `exam?.subjects` array.
        *   Each subject is displayed as a button:
            *   **Button Functionality:** When clicked, the `handleClick(subject.subjectId)` function is called.
            *   **Button Styling:**
                *   Padding: `p-4`
                *   Rounded corners: `rounded-lg`
                *   Border: `border`
                *   Hover effects: `hover:border-blue-500 hover:bg-blue-50`
                *   Cursor: `cursor-pointer`
                *   Transition: `transition-all`
            *   **Subject Content:** Each button contains:
                *   **Subject Icon:**
                    *   Uses a lookup table `subjectIcons` to dynamically render an icon based on the `subjectId`. It uses `lucide-svelte` icons.
                    *   If a matching icon is found, the corresponding icon component is rendered.
                    *   If no matching icon is found, a default `BookText` icon is rendered.
                    *   The icon is styled with `w-10 h-10 mb-2 text-blue-500`.
                *   **Subject Title:** An `h3` element displaying the `subject.subjectTitle` with `font-bold` styling.
                *   **Progress Bar:**
                    *   A container with a gray background (`bg-gray-200`) and rounded corners (`rounded-full`).
                    *   A child `div` with a blue background (`bg-blue-400`) and rounded corners (`rounded-full`).  The width of this `div` is dynamically set based on the `progress[subject.subjectId]` value, representing the subject's progress percentage.  If no progress is available, it defaults to 0%.  The style is applied inline:  `style="width: {progress[subject.subjectId] || 0}%"`.

## Navigation
*   **Back Navigation:** Clicking the "back" button (arrow icon) navigates the user to the previous page in the browser history using `history.back()`.
*   **Subject Navigation:** Clicking on a subject card navigates the user to the subject-specific screen using `push(`/matric/${exam?.examId}/${subject.subjectId}`)` from `svelte-spa-router`.  The route includes the `examId` and `subjectId` as parameters.

## Special Notes
*   The `onMount` lifecycle hook fetches the exam data either from the `permstate` or from the API.
*   The `getSubjectProgress` function calculates the progress percentage for each subject based on the user's answers, stored in `permstate.matricExamProgress`.
*   The `subjectIcons` object maps subject IDs to corresponding icons from `lucide-svelte`, providing visual cues for each subject.  If a subject ID does not have an icon mapping, the default `BookText` icon is used.
*   The `progress` variable is inspected using `$inspect` for debugging purposes.
*   The component uses conditional rendering to display a loading state with skeleton UI while fetching data.
*   The component fetches exam data from local storage first. if there is none the API is used.
*   The `save` function will persist the `permstate` object in localStorage in the browser.

## TODO

[ ] Handle error cases when fetching exam data from the API (e.g., display an error message if the API call fails).
[ ] Add accessibility attributes (e.g., `aria-label` on the back button, keyboard navigation for subject cards).
[ ] Implement a more sophisticated progress bar UI, possibly with animations or visual cues.

[ ] Consider adding pagination or infinite scrolling for exams with a large number of subjects.
[ ] Implement a search/filter functionality to allow users to easily find specific subjects.
[ ] Implement a refresh button that allows the user to refresh exam data from the API


---



## module

```md
## Goal
Display a series of HTML pages fetched from a server.

## API Functions and State

- **API Functions**:
  - `ky.get(url).text()`: Used to fetch the HTML content of each page. The `url` is dynamically generated based on the loop counter, following the pattern `/logic/page-${i}.html`.
- **State Variables**:
  - `start`: Number representing the starting page number (initialized to 1).
  - `end`: Number representing the ending page number (initialized to 27).
  - `pages`: Array of strings, each string containing the HTML content of a page. This is a Svelte `$state` variable, meaning updates to it trigger reactive updates in the component. Initialized as an empty array `[]`.
  - `loading`: Boolean indicating whether the pages are still being fetched.  This is a Svelte `$state` variable. Initialized to `true`.

## UI Description

The screen consists of a header and a main content area.

- **`main` element**:  A container for the entire screen. It occupies the full screen height (`h-screen`) and uses a flexbox layout (`flex`) with a vertical direction (`flex-col`).
- **`header` element**:
  - `sticky top-0 left-0 right-0`: Makes the header stick to the top of the screen during scrolling. It spans the entire width.
  - `bg-blue-500`:  Sets the background color to blue.
  - `p-4`: Adds padding of 4 units on all sides.
  - `flex items-center`:  Uses flexbox to center the content vertically within the header.
  - `z-10`: Sets the stacking context to ensure it stays on top of other elements.
  - `shadow-md`: Adds a medium-sized shadow.
  - `rounded-b-2xl`: Rounds the bottom corners with an extra-large radius.
  - **`button`**: Contains an `ArrowLeft` icon from the `lucide-svelte` library.
    - `onclick={() => history.back()}`:  Navigates the user back to the previous page in the browser history when clicked.
    - **`ArrowLeft`**: A component from `lucide-svelte` that renders a left-pointing arrow icon.  The `color` prop is set to `white`, making the arrow white.

- **`div` (content area)**:
  - `overflow-y-auto`: Enables vertical scrolling if the content exceeds the available height.
  - **Conditional Rendering**:
    - **Loading State (`#if loading`)**:
      - `div`: Displays a "Loading..." message.
        - `text-center`: Centers the text horizontally.
        - `py-8`: Adds padding of 8 units to the top and bottom.
        - `text-xl`: Sets the text size to extra-large.
        - `text-gray-600`: Sets the text color to a medium gray.
    - **Loaded State (`{:else}`)**:
      - `{#each pages as page}`: Iterates over the `pages` array.
        - `{@html page}`: Renders the HTML content of each page.  This is crucial; it renders the string in `page` *as HTML*, not as plain text.  It's where the fetched HTML pages are displayed. This can be a security risk if the HTML content is not trusted (e.g., if it contains malicious scripts).

In Summary: The app screen displays a header with a back button, and then fetches a range of html pages from the web. While those pages load, a "Loading..." message is displayed. Once they are loaded, each page is injected as HTML into the screen.

## Navigation

- **Outgoing**:
  - Clicking the back button (represented by the `ArrowLeft` icon) triggers `history.back()`, navigating the user to the previous page in the browser's history. No specific context is passed; the navigation is simply a return to the previous state.

## Special Notes

- **Parallel Fetching**: The code fetches all pages in parallel using `Promise.all()`, which is more efficient than fetching them sequentially.
- **Error Handling**: The `try...catch` block handles potential errors during the page fetching process. If an error occurs, it logs the error to the console and sets `loading` to `false` to prevent the loading message from being displayed indefinitely.  Consider more sophisticated error handling in a production environment.
- **HTML Injection**:  Using `{@html page}` injects raw HTML into the page. This can be a security vulnerability if the content of the HTML files is not trusted. Sanitize the HTML content before rendering it if necessary.
- **State Management**: The code uses Svelte's built-in `$state` to manage the `pages` and `loading` state.  This makes the component reactive to changes in these variables. `permstate` and `tempstate` are defined globally and provide persisted state using local storage, however, this screen doesn't interact with them.

## TODO

[ ] Add more robust error handling (e.g., display an error message to the user).
[ ] Implement a more user-friendly loading indicator (e.g., a progress bar).
[ ] Consider adding pagination or a scroll-to-page feature for easier navigation through the pages.

[ ] Sanitize the HTML content of the pages to prevent XSS vulnerabilities.
[ ] Implement caching to reduce the number of API calls.
[ ] Explore using a virtualized list to improve performance for a large number of pages.
[ ] Add a "refresh" button to refetch the pages if necessary.
```

---



## news

```markdown
# Coming Soon Screen Reference

- **Goal**: To inform the user that the personalized news feed feature is under development and will be available soon.

- **API Functions and State**:

  *   **State**:
      *   None directly used in this component. However, global state is managed using `tempstate` and `permstate` (defined in `STATE MANAGEMENT` section), which could influence future functionality.  Relevant fields include:
          *   `permstate.userInfo`: User profile information (gender, education focus, etc.).
          *   `permstate.myCourses`: List of courses the user is enrolled in.
          *   `permstate.recCourses`: List of recommended courses for the user.
          *   `permstate.allCourses`: List of all available courses.
          *    `permstate.quizResults`: List of quiz results of the user.
  *   **API Functions**: None.  This screen is purely presentational.

- **UI Description**:

  The screen is designed as a full-page display with a central message indicating the feature's imminent availability.  It utilizes a flexbox layout to center the content vertically and horizontally.

    *   **Root `div`:**
        *   Class: `bg-accent min-h-screen flex flex-col`
        *   `style`: `padding-bottom: 80px`
        *   Purpose:  The main container for the entire screen. `bg-accent` sets the background color.  `min-h-screen` ensures the container takes up at least the full screen height. `flex flex-col` enables a vertical flexbox layout, aligning items from top to bottom. The inline style adds padding at the bottom, potentially to accommodate a fixed bottom navigation bar.

    *   **Content `div`:**
        *   Class: `flex pt-8 px-4 flex-grow items-center`
        *   Purpose:  Container for the "Coming Soon" message. `flex-grow` makes this container expand to fill available vertical space, pushing content to the center.  `items-center` centers items vertically within the flex container.

    *   **Text `span`:**
        *   Class: `px-4 text-center`
        *   Purpose:  Centers the text content.

    *   **Heading `h1`:**
        *   Class: `text-2xl font-bold mb-2 text-gray-900`
        *   Content:  "Coming Soon"
        *   Purpose:  The main title of the screen.  `text-2xl` sets the font size. `font-bold` makes the text bold. `mb-2` adds a margin at the bottom, spacing it from the paragraph. `text-gray-900` defines the text color.

    *   **Paragraph `p`:**
        *   Class: `text-gray-600 max-w-md mx-auto`
        *   Content:  "Personalized news feed for your learning journey coming soon!"
        *   Purpose:  A descriptive message explaining the feature that is coming soon. `text-gray-600` defines the text color. `max-w-md` limits the maximum width of the paragraph to `md` size to improve readability. `mx-auto` horizontally centers the paragraph.

    *   **Empty `span`:**
        *   Class: `flex-grow`
        *   Purpose:  A flex item that takes up remaining horizontal space, pushing the content to the left, creating some visual spacing.

    *   **Commented-out Card Component:**
        *   This section demonstrates a visually appealing card design (using `Card`, `CardHeader`, `CardContent`, `CardTitle` components) likely intended to provide a user greeting or promote a channel. Although commented out, its attributes indicate intent: a profile image, a personalized message, and a link to a Telegram channel.

    *   **Commented-out Navigation Bar:**
        *   This section (also commented out) demonstrates a fixed bottom navigation bar using `Home`, `Newspaper`, and `Settings` icons from the `lucide-svelte` library. This implies planned navigation to Home, News/Feed (current page), and Settings screens.  The active (current) page is indicated by a different background color.

- **Navigation**:

  *   The commented-out navigation bar suggests potential navigation to:
      *   Home screen (using `<Home />` icon and `/` href).
      *   Settings screen (using `<Settings />` icon and a potentially linked route).

- **Special Notes**:

  *   The component is designed to be a placeholder screen.  It does not yet have any interactive elements or data fetching logic.
  *   The commented-out code shows a possible direction for future development, including a promotional card and a bottom navigation bar.
  *   The `bg-accent` class suggests the existence of a theme or style system where accent colors are defined.
  *   The `padding-bottom` style on the root element is likely to account for a fixed bottom navigation bar (commented out).

- **TODO**:

  *   [ ] Implement the personalized news feed functionality.
  *   [ ] Connect the UI to backend data sources to populate the news feed.
  *   [ ] Implement the bottom navigation bar with working links to other screens.
  *   [ ] Design and implement the actual UI for the personalized news feed.
  *   [ ] Consider adding a loading indicator or progress bar to indicate the feature is being actively developed.
  *   [ ] Replace the placeholder text with dynamic content or a more engaging message.
  *   [ ] Implement user feedback mechanisms (e.g., a "Notify me when ready" button).
  *   [ ] Add animation or visual cues to make the "Coming Soon" message more noticeable.
  *   [ ] Integrate with user authentication and authorization.
  *   [ ] Design error handling and edge case scenarios.
```

---



## past-exams

```reference.md
# App Screen: Exam List

- **Goal**: Display a list of available exams (Exit Exams or Matriculation Exams) based on the user's preferred exam type, allowing the user to navigate to a specific exam.

- **API Functions and State**:
  - `getExitExams()`: Fetches a list of exit exams from the API.
  - `getMatricExams()`: Fetches a list of matriculation exams from the API.
  - `permstate`: A Svelte store holding persistent application state, including:
    - `permstate.userInfo?.examFocus`:  String indicating the user's preferred exam type ("exitexam" or "matric"). Defaults to "exitexam".
    - `permstate.exitExams`: Array of `ExitExam` objects.
    - `permstate.matricExams`: Array of `MatricExam` objects.
    - `permstate.exitExamProgress`:  Record storing the progress of each exit exam, keyed by examId.  Each examId maps to a record storing course progress data, keyed by courseId, which maps to an array of strings representing the user's answers for each question in that course.  If an answer is `undefined`, it means the question hasn't been answered yet.
    - `permstate.matricExamProgress`: Record storing the progress of each matric exam, keyed by examId. Each examId maps to a record storing subject progress data, keyed by subjectId, which maps to a record storing chapter progress data, keyed by chapterId. This chapterId record maps to an array of strings representing the user's answers for each question in that chapter. If an answer is `undefined`, it means the question hasn't been answered yet.
  - `save(permstate)`: Function to save the `permstate` to local storage.
  - `examFocus`: A state variable indicating the type of exams to show ("exitexam" or "matric").
  - `loading`: A boolean state variable indicating whether the exam data is currently being fetched.

- **UI Description**:
  - **Container (`div.container`)**: The outermost container provides basic styling and padding.  It's responsible for the overall layout of the screen. It has `bg-accent` set as the background color.
  - **Header (`div.flex`)**: Contains an "ArrowLeft" icon and a title indicating the type of exams being displayed.
    - **ArrowLeft (`lucide-svelte` component)**: An arrow icon, presumably intended for navigation back to the previous screen.  Currently, it's non-functional.
    - **Title (`span.text-2xl`)**:  Displays "Exit Exams" or "Matriculation Exams" based on the `examFocus` state.
  - **Exam Grid (`div.grid`)**: A grid layout to display the list of exams. It uses CSS grid classes to adjust the number of columns based on the screen size (1 column on small screens, 2 on medium, 3 on large).
    - **Loading State**:
      - When `loading` is true, a series of skeleton loaders are displayed.
      - **Skeleton Loader (`div.card`)**:  A placeholder card with skeleton elements to indicate that the exam data is still loading. It uses `ui/skeleton` components, which are likely custom components to create a shimmer loading effect.  There are six of these cards displayed. Each skeleton card has a title skeleton, a progress skeleton bar, and a smaller text skeleton.
    - **Exam List**:
      - When `loading` is false, the list of exams is displayed based on the `examFocus` state. It iterates through `permstate.exitExams` or `permstate.matricExams`.
      - **Exam Card (`button.card`)**: A button that represents a single exam.
        - **Card Header (`div.card-header`)**: Contains the exam title and progress information.
          - **Exam Title (`h2.text-xl`)**: Displays the title of the exam (`exam.examTitle`).
          - **Progress Text (`span.text-gray-700`)**: Shows the progress of the exam, displaying the number of completed questions out of the total number of questions. The counts are dynamically calculated through the `calculateExitExamProgress` or `calculateMatricExamProgress` functions depending on the exam type.
        - **Card Content (`div.card-content`)**: Contains a progress bar visualizing the exam progress.
          - **Progress Bar Container (`div.w-full`)**: The outer container for the progress bar, styled with a light gray background and rounded corners.
          - **Progress Bar (`div.bg-blue-400`)**: The actual progress bar, filled with a blue color. Its width is dynamically set based on the calculated progress percentage using inline styling. The width style is `width: {progress.totalQuestions ? (progress.completedQuestions / progress.totalQuestions) * 100 : 0}%`.  This calculates the percentage of completed questions and sets the width of the blue bar accordingly.

  - **calculateExitExamProgress(examId: string)**: Calculates the progress of a specific exit exam.
    - It finds the exam based on the `examId` within `permstate.exitExams`.
    - It retrieves progress data for the exam from `permstate.exitExamProgress`.
    - It iterates through the `courses` within the exam.
    - For each course, it retrieves the user's answers from the `progressData` which is `permstate.exitExamProgress?.[examId] || {}`.
    - It counts the total questions and the number of answered questions.
    - It returns an object containing the `completedQuestions` and `totalQuestions`.

  - **calculateMatricExamProgress(examId: string)**: Calculates the progress of a specific matric exam.
    - It finds the exam based on the `examId` within `permstate.matricExams`.
    - It retrieves the progress data for the exam from `permstate.matricExamProgress`.
    - It iterates through the `subjects` within the exam.
    - For each subject, it iterates through the `chapters`.
    - For each chapter, it retrieves the user's answers from the `subjectProgress` data, which is `permstate.matricExamProgress?.[examId]?.[subjectId] || {}`.
    - It counts the total questions and the number of answered questions.
    - It returns an object containing the `completedQuestions` and `totalQuestions`.

- **Navigation**:
  - Clicking on an exam card navigates to the exam details page.
    - If `examFocus` is "exitexam", it navigates to `/exitexam/{exam.examId}`.
    - If `examFocus` is "matric", it navigates to `/matric/{exam.examId}/{matricExam.subjects[0].subjectId}` if the exam has subjects, selecting the first subject by default.  If the exam has no subjects, it navigates to `/matric/{exam.examId}`.

- **Special Notes**:
  - The component fetches exam data on mount and merges it with existing data in `permstate` to prevent duplicates.  It uses `examId` as the unique identifier for exams.
  - The component uses skeleton loaders to provide a better user experience while the exam data is loading.
  - The component handles cases where the exam data is not available in `permstate` or when the API request fails.
  - Exam progress is calculated based on the data stored in `permstate.exitExamProgress` and `permstate.matricExamProgress`.
  - The component uses the `svelte-spa-router` library for navigation.
  -  The progress calculation involves nested iteration through courses and questions for `exitexam` and subjects, chapters, and questions for `matric` exams. Careful consideration is required for performance when dealing with a large number of courses, subjects, or questions.

- **TODO**:
[ ] Add functionality to the ArrowLeft icon to navigate back to the previous screen.
[ ] Implement error handling to display user-friendly messages when API requests fail or data is missing.

[ ] Consider adding pagination or infinite scrolling for a large number of exams.
[ ] Implement a more robust caching strategy for exam data to reduce API requests.
[ ] Add search/filtering functionality to easily find specific exams.
[ ] Allow users to switch between different exam types (e.g., from Exit Exams to Matriculation Exams) directly on this screen.
[ ] Explore using virtual lists for rendering the exam list, especially for performance with long lists of exams.
[ ] Add the ability to select specific subjects for `matric` exams upon navigation instead of automatically using the first subject.
[ ] Add a "Last Updated" timestamp for exams, indicating when the exam data was last fetched.
```

---



## post-quiz

```md
## Goal
The Quiz Results Screen displays the user's performance on a completed quiz, showing their score, the number of correct answers, the time taken, and a performance message. It provides options to either create a study plan or attempt more questions.

## API Functions and State
- **API Functions:** None
- **State Variables:**
    - `count`: (Local Svelte State) Animated score counter that increments to the final score.
    - `correctAnswers`: (Local Svelte State, derived from `tempstate`) The number of correctly answered questions in the quiz.
    - `totalQuestions`: (Local Svelte State, derived from `tempstate`) The total number of questions in the quiz.
    - `timeTaken`: (Local Svelte State, derived from `tempstate`) The time taken to complete the quiz, in seconds.
    - `performanceMessage`: (Local Svelte State) A message indicating the user's performance level.
    - `tempstate`: (Global Svelte State, from `$lib/state.svelte`) Stores temporary application state, including the quiz results. Accessed to retrieve `quiz.questions` and `quiz.timeTook`.

## UI Description
The Quiz Results Screen is structured into two main sections: a top section displaying the results and a bottom section with action buttons.

**Top Section (Results Display):**
- **Background:** `bg-blue-500` (light blue)
- **Layout:** `flex flex-col flex-1 items-center justify-center` (vertically centered content)
- **Score Display:**
    - `Star` icon: `lucide-svelte` Star icon filled with yellow.  Visually represents achievement.
    - Score Value: `text-7xl font-bold text-white` (large, bold, white text) The animated score (`count`) is prominently displayed.
- **Performance Message:**
    - `text-3xl font-bold text-white` (large, bold, white text) Displays a dynamically generated message (e.g., "Outstanding!", "Good Work!") based on the percentage of correct answers. Uses the `getPerformanceMessage` function.
- **Metrics Display:**
    - Layout: `flex items-center justify-center gap-8 mt-8` (horizontal arrangement with spacing).
    - Correct Answers:
        - `CheckSquare` icon: `lucide-svelte` CheckSquare icon.
        - Text: `text-2xl font-bold text-white` Displays the number of correct answers out of the total number of questions (e.g., "8/10").
    - Time Taken:
        - `Clock` icon: `lucide-svelte` Clock icon.
        - Text: `text-2xl font-bold text-white` Displays the time taken to complete the quiz, formatted as `MM:SS` (e.g., "05:30"). Uses the `formatTime` function for formatting.

**Bottom Section (Action Buttons):**
- **Background:** `bg-white rounded-t-3xl` (white with rounded top corners).
- **Layout:** `flex-1 px-6 flex flex-col justify-center` (vertically centered content with horizontal padding).  `flex-1` allows this bottom section to fill the remaining available vertical space.
- **Content:** `w-4/5 mx-auto space-y-4` (content container with spacing between elements, centered horizontally).
    - **Create Study Plan Button:**
        - `Button` component: Custom `Button` component with `variant="primary"`.
        - Style: `bg-blue-500 text-white w-full py-6 text-lg` (blue background, white text, full width, large padding, large text).
        - Icon: `ClipboardList` icon from `lucide-svelte`. Placed to the left of the button text.
        - Functionality: On click, navigates to the `/study-plan` route using `svelte-spa-router`.
    - **More Questions Button:**
        - `Button` component: Custom `Button` component with `variant="ghost"`.
        - Style: `bg-blue-100 w-full py-6 text-lg` (light blue background, full width, large padding, large text).
        - Icon: `PlayCircle` icon from `lucide-svelte`. Placed to the left of the button text.
        - Functionality: On click, navigates to the `/select-topics` route using `svelte-spa-router`.

**Transitions:**
- The main `div` uses a `fade` transition for initial appearance.
- The bottom section uses a `fly` transition, sliding up from the bottom, upon the screen being rendered.

## Navigation
- **Outgoing:**
    - `/study-plan`: Navigated to when the "Create Study Plan" button is clicked. No specific context is passed, but the user's performance on the quiz is implicitly used to inform the study plan generated on that screen.
    - `/select-topics`: Navigated to when the "More Questions" button is clicked. No specific context is passed.

## Special Notes
- The `count` state variable is animated from 0 to the final score value using `requestAnimationFrame`. This provides a visual indication of the user's score increasing.
- The `getPerformanceMessage` function provides dynamic, encouraging feedback based on the user's performance percentage.
- The time is formatted using `formatTime` which pad with leading zeros.

## TODO
[ ] Investigate how to better handle state management for animations, possibly using Svelte's built-in animation features more directly.
[ ] Add error handling for cases where `tempstate.quiz` or its properties are undefined.
[ ] Ensure appropriate ARIA attributes are set for accessibility.

[ ] Consider persisting the score to the `permstate`.
[ ] Implement a "Review Quiz" button that allows users to go back through the questions and see their answers.
[ ] Add social sharing options to allow users to share their scores.
[ ] Implement adaptive difficulty based on quiz performance.
```

---



## quest-type

```md
## Goal
The "Select Question Types" screen allows the user to choose which types of questions (Multiple Choice, True/False, Short Answer) will be included in the generated quiz. It persists these preferences locally and navigates the user to the quiz screen.

## API Functions and State
- **API Functions:**
  - `getQuizQuestions()`: Fetches quiz questions from the API based on user selections.
- **State Variables:**
  - `isLoading`:  A boolean `$state` variable indicating whether the quiz questions are being fetched from the API. Initially `false`.
  - `selectedTypes`:  A `$state` object that holds boolean values for each question type (`multipleChoice`, `trueFalse`, `shortAnswer`), indicating whether they are selected. Initial values are loaded from `permstate?.qtypes` or default to `true` for all types.
  - `tempstate`: A `$state` object that stores temporary data, like the quiz object containing questions, course, topics, etc.
  - `permstate`: A `$state` object that stores persistent user data, including question type preferences (`qtypes`).  It's loaded from `localStorage` and saved back to it.
  - `isContinueDisabled`: A `$derived` boolean variable that determines whether the "Next" button is disabled.  It's `true` if no question types are selected or if `isLoading` is `true`, and `false` otherwise.

## UI Description
The screen is structured as a centered column layout with a background color.

- **Outer `div`:**
  - `class`: `flex flex-col justify-center items-center h-screen gap-8 p-8 bg-blue-50`
  - This `div` serves as the main container. It uses flexbox to center its contents both horizontally and vertically.
    - `flex flex-col`: Arranges items in a column.
    - `justify-center`: Centers items vertically within the container.
    - `items-center`: Centers items horizontally within the container.
    - `h-screen`: Makes the container take up the full height of the viewport.
    - `gap-8`: Adds a gap of 8 units between the container's children.
    - `p-8`: Applies padding of 8 units to all sides of the container.
    - `bg-blue-50`: Sets the background color to a light blue.

- **Question Type Selection Area (inner `div`)**:
    - `class`: `space-y-4 text-center`
    - Contains the title and the checkboxes for selecting question types.
        - `space-y-4`: Adds vertical space between the children.
        - `text-center`: Centers the text inside the div.

    - **Title (`p` element):**
        - `class`: `text-3xl font-semibold mb-16`
        - Displays the title "Select Question Types".
            - `text-3xl`: Sets the text size to extra-large.
            - `font-semibold`: Makes the text semi-bold.
            - `mb-16`: Adds a margin of 16 units to the bottom of the title.
    - **Checkbox Group (`div` element):**
        - `class`: `flex flex-col gap-4`
        - A flex container arranged in a column.
            - `flex flex-col`: Arranges items in a column.
            - `gap-4`: Adds a gap of 4 units between the items.
        - Contains three `label` elements, each representing a question type.

        - **`label` elements (Multiple Choice, True/False, Short Answer):**
            - `class`: `flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50`
            - Each `label` acts as a clickable area containing a checkbox and a text label.
            - `flex items-center`: Aligns the checkbox and text label horizontally.
            - `gap-3`: Adds a gap of 3 units between the checkbox and text label.
            - `p-4`: Applies padding of 4 units to all sides of the label.
            - `rounded-lg`: Makes the corners of the label rounded.
            - `border-2`: Adds a border of 2 units to the label.
            - `transition-all`: Applies a smooth transition to all CSS properties when the label is hovered.
            - `cursor-pointer`: Changes the cursor to a pointer when the label is hovered.
            - `hover:bg-gray-50`: Changes the background color to light gray when the label is hovered.
            - `class:border-primary={selectedTypes.multipleChoice}`
                - Conditionally adds the `border-primary` class if the corresponding question type is selected.
            - `class:bg-blue-100={selectedTypes.multipleChoice}`
                - Conditionally adds the `bg-blue-100` class if the corresponding question type is selected.

            - **`Checkbox` component:**
                - `bind:checked={selectedTypes.multipleChoice}` (or `trueFalse`, `shortAnswer`)
                - A custom checkbox component that is bound to the corresponding boolean value in the `selectedTypes` object.
                    - `size="lg"`: Sets the size of the checkbox to large.
                - When the checkbox is clicked, the corresponding value in the `selectedTypes` object is updated.

            - **`span` element (Text Label):**
                - `class`: `text-xl`
                - Displays the text label for the question type (e.g., "Multiple Choice").
                    - `text-xl`: Sets the text size to large.

- **"Next" Button:**
  - `<Button>` component from `$lib/components/ui/button`.
    - `onclick={handleContinue}`:  Calls the `handleContinue` function when the button is clicked.
    - `disabled={isContinueDisabled}`: Disables the button if `isContinueDisabled` is `true` (i.e., no question types are selected or the app is loading data).
    - `size="lg"`: Sets the button size to large.
    - `class`: `text-lg font-bold w-full mt-8`
      - Styles the button text and width.
        - `text-lg`: Sets the text size to large.
        - `font-bold`: Makes the text bold.
        - `w-full`: Makes the button take up the full width of its container.
        - `mt-8`: Adds a margin of 8 units to the top of the button.
  - **Button Content (Conditional rendering):**
    - Displays "Next" text along with either a loading spinner (`LoaderCircle`) or an arrow icon (`ArrowRight`) based on the `isLoading` state.
      - `{#if isLoading}`...`{:else}`...`{/if}` block controls which icon is displayed.
        - If `isLoading` is true, displays a loading spinner icon (`LoaderCircle`) with animation.
        - Otherwise, displays an arrow icon (`ArrowRight`).
      - `<LoaderCircle class="animate-spin" />`
        - `animate-spin`: Animate the loading circle to spin.

## Navigation
- **Outgoing:**
  - On successful selection of question types and API call completion (after clicking "Next" and `isLoading` becomes `false`), the user is navigated to `/quiz/0` using `push(`/quiz/0`)`.  The URL represents the quiz screen, and "0" likely represents the index of the first question (or starting point of the quiz).
  - The `tempstate.quiz` is updated with the selected question types and fetched questions before navigation. This data is then available on the quiz screen.
  - The selected question types are also saved to `permstate` and then to `localStorage` for persistence.

## Special Notes
- The component utilizes Svelte's reactive `$state` and `$derived` features for state management and UI updates.
-  The question type preferences are persisted in `localStorage` using the `permstate` variable, allowing the user's selections to be remembered across sessions.
- The component includes a loading state (`isLoading`) to prevent multiple API calls and provide visual feedback during data fetching.
- The component uses the `svelte-spa-router` library for navigation.
- Error handling for the `getQuizQuestions` API call is not explicitly shown in the provided code but should be implemented in a production environment.

## TODO
[ ] Implement error handling for the `getQuizQuestions` API call (e.g., display an error message to the user if the API call fails).
[ ] Add validation to ensure at least one question type is selected before enabling the "Next" button (this is currently handled by `isContinueDisabled`, but explicit validation might be helpful).
[ ] Consider adding a confirmation dialog or message to inform the user that their preferences have been saved.

[ ] Explore more sophisticated UI feedback for the checkboxes (e.g., a more pronounced selection effect).
[ ] Implement a "Select All" option for question types.
[ ] Add the ability to customize the number of questions per type.
[ ] Consider adding more detailed descriptions or icons for each question type to improve user understanding.
[ ] Add unit tests to ensure the component functions correctly.
```

---



## quiz

```markdown
## Goal

The Quiz Screen displays individual questions from a quiz, handles user input, tracks progress, and provides feedback on answers. It manages navigation between questions and completion of the quiz, ultimately creating a study plan based on the user's performance.

## API Functions and State

**API Functions:**

*   None. This component primarily uses local state and navigation.

**State Variables:**

*   `currentQuestionIndex`: (State) The index of the current question being displayed. Initialized from route parameter `params.index`.
*   `currentProgress`: (State)  A number representing the user's progress through the quiz (percentage).
*   `showSolution`: (State) A boolean indicating whether the solution to the current question should be displayed.
*   `selectedAnswer`: (State) A string or null representing the user's selected answer for a multiple-choice question.
*   `isCorrect`: (State) A boolean or null indicating whether the user's selected answer is correct.
*   `solution`: (State) A string containing the solution text for the current question.
*   `seconds`: (State) A number representing the time elapsed during the quiz (in seconds).
*   `timerInterval`: (State) A number or null representing the interval ID for the timer.
*   `isPaused`: (State) A boolean indicating whether the timer is paused.
*   `tempstate`: (State - from `$lib/state.svelte`) Global state containing the quiz data (`tempstate.quiz`).
*   `permstate`: (State - from `$lib/state.svelte`) Global state to store quiz results, stars, and other user data.
*   `location`: (State - from `svelte-spa-router`) Used to access the current URL and trigger effects when it changes.
* `params`: (Props) A prop passed to the svelte component that indicates the index

## UI Description

The Quiz Screen's UI is driven by the `Question` component. The main component itself primarily handles state management, navigation, and logic related to quiz progression.

*   **`Question` Component:** This component is the central element of the UI.  It receives the following props:
    *   `question`: The question text to be displayed.  This is taken from `tempstate.quiz.questions[currentQuestionIndex].question`.
    *   `options`: An array of answer options for the question. The format depends on the question type (see `getQuestionOptions` function). Each option is an object with `value` and `text` properties.
    *   `solution`: The solution text for the question.  This is either directly the solution for the question or from `tempstate.quiz.questions[currentQuestionIndex].solution`
    *   `hint`: A hint for the current question, taken from  `tempstate.quiz.questions[currentQuestionIndex]?.hint`.
    *   `showSolution`: A boolean that determines whether the solution section of the `Question` component is visible.
    *   `selectedAnswer`: The user's selected answer, used to highlight the selection.
    *   `isCorrect`:  A boolean indicating if the selected answer is correct; used for visual feedback.
    *   `handleAnswerSelect`: A function called when the user selects an answer (for multiple-choice and true/false questions).
    *   `handleWorkoutAnswer`: A function called for "workout" type questions; takes a boolean (`gotItRight`) as input.
    *   `handleNext`: A function to advance to the next question.
    *   `currentProgress`: The current progress percentage through the quiz, displayed (likely) in a progress bar.
    *   `seconds`: The elapsed time during the quiz, displayed to the user.
    *   `goBack`: A function that navigates back to the previous page (using `window.history.back()`).
    *   `currentQuestionIndex`:  The index of the current question (used for display purposes, e.g., "Question 1 of 10").
    *   `showAnswerForWorkout`: A function used to display the answer for a workout type question.
    *   `handleDone`: A function called when the user wants to finish the quiz before answering all questions.
    *   `report`: A function to navigate to the report page for the current question.
    *   `questionType`:  The type of question (`multiple-choice`, `true-false`, or `workout`), determining the input method. Taken from `tempstate.quiz.questions[currentQuestionIndex].metadata.questionType`.
    *   `totalQuestions`: The total number of questions in the quiz.

*   **Conditional Rendering:** The entire UI is rendered conditionally based on `tempstate.quiz.questions.length > 0`. This ensures that the UI is only displayed if there are questions in the quiz.

*   **Question Display:** The `question` prop of the Question component is the main content that will get displayed

*   **Options Display:** The `options` prop is an array of option objects for each question that the user will use to select and answer the question

*   **Solution Display:** The `solution` prop is a string that will contain the correct answer for the question

*   **Progress Indicator:** The `currentProgress` prop will show the user how far they've come

*   **Time Display:** The `seconds` prop displays a basic timer that will continue to tick up unless the page is paused

*   **`getQuestionOptions(question: Question)` function:** This function determines the answer options based on the question type.
    *   For `multiple-choice` questions, it maps the `question.options` array to an array of objects with `value` (index) and `text` (option text) properties.
    *   For `true-false` questions, it returns a fixed array of two objects: `{ value: "true", text: "True" }` and `{ value: "false", text: "False" }`.
    *   For other question types, it returns an empty array.

*   **`startTimer()` function:** This function starts a timer that increments the `seconds` variable every second, only if the timer is not already running and the quiz is not paused.
*   **`updateProgress()` function:** This function updates the `currentProgress` variable based on the `currentQuestionIndex` and the total number of questions.
*   **`handleAnswerSelect(answer: string)` function:** This function handles the selection of an answer for multiple-choice or true/false questions. It:
    *   Sets `selectedAnswer` to the user's choice.
    *   Determines if the answer is correct by comparing it to `currentQuestion.metadata.correctAnswer`.
    *   Sets `isCorrect` accordingly.
    *   Sets `solution` to `currentQuestion.solution`.
    *   Sets `showSolution` to true to reveal the answer.
    *   Updates `tempstate.quiz.questions[currentQuestionIndex]` with user answer, correct/incorrect status, and marks question as answered
    *   Pauses the timer (`isPaused = true`).
    *   Scrolls the "solution" element into view after a short delay.
*   **`handleWorkoutAnswer(gotItRight: boolean)` function:** This function handles the result of a "workout" question. It:
    *   Sets `showSolution` to true.
    *   Sets `isCorrect` based on the `gotItRight` parameter.
     *   Updates `tempstate.quiz.questions[currentQuestionIndex]` with user answer, correct/incorrect status, and marks question as answered
    *   Updates `solution` to `tempstate.quiz.questions[currentQuestionIndex].solution`.
    *   Pauses the timer (`isPaused = true`).
    *   Calls `handleNext()` to advance to the next question.
*   **`handleNext()` function:** This function advances the quiz to the next question.  If it's the last question, it calls `finishQuiz()`. Otherwise, it:
    *   Increments `currentQuestionIndex`.
    *   Resets `selectedAnswer`, `showSolution`, `isCorrect`, and `solution`.
    *   Calls `updateProgress()`.
    *   Unpauses the timer (`isPaused = false`).
    *   Navigates to the next question using `push(`/quiz/${nextIndex}`)`.
*   **`handleDone()` function:** This function allows the user to finish the quiz early. It:
    *   Filters the questions array to only include answered questions.
    *   Calls `finishQuiz()`.
*   **`finishQuiz()` function:**  This function is called when the quiz is completed (either by answering all questions or by calling `handleDone()`).  It:
    *   Clears the timer interval.
    *   Stores the elapsed time (`seconds`) in `tempstate.quiz.timeTook`.
    *   Calls `createStudyPlan()` to generate a study plan based on the user's performance.
    *   Updates `permstate.quizResults` with the study plan.
    *   Calculates and awards stars based on the number of correct answers.
    *   Saves the updated `permstate` to local storage.
    *   Navigates to the "/post-quiz" route.
*   **`createStudyPlan()` function:** This function generates a study plan based on the quiz results.
    *   It calls `quizStudyPlan()` for "normal" and "exitexam" quiz types.
    *   It calls `matricStudyPlan()` for "matric" quiz types.
    *   `quizStudyPlan()`: Analyzes the user's performance on each topic in the quiz.
        *   Counts the number of correct and total questions for each topic.
        *   Calculates the percentage of correct answers for each topic.
        *   Categorizes topics into `strongTopics` (>= 70% correct) and `weakTopics` (< 70% correct).
        *   Sorts `weakTopics` by ascending percentage (worst first) and `strongTopics` by descending total questions (most first).
        *   Returns an object containing `strongTopics` and `weakTopics`.
*  **`report()` function:** This function handles the navigation to the Report screen for the currently displayed question
*   **`$effect(() => { ... })` block:** This effect reacts to changes in the `$location` variable (from `svelte-spa-router`).  It parses the question index from the URL and updates the `currentQuestionIndex` if necessary, ensuring that the displayed question matches the URL. This also resets related states.

## Navigation

*   **Outgoing:**
    *   `/quiz/:index`: Navigates to a specific question in the quiz. The `:index` parameter determines the question to display. Triggered by `handleNext()`.
        * Context: The next question index in the quiz.
    *   `/post-quiz`: Navigates to the post-quiz screen after completing the quiz. Triggered by `finishQuiz()`.
        *   Context:  Quiz completion, stores results and study plan.
    *   `/report`: Navigates to the report screen for the currently displayed question. Triggered by `report()`.
        *   Context: The current question's id and text are saved to state
    *   Back navigation (using `window.history.back()`): Navigates to the previous page in the browser's history. Triggered by `goBack()`.
        *   Context:  User wants to return to the previous screen.

## Special Notes

*   The component relies heavily on the `tempstate` and `permstate` global stores. Changes to these stores will affect the component's behavior.
*   The timer functionality uses `setInterval` and `clearInterval` to track the elapsed time. It's important to clear the interval when the component is unmounted or when the quiz is finished to prevent memory leaks.
*   The `$effect` block ensures that the `currentQuestionIndex` stays in sync with the URL, allowing users to navigate directly to specific questions using the URL.
*   The `quizStudyPlan()` function could be optimized to avoid redundant calculations.
*   The component assumes that the `tempstate.quiz` object is properly initialized with an array of questions before the component is rendered.
*   The component uses `scrollIntoView` to smoothly scroll to the solution section. This requires that the solution section has an ID of "solution".
*   The `save` function in `$lib/state.svelte` limits the size of certain arrays in `permstate` before saving to local storage. This is likely to prevent exceeding local storage limits.

[ ] Ensure all properties are passed to the `Question` component correctly and that changes to props trigger the correct updates.
[ ] Double-check the logic in `quizStudyPlan()` to ensure that the study plan is generated correctly based on the user's performance.
[ ] Confirm that the back navigation functions as expected in all scenarios.

[ ] Consider adding error handling for cases where `tempstate.quiz` is not properly initialized.
[ ] Implement `matricStudyPlan()` function.
[ ] Add unit tests to verify the component's behavior, especially the `getQuestionOptions()`, `handleAnswerSelect()`, `handleNext()`, and `finishQuiz()` functions.
[ ] Explore ways to improve the performance of the `quizStudyPlan()` function, especially for quizzes with a large number of questions and topics.
[ ] Consider adding a visual indicator to show the user which questions they have already answered.
[ ] Improve the timer display to show minutes and seconds.
[ ] Add a confirmation dialog before allowing the user to finish the quiz early using `handleDone()`.
[ ] Implement keyboard navigation for selecting answers.
```

---



## report

```md
# Reference: Feedback Screen

- **Goal**: To allow users to report issues or feedback related to a specific question or topic.

- **API Functions and State**:
  - `reportFeedback(UserReport)`: API function that sends the user's feedback to the server.
  - `tempstate`: Svelte store holding temporary state, including the `report` property of type `UserReport`. The `report` property contains information about the question or topic being reported on, as well as the user's `issue` description.
  - `loading`: Svelte state variable to track whether the feedback submission is in progress.
  - `issue`: Svelte state variable bound to the textarea to capture the user's feedback text.

- **UI Description**:

  The screen is divided into three main sections: a blue header, a content area, and a submit button.

  1.  **Header (blue-500 class):**
    -   Background: blue-500 color.
    -   Rounded Bottom: The bottom corners are rounded with a radius of 3xl.
    -   Padding: The header has padding on all sides.
    -   Back Button:
        -   Functionality: A button with an arrow icon. When clicked, it navigates the user back to the previous screen using `window.history.back()`.
        -   Icon: Uses the `ArrowLeft` component from `lucide-svelte`, colored white and sized 28.
        -   Layout: Uses flexbox to align items in the center and grow to fill the available space.
  2.  **Content Area (bg-white class):**
    -   Background: white color.
    -   Rounded Top: The top corners are rounded with a radius of 3xl.
    -   Padding: The content area has padding on all sides, including a top padding of 4.
    -   Report Context:
        -   `tempstate.report.topic` Exists (reporting on a topic):
            -   Icon: Displays a `BookOpen` icon.
            -   Title: Displays the title of the topic from `tempstate.report.topic.title`.  If the title is not available, it defaults to "Report on topic". The topic title is displayed with `text-xl` and `font-medium` classes.
        -   `tempstate.report.topic` Does Not Exist (reporting on a question):
            -   Icon: Displays a `CircleHelp` icon.
            -   Question Text: Displays the `questionText` from `tempstate.report.question.questionText`. If the question text is not available, a fallback text "Report on question" is shown. The question text utilizes the `@html` directive to render HTML content and maintain formatting.
        -   Style: The context is displayed within a container with classes `flex`, `items-center`, `gap-3`, `p-4`, `bg-white`, `rounded-lg`, `border`, and `mb-6`. This provides visual separation and styling.
    -   Feedback Textarea:
        -   Label: A label with the text "Please describe the problem you encountered:" styled with `block`, `text-lg`, `font-medium`, and `mb-2` classes.
        -   Textarea Component: Uses the `Textarea` component.
            -   `bind:value={issue}`: Two-way binding to the `issue` state variable, updating it as the user types.
            -   `rows={6}`: Sets the initial height of the textarea to 6 rows.
            -   `placeholder="Describe the issue in detail..."`: Provides a placeholder text.
            -   Style: contained within a div styled with `grid w-full gap-1.5`
  3.  **Submit Button:**
    -   Alignment: Aligned to the right using `flex justify-end`.
    -   Button Component: Uses the `Button` component from `svelte-radix`.
        -   `size="lg"`: Sets the button size to large.
        -   `class="text-lg font-bold"`: Styles the button text with a large font size and bold weight.
        -   `onclick={handleSend}`: Calls the `handleSend` function when clicked.
        -   `disabled={loading}`: Disables the button while `loading` is true.
        -   Loading State:
            -   While `loading` is true:
                -   Displays a `Loading` spinner icon from `svelte-radix` with animation and classes `animate-spin`, `h-4`, and `w-4`.
                -   Text: "Submitting..."
            -   While `loading` is false:
                -   Text: "Submit"

- **Navigation**:
  -   Back Navigation: Clicking the back arrow in the header navigates back to the previous screen using `window.history.back()`. This navigation does not carry specific data.
  -   Successful Submission: After the `reportFeedback` API call is successful, the user is navigated back to the previous screen using `window.history.back()`.

- **Special Notes**:
  -   The screen uses the `tempstate` store to access the `report` object, which contains the question or topic information being reported on.
  -   The `handleSend` function is asynchronous and handles the API call and loading state.
  -   The `toast` function from `svelte-sonner` is used to display a success message after the feedback is submitted.
  -   The `@html` directive is used to render the `questionText` from `tempstate.report.question`, allowing for rich text formatting.

- **TODO**:
  [ ] Implement error handling for the `reportFeedback` API call, displaying an error message if the submission fails.
  [ ] Add validation to the `issue` textarea to ensure that the user provides some feedback before submitting.
  [ ] Consider adding a character limit to the `issue` textarea to prevent excessively long feedback submissions.
  [ ] Replace `window.history.back()` with a more robust routing solution, such as a SvelteKit `goto` call, to handle navigation more effectively.
  [ ] Persist the feedback text in local storage, or in the `tempstate`, to recover the user's input if they navigate away from the page accidentally.
  [ ] Implement analytics tracking to monitor the frequency and types of feedback received.
  [ ] Add a "Cancel" button to allow the user to discard their feedback.
  [ ] Investigate accessibility of the UI components and make improvements as needed.
```

---



## search-courses

```reference.md
## Goal

The Search Courses screen allows users to search for courses, view search results, request new courses, and navigate to a topic selection screen for a selected course.

## API Functions and State

**API Functions:**

-   `searchCourses(searchQuery: string, eduFocus: string): Promise<Course[]>`: Fetches courses based on the search query and the user's education focus.
-   `requestCourse(courseName: string): Promise<boolean>`:  Sends a request to add a new course with the given name.

**State Variables:**

-   `searchQuery: string`:  The current search query entered by the user in the input field.
-   `searchResults: Course[]`: The array of courses returned from the `searchCourses` API call.
-   `isLoading: boolean`:  A boolean indicating whether the search results are currently being loaded. Used to display a loading state.
-   `isRequestingCourse: boolean`: A boolean that is true when the user has clicked the "Submit" button to request a course and the request has not yet completed. Used to disable the "Submit" button and show "Submitting..." while request is in progress.
-   `searchTimeout: number | null`: Stores the timeout ID for debouncing the search functionality.
-   `newCourseName: string`: The name of the course the user wants to request.
-   `permstate: PermState` (from `../lib/state.svelte`): Persisted user state including `userInfo` (containing `eduFocus`), and `myCourses`.
-   `tempstate: TempState` (from `../lib/state.svelte`): Temporary state including `quiz`, used to store the selected course details for navigation.

## UI Description

The Search Courses screen is structured as follows:

1.  **Container (`div.container`):**
    *   Provides overall structure and padding for the screen.
    *   `container mx-auto p-4 bg-accent min-h-screen` classes provide:
        *   `container`:  Standard container class (likely setting a max-width).
        *   `mx-auto`: Centers the content horizontally.
        *   `p-4`: Adds padding of 4 units on all sides.
        *   `bg-accent`: Sets the background color to the "accent" color from the theme.
        *    `min-h-screen`: Sets the minimum height of the element to 100vh (viewport height), ensuring that it takes up the full screen.

2.  **Header (`div.flex`):**
    *   Contains the screen title.
    *   `flex items-center mb-2 mt-4` classes provide:
        *   `flex`:  Enables flexbox layout.
        *   `items-center`: Vertically aligns the items in the center.
        *   `mb-2`: Adds a margin of 2 units at the bottom.
        *   `mt-4`: Adds a margin of 4 units at the top.
    *   **Title (`h1.text-3xl`):**
        *   Displays the text "Search Courses".
        *   `text-3xl font-bold flex-1` classes provide:
            *   `text-3xl`: Sets the text size to 3xl (likely a large size).
            *   `font-bold`: Makes the text bold.
            *   `flex-1`: Allows the title to take up available space in the flex container.

3.  **Search Input (`div.flex mb-4`):**
    *   Contains the input field and associated buttons for searching.
    *   `flex mb-4` classes provide:
        *   `flex`:  Enables flexbox layout.
        *   `mb-4`: Adds a margin of 4 units at the bottom.
    *   **Input Container (`div.w-full relative`):**
        *   Wraps the input and buttons for positioning.
        *   `w-full relative border-4 border-blue-200 rounded-lg` classes provide:
            *   `w-full`:  Makes the container take up the full width.
            *   `relative`:  Sets the positioning context for absolute positioned elements within (clear and search buttons).
            *   `border-4`: Sets border width to 4 units.
            *   `border-blue-200`: Sets border color to blue-200.
            *   `rounded-lg`: Adds large border radius to the corners of the container.
    *   **Input Field (`input[type="text"]`):**
        *   Allows the user to enter a search query.
        *   `w-full pl-4 pr-12 py-3 text-lg font-medium rounded-lg bg-white/95`
            *   `w-full`:  Makes the input take up the full width.
            *   `pl-4`: Adds padding of 4 units to the left.
            *   `pr-12`: Adds padding of 12 units to the right (for the search and clear icons).
            *   `py-3`: Adds padding of 3 units to the top and bottom.
            *   `text-lg`: Sets the text size to lg (likely a medium size).
            *   `font-medium`: Sets the font weight to medium.
            *   `rounded-lg`: Adds a large border radius to the corners of the input.
            *   `bg-white/95`: Sets the background color to white with 95% opacity.
        *   `bind:value={searchQuery}`:  Binds the input value to the `searchQuery` state variable, providing two-way data binding.
    *   **Clear Button (`button.absolute right-12`):**
        *   Appears only when `searchQuery` is not empty.
        *   Clears the search query when clicked, calling `clearSearch()`.
        *   `absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500` classes provide:
            *   `absolute`:  Absolutely positions the button within its container.
            *   `right-12`: Positions the button 12 units from the right edge.
            *   `top-1/2`: Positions the button at the vertical center.
            *   `transform -translate-y-1/2`:  Vertically centers the button precisely.
            *   `text-gray-500`: Sets the text color to gray-500.
        *   Contains an `X` icon from `lucide-svelte`.
    *   **Search Button (`button.absolute right-3`):**
        *   Triggers the search when clicked, calling `handleSearch()`.
        *   `absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500` classes provide:
            *   `absolute`:  Absolutely positions the button within its container.
            *   `right-3`: Positions the button 3 units from the right edge.
            *   `top-1/2`: Positions the button at the vertical center.
            *   `transform -translate-y-1/2`:  Vertically centers the button precisely.
            *   `text-gray-500`: Sets the text color to gray-500.
        *   Contains a `Search` icon from `lucide-svelte`.

4.  **Search Results (`div.mt-2`):**
    *   Displays the search results based on the current state.
    *   `mt-2` adds a margin of 2 units on top
    *   Conditional rendering:
        *   **Loading State (`#if isLoading`):**
            *   Displays a series of skeleton cards while the search results are loading.
            *   Uses a `#each` block to render five skeleton cards.
            *   Each skeleton card contains:
                *   `Skeleton` components for a rounded avatar and a title.
        *   **Search Results Found (`{:else if searchResults.length > 0}`):**
            *   Displays the search results as clickable cards.
            *   Uses a `#each` block to iterate through the `searchResults` array.
            *   Each course is rendered as a `Card` component:
                *   `Card` with class `mb-3 bg-white text-lg border-2 cursor-pointer hover:shadow-lg transition-shadow`:
                    *   `mb-3`: Adds a margin of 3 units at the bottom.
                    *   `bg-white`: Sets the background color to white.
                    *   `text-lg`: Sets the text size to lg (likely a medium size).
                    *   `border-2`: Sets the border width to 2 units.
                    *   `cursor-pointer`: Changes the cursor to a pointer on hover.
                    *   `hover:shadow-lg`: Adds a large shadow on hover.
                    *   `transition-shadow`: Adds a smooth transition for the shadow effect.
                *   `CardContent`:
                    *   Displays the course emoji and title.
                    *   The card is clickable, calling `handleCardClick(course)` when clicked.
                    *   `text-2xl mr-1` classes provide:
                        *   `text-2xl`: Sets the text size to 2xl (likely a large size).
                        *   `mr-1`: Adds a margin of 1 unit to the right.
        *   **No Search Results Found (`{:else}`):**
            *   Displays a message indicating that no courses were found.
            *   Includes a `Search` icon and a "Course not found" message.
            *   Displays a form to request a new course:
                *   **Course Request Form (`Card`):**
                    *   Contains an input field for the course name and a submit button.
                    *   **Input Field (`Input`):**
                        *   Allows the user to enter the name of the course to request.
                        *   `bind:value={newCourseName}`:  Binds the input value to the `newCourseName` state variable.
                        *   `flex-1`: Allows the input to take up available space in the flex container.
                    *   **Submit Button (`Button`):**
                        *   Triggers the `handleRequestCourse` function when clicked.
                        *   Disabled when `isRequestingCourse` is true or `newCourseName` is empty.
                        *   Displays "Submitting..." while `isRequestingCourse` is true, otherwise displays "Submit".
                        *   `disabled={isRequestingCourse || !newCourseName.trim()}`
                            *   `disabled`: Disables the submit button when `isRequestingCourse` is true, or `newCourseName` is empty.
                        *   `Submitting...` or `Submit`: Displays "Submitting..." when `isRequestingCourse` is true, otherwise displays "Submit".
                *   **Separator:**
                    *   A visual divider.
                *   **Telegram Link:**
                    *   A link to contact the developer on Telegram.
                    *   `text-blue-600`: Sets the text color to blue-600.

## Navigation

-   Clicking on a course card navigates to the `/select-topics` route using `push` from `svelte-spa-router`.
    *   Context: The selected course ID is stored in `tempstate.quiz.courseId`.

## Special Notes

-   The search functionality is debounced using `setTimeout` to prevent excessive API calls while the user is typing.
-   The `permstate` and `tempstate` are managed using Svelte's reactivity system (`$state`) and persist data using localStorage.
-   The `devusename` variable is imported from `../config` and used for the Telegram link.  It represents the developer's Telegram username.
-   Toast notifications are used to provide feedback to the user when a course request is submitted.

## TODO

[ ] Implement error handling for the initial course fetch in `onMount`.
[ ] Add input validation for the `newCourseName` field.
[ ] Consider adding pagination to the search results.
[ ] Implement more robust error handling and user feedback for API calls (e.g., display specific error messages).
[ ] Add a loading indicator for the initial course fetch in `onMount`.
[ ] Implement a more visually appealing loading state for the search results.
[ ] Make the course cards more interactive (e.g., display additional course information on hover).
[ ] Add keyboard navigation support for the search input and course cards.
[ ] Improve the accessibility of the screen for users with disabilities.
[ ] Explore alternative UI patterns for displaying search results, such as a list view.
```

---



## select-courses

# Reference.md

## Goal
The "Select Courses" screen allows the user to choose the courses relevant to a quiz, which will then determine the questions they receive.

## API Functions and State

- **API Functions:**
    - `getExitExam(examId: string)`: Fetches exit exam details including the available courses for selection.
    - `getExitQuestions()`: Retrieves the questions for the selected courses.

- **State Variables:**
    - `isLoading: boolean`: Indicates whether the course data is currently being loaded.
    - `isSubmitting: boolean`: Indicates whether the "Continue" button has been pressed and the data is being submitted.
    - `error: string | null`: Stores any error message encountered during the API calls.
    - `courses: { id: string; name: string; selected: boolean }[]`: An array of courses with their IDs, names, and a boolean flag indicating whether they are selected. This is populated from either `permstate` or the `getExitExam` API call.
    - `firstSelectedCourseRef: HTMLElement | null`: Stores a reference to the first selected course element in the UI, used for scrolling.
    - `firstSelectedCourseFound: boolean`: A flag to indicate if the first selected course has already been found to be saved as a ref.

- **Derived State:**
    - `isContinueDisabled: boolean`: Determines whether the "Continue" button should be disabled based on whether at least one course is selected and whether the form is currently submitting.

- **Persistent State (permstate):**
    - `permstate.exitExams`: An array of `ExitExam` objects stored in local storage.  Used to cache the results of `getExitExam`.
- **Temporary State (tempstate):**
    - `tempstate.quiz.examId`:  The exam ID, used as a parameter for `getExitExam`.
    - `tempstate.quiz.courses`: An array of course IDs, populated with the selected courses when the "Continue" button is clicked, before navigating to the quiz.
    - `tempstate.quiz.questions`: An array of `Question` objects, populated with data from `getExitQuestions()` before navigating to the quiz.

## UI Description

The screen is divided into the following main sections:

1.  **Header:**
    *   Contains a title "Select Courses" ( `<h1>` tag with `text-3xl font-semibold` classes).
    *   Contains a "Continue" button ( `<Button>` component) with an arrow icon ( `<ArrowRight>`).
        *   The button is disabled if no courses are selected or if data is being submitted (`isContinueDisabled`).
        *   When clicked, it triggers the `handleContinue` function.
        *   The button's text changes to "Loading" with a spinner icon (`<Loader2>`) while submitting (`isSubmitting`).

2.  **Content Area:** This area displays the list of courses or a loading/error state.

    *   **Loading State:**
        *   Displayed when `isLoading` is true.
        *   Consists of a series of skeleton loading placeholders (`<Skeleton>`).  Nine placeholders are rendered within a container with `space-y-4 flex-grow overflow-y-auto pr-2` classes. Each skeleton item includes a small circle (representing a checkbox) and a rectangle (representing course name).
    *   **Error State:**
        *   Displayed when `error` is not null.
        *   Displays an error message (`<p>` tag with `text-xl text-red-500` classes) indicating that loading courses failed.  The error message is centered within a flex container.
    *   **Course List:**
        *   Displayed when `isLoading` is false and `error` is null.
        *   A scrollable list of courses is displayed using a `{#each}` block, iterating through the `courses` array. The container element has `space-y-4 flex-grow overflow-y-auto pr-2` styles.
        *   Each course is rendered within a `div` element with classes `rounded-lg bg-white p-4 transition-all cursor-pointer hover:bg-gray-50`.  The background color of the div changes to blue (`bg-blue-100`) if the course is selected (`course.selected`).
        *   The `use:setFirstSelectedCourseRef={course.selected}` directive is used to set a reference to the first selected course in the list, allowing the page to scroll to it upon loading. This is implemented to improve UX, especially when returning to the page.
        *   Each course item contains:
            *   A `<Checkbox>` component to toggle the course selection.
                *   The `checked` state of the checkbox is bound to `course.selected`.
                *   The `onCheckedChange` event handler toggles the `course.selected` property and logs a message to the console.
            *   A `<span>` element displaying the course name (`course.name`).
            *   The `<label>` element wraps the checkbox and span for improved accessibility.

3.  **Overall Layout:**
    *   The main container `<div>` uses a flexbox layout (`flex flex-col`) to stack the header and content vertically.
    *   It has padding (`p-8`), a background color (`bg-blue-50`), and a minimum height (`min-h-screen`) to fill the screen. The content area uses `flex-grow` to take up the remaining space.

## Navigation

-   **Outgoing:**
    -   Clicking the "Continue" button navigates to `/quiz/0` using `svelte-spa-router`'s `push` function. This navigation happens *after* the `getExitQuestions()` API call successfully retrieves the quiz questions for the selected courses. The context passed is implicitly through `tempstate.quiz.questions` and `tempstate.quiz.courses` which are updated before calling `push`.

## Special Notes

-   The component uses reactive statements (`$state`, `$derived`, `$effect`) for state management.
-   The `onMount` lifecycle hook is used to fetch the course data when the component is mounted. It first tries to load courses from `permstate`. If they are not found there it loads them from the `getExitExam` API and caches them in `permstate` for future use.
-   Error handling is implemented to display an error message if the API calls fail.
-   The UI provides visual feedback during loading and submission states.
-   The `setFirstSelectedCourseRef` action is used to automatically scroll to the first selected course, improving user experience if returning to this screen with courses already selected.
-   `permstate` is persisted to local storage using `localStorage.setItem` and is loaded on application start to preserve the user's choices across sessions. A `limitArrays` function is used to limit the sizes of arrays stored in local storage to avoid exceeding the storage limit.
-   The component relies on external UI components from the `ui` library (e.g., `<Checkbox>`, `<Button>`, `<Skeleton>`).

[ ] Implement proper error boundary for the component

[ ] Add a toast notification for successful course selection and navigation.

Future TODOs

[ ] Consider adding a "Select All" / "Deselect All" button for courses
[ ] Improve the error message display with a retry option.
[ ] Implement a more robust loading state with a progress bar.
[ ] Add tooltips or descriptions to each course for more information.
[ ] Handle the scenario where the API returns no courses.
[ ] Explore alternative UI patterns for course selection, such as a multi-select dropdown.
[ ] Add input validation to `permstate` and `tempstate` data
[ ] Implement a more user-friendly error display, consider using a toast notification or modal


---



## select-topics

```markdown
# Select Topics Screen Reference

## Goal
Allow the user to select specific topics from a course to include in a quiz.

## API Functions and State

- **API Functions:**
  - `getCourse(courseId: string)`: Fetches the course outline from the server if not already present in `permstate.allCourses` or `permstate.myCourses`.
- **State:**
  - `isLoading: boolean`:  Indicates whether the course outline is being loaded from the API.
  - `error: string | null`: Stores any error message received during API calls.
  - `chapters: { title: string; expanded: boolean; selectAll: boolean; topics: { name: string; selected: boolean; filename: string }[] }[]`: An array representing the course outline, structured into chapters and topics. `expanded` controls the visibility of the topics within a chapter, `selectAll` controls whether all topics in the chapter are selected, and `topics` is an array of topics within each chapter.  Each topic has `name`, `filename`, and `selected` properties.
  - `firstSelectedTopicRef: HTMLElement | null`: A reference to the first selected topic's DOM element. Used for scrolling to the first selected topic.
  - `firstSelectedTopicFound: boolean`: A flag indicating whether the first selected topic has been found and its ref set.
  - `tempstate.quiz.courseId: string`: Course ID, stored in temporary state.
  - `permstate.allCourses: Course[] | undefined`: All courses (from API).
  - `permstate.myCourses: Course[] | undefined`: User's courses.
  - `tempstate.quiz.topics: string[] | undefined`: Array of topic filenames that have previously been selected. Used for persistence.
  - `isContinueDisabled: boolean`: Derived state that is true if no topics are selected.
## UI Description

The screen is structured as a vertically oriented flexbox layout with the following components:

1.  **Header:**
    *   `<h1>Select Topics</h1>`:  Displays the screen title.
    *   `<Button>`:  "Next" button.  Navigates to the next screen (`/quest-type`) when clicked, using the `push` function from `svelte-spa-router`.  The button is disabled if no topics are selected (`isContinueDisabled`).  It displays an `ArrowRight` icon.

2.  **Content Area:**
    *   Conditionally renders based on the `isLoading` and `error` state variables.
        *   **Loading State (`isLoading` is true):**
            *   Displays a series of `Skeleton` components to indicate loading.  The skeleton simulates the chapter and topic structure. The number of skeleton chapters rendered is fixed at 5. The number of skeleton topics per even-indexed chapter is fixed at 4.
        *   **Error State (`error` is not null):**
            *   Displays an error message using `<p class="text-xl text-red-500">{error}</p>`.
        *   **Main Content (Neither `isLoading` nor `error`):**
            *   A `div` with `space-y-4` to provide spacing between chapters.  It also uses `flex-grow overflow-y-auto pr-2` to fill available space and allow vertical scrolling.  The height is set dynamically using inline styles (`height: calc(100vh - 150px);`).
            *   A `{#each chapters as chapter, chapterIndex}` block iterates through the `chapters` array to render each chapter.
                *   Each chapter is wrapped in a `div` with a `rounded-lg bg-white` style.
                *   **Chapter Header:**
                    *   A `div` containing the chapter title and the expand/collapse button.
                    *   `<label>`: Contains a `<Checkbox>` and the chapter title (`<span>{chapter.title}</span>`).  Clicking the label toggles all topics in the chapter using the `toggleSelectAll` function. The checkbox's `checked` state is bound to `chapter.selectAll`.
                    *   `<button>`:  Toggles the expansion state of the chapter using the `toggleChapter` function. Displays a `ChevronDown` icon, which rotates 180 degrees when the chapter is expanded. The icon's rotation is controlled by the `chapter.expanded` state.
                *   **Chapter Content (Displayed when `chapter.expanded` is true):**
                    *   A `div` with `p-4 border-t-2` to provide padding and a top border.
                    *   A `div` with `space-y-2` to provide spacing between topics.
                    *   A `{#each chapter.topics as topic, topicIndex}` block iterates through the `topics` array within each chapter.
                        *   `<label>`:  Represents each topic. Includes a `<Checkbox>` and the topic name (`<span>{topic.name}</span>`). Uses the `use:setFirstSelectedTopicRef={topic.selected}` directive to set a reference to the first selected topic's DOM node for scrolling purposes.  Applies `bg-blue-100` class if `topic.selected` is true. Has a `hover:bg-gray-50` effect for user interaction.
                        *   `<Checkbox>`: Allows the user to select or deselect individual topics. The `checked` state is bound to `topic.selected`.  The `onCheckedChange` event handler toggles the `topic.selected` property and calls `updateSelectAll(chapterIndex)` to update the chapter's "select all" state.

3.  **Scrolling Behavior:**
    *   The `firstSelectedTopicRef` and `firstSelectedTopicFound` state variables, along with the `$effect` block, implement scrolling to the first selected topic when the component mounts or when the selection changes. The `setFirstSelectedTopicRef` function is used as a Svelte action to set the `firstSelectedTopicRef` to the DOM node of the first selected topic and sets `firstSelectedTopicFound` to true.
    *   The main content area uses `overflow-y-auto` to enable vertical scrolling.

**Detailed breakdown of key UI components and their functionality:**

*   **Chapter Headers**:
    *   Each chapter header contains a checkbox that controls the selection state of all topics within that chapter.
    *   Clicking the chapter header expands or collapses the chapter, revealing or hiding the topics within.
    *   The chapter header visually indicates whether all topics are selected, some topics are selected, or no topics are selected.
*   **Topic Selection**:
    *   Each topic is represented by a checkbox and a label displaying the topic name.
    *   Selecting a topic adds it to the list of topics that will be included in the quiz.
    *   Deselecting a topic removes it from the list.
    *   The UI provides visual feedback (e.g., background color change) to indicate which topics are currently selected.
*   **"Next" Button**:
    *   The "Next" button is disabled if no topics are selected. This prevents the user from proceeding to the next screen without selecting any topics.
    *   Clicking the "Next" button triggers the `handleContinue` function, which extracts the selected topic filenames and updates the `tempstate.quiz.topics` array and navigates to the /quest-type route.
*   **Loading and Error States**:
    *   The UI displays a loading state while the course outline is being fetched from the API. This provides visual feedback to the user that the data is being loaded.
    *   If an error occurs during the API call, the UI displays an error message to inform the user of the issue.
* **Scrolling and Focus Management**:
    * The screen implements a "scroll to first selected topic" feature. This helps the user quickly locate the topics they have already selected, especially when the course outline is long.
    * Svelte actions and effects manage the DOM references and scrolling behavior.

## Navigation

- **Outgoing:**
    -   Clicking the "Next" button navigates to the `/quest-type` route.  The selected topic filenames are saved to `tempstate.quiz.topics` before navigation.

## Special Notes

-   The component relies on reactive state (`$state`, `$derived`, `$effect`) for managing UI updates.
-   The `permstate` is persisted to local storage using the `save` function.
-   The `limitArrays` function is used to limit the size of certain arrays in the `permstate` before saving them to local storage.
-   The scrolling to the first selected topic is handled using DOM manipulation within a `$effect` block.
-   The inline style `height: calc(100vh - 150px);` is used to dynamically set the height of the content area, ensuring that it fills the available space on the screen.

## TODO

[ ] Implement better error handling and display more informative error messages to the user.
[ ] Consider adding a search/filter functionality to allow users to quickly find specific topics.
[ ] Implement a "clear all" button to deselect all topics at once.
[ ] Debounce the calls to local storage to prevent excessive writes
[ ] Add some kind of loading indicator to the chapter collapse/expand animations.

[ ] Explore alternative UI patterns for topic selection, such as a tag-based interface.
[ ] Add a confirmation dialog before navigating away from the screen if the user has made changes.
[ ] Implement server-side caching of course outlines to improve performance.
[ ] Make the number of skeleton items during loading dynamic based on screen size.
```

---



## settings

```markdown
## Goal

The Settings screen allows the user to configure their educational focus (high school, university, exit exam), academic information (grade, department, year of study), gender, and exam focus. This screen personalizes the app experience by tailoring content and recommendations based on the user's selections.

## API Functions and State

- **API Functions:**
    - `getCourseForEduFocus(eduFocus, deptOrGrade)`: Fetches courses based on the selected educational focus and either the grade (for high school) or department (for university).

- **State Variables:**
    - `eduFocus`: (string) User's educational focus ("highschool", "undergrad", "exitexam"). Stored in `permstate.userInfo.eduFocus`.
    - `dept`: (string) User's department/field of study (e.g., "Computer Science"). Stored in `permstate.userInfo.dept`.
    - `yearOfStudy`: (string) User's year of study (e.g., "1st"). Stored in `permstate.userInfo.yearOfStudy`.
    - `gender`: (string) User's gender ("male", "female"). Stored in `permstate.userInfo.gender`.
    - `examFocus`: (string) User's exam focus ("matric", "exitexam"). Stored in `permstate.userInfo.examFocus`.
    - `grade`: (string) User's grade level (e.g., "9"). Stored in `permstate.userInfo.grade`.
    - `permstate`: (PermState) The global state object containing user information, courses, and other application-wide data, persisted in local storage.
    - `permstate.stars`: (number) Represents the user's accumulated stars.

## UI Description

The Settings screen is divided into two main sections: a blue header and a white content area.

**Header (bg-blue-500):**

- **Background:**  Solid blue color (`bg-blue-500`).
- **Rounded Bottom:** Rounded bottom corners (`rounded-b-3xl`).
- **Padding:** Horizontal and vertical padding (`px-4 py-6`).
- **Back Button:**
    - A button that triggers `history.back()` to navigate to the previous screen.
    - Icon: `ArrowLeft` from `lucide-svelte`, colored white, size 28.
- **Title:**
    - Text: "Settings".
    - Styling: Large font size (`text-3xl`), bold (`font-bold`), white color (`text-white`), right-aligned (`text-right`).
- **Stars Display:**
    - A small pill-shaped container showing the user's star count.
    - Background: Light blue (`bg-blue-100`).
    - Rounded corners (`rounded-full`).
    - Padding: Horizontal and vertical padding (`px-4 py-2`).
    - `Star` icon: Fill color yellow-400 and same for text.
    - Text: {`permstate.stars`} `Stars`. Bold font (`font-bold`), slightly transparent (`opacity-80`).

**Content Area (bg-white):**

- **Background:** White color (`bg-white`).
- **Rounded Top:** Rounded top corners (`rounded-t-3xl`).
- **Padding:** Vertical and horizontal padding (`py-4 px-4`).
- Contains several configuration sections wrapped in `div` elements with margin bottom set (`mb-4` or `mb-6`).

    - **Educational Focus Selection:**
        - Label: "Educational Focus" with a `GraduationCap` icon.
        - `Select.Root` component (from `$lib/components/ui/select/index.js`) for selecting the educational focus.
        - `Select.Trigger`: Displays the currently selected education focus,  styled with full width (`w-full`),  `md:w-[280px]` for medium devices and above,  white background (`bg-white`), gray text (`text-gray-800`), bold font (`font-bold`), and a gray border (`border-gray-300`).
        - `Select.Content`: Contains `Select.Item` components for "Highschool", "University", and "Exit Exam", each with a value and label.

    - **Conditional Content based on `eduFocus`:**

        - **If `eduFocus == "highschool"`:**
            - **Grade Level Selection:**
                - Label: "Select your grade level:" with a `Calendar` icon.
                - `Select.Root` component for selecting the grade level.
                - `Select.Trigger`: Displays the currently selected grade, styled similarly to the educational focus trigger.
                - `Select.Content`:  Populated with `Select.Item` components based on the `grades` array (imported from `../config.js`).  Each `Select.Item` displays the grade label.

        - **Else (if `eduFocus != "highschool"`):**
            - **Department/Field Selection:**
                - Label: "Department/Field" with a `BookOpenText` icon.
                - `Combobox` component (from `$lib/mycomps/Combobox.svelte`) for selecting the department.
                - `items`: Populated with data from the `fields` array (imported from `../config.js`).
                - `value`: Bound to the `dept` state variable.
                - Custom class names for `buttonClass` and `contentClass` which sets styling for the button and combobox content, respectively.
                - `placeholder`, `searchPlaceholder`, `emptyMessage` for empty states of the combobox.
            - **Year of Study Selection:**
                - Label: "Year of Study" with a `Calendar` icon.
                - `Select.Root` component for selecting the year of study.
                - `Select.Trigger`:  Displays the currently selected year of study or "Select your year", styled similarly to the educational focus trigger.
                - `Select.Content`: Populated with `Select.Item` components based on the `years` array (imported from `../config.js`). Each `Select.Item` displays the year label.

    - **Gender Selection:**
        - Label: "Gender" with a `User` icon.
        - `Select.Root` component for selecting the gender.
        - `Select.Trigger`: Displays the currently selected gender, styled similarly to the previous triggers.
        - `Select.Content`: Contains `Select.Item` components for "Male" and "Female".

     - **Past Exams Selection:**
        - Label: "Past Exams" with a `FileCheck` icon.
        - `Select.Root` component for selecting the exam focus.
        - `Select.Trigger`: Displays the currently selected gender, styled similarly to the previous triggers.
        - `Select.Content`: Contains `Select.Item` components for "Exit Exam" and "Matric Exam".

    - **Contact Us Card:**
        - `Card` component (from `$lib/components/ui/card`).
        - Background: Light blue (`bg-blue-100`).
        - Transition effect on hover (`transition-colors duration-200 cursor-pointer`).
        - Border: Light blue (`border border-blue-100`).
        - Link:  `mailto:dev@example.com`, styled as a block element with padding (`p-4`) and no underline (`no-underline`).
        - Content: "Contact Us" text (bold, gray) with a `MessageCircle` icon.

## Navigation

- **Outgoing:**
    - Back navigation: Clicking the back arrow navigates the user to the previous screen in the browser's history. No specific context is passed, as it simply returns to the previous state.
    - Contact Us: Clicking the "Contact Us" card opens the user's default email client with the recipient pre-filled as `dev@example.com`.

## Special Notes

- The `permstate` variable is used to store and persist the user's settings in local storage. The `save` function serializes and saves the state, while the component binds the UI elements directly to the state variables.
- The component uses `$effect` blocks to react to changes in the state variables and trigger side effects, such as fetching courses based on the selected educational focus.
- The `triggerContent` derived state variable dynamically determines the text displayed in the "Year of Study" select trigger based on the `eduFocus` value.
- The layout uses responsive utility classes (e.g., `md:w-[280px]`) to adapt to different screen sizes.
- The `fields`, `years`, and `grades` variables are imported from a configuration file (`../config.js`), allowing for easy modification of the available options without changing the component's code.

## TODO

[ ] Implement error handling and user feedback for API calls (e.g., displaying an error message if fetching courses fails).
[ ] Add validation to the settings form to ensure that all required fields are filled.

[ ] Implement a confirmation dialog before saving changes to the settings.
[ ] Consider adding more customizable settings options, such as notification preferences or theme selection.
[ ] Implement a "Reset to Defaults" button to revert all settings to their default values.
[ ] Add accessibility attributes (ARIA roles, labels) to improve the screen reader experience.
```

---



## study-plan

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

---



## topic.old

```markdown
# Reference: Topic Detail Screen

## Goal
The Topic Detail Screen displays detailed content for a specific topic within a course, including text, videos, and links to related resources like textbooks and quizzes.

## API Functions and State

- **API Functions:**
  - `getTopicData(courseId: string, filename: string)`: Fetches the topic's content from the server.

- **State Variables:**
  - `params`: (From `$props()`) Contains route parameters, specifically `courseId` and `filename` to identify the topic.
  - `topicData: TopicData | null`: Stores the fetched topic data. Initialized to `null` and updated when the API call completes.
  - `activeTab: "main" | "videos"`: Controls which tab is currently displayed ("main" for content, "videos" for related videos). Defaults to "main".
  - `videos`: An array of video objects with information about each video. In a real application, this will likely be fetched from the API along with the topic data.

## UI Description

The Topic Detail Screen is divided into several key sections:

1.  **Top Bar (Blue Background):**
    *   `Background`: A `div` with a blue background (`bg-blue-500`) and rounded bottom corners (`rounded-b-3xl`).
    *   `Back Button`:
        *   A button that navigates the user back to the previous page using `history.back()`.
        *   Displays a white `<ArrowLeft>` icon.
    *   `Course Title`:
        *   An `<h1>` element displaying the course title ("Linear Algebra II").
        *   Styled with white, bold text.
    *   `Start Quiz Button`:
        *   A "ghost" style `<Button>` that navigates the user to a quiz related to the topic.
        *   Displays a `<Play>` icon.
    *   `Tab Navigation (Home, Videos, Textbook)`:
        *   A `div` containing three `<button>` elements for tab selection.
        *   `Home`: Sets `activeTab` to "main" to show the topic content.
        *   `Videos`: Sets `activeTab` to "videos" to show related videos.
        *   `Textbook`: Calls `openTextbook()` function, which currently only logs a message to the console. Styling: the currently active tab will be highlighted by white text on blue background. All buttons are styled with rounded corners.

2.  **Main Content Area (White Background):**
    *   `Background`: A `div` with a white background (`bg-white`) and rounded top corners (`rounded-t-3xl`).
    *   `Conditional Content based on activeTab`: The content displayed changes based on the value of `activeTab`. It utilizes Svelte's `{#if}` and `{:else if}` blocks to render different sections. Also utilizes `in:fade` for smooth transitions.
    *   `Main Tab (activeTab === "main")`:
        *   `Loading State (topicData === null)`: Displays a series of `<Skeleton>` components to indicate that the topic data is loading. Includes:
            *   A skeleton for a "fun fact" banner.
            *   Skeletons for the topic title, next topic title, and related content.
        *   `Content Display (topicData !== null)`: Displays the actual content of the topic. Includes:
            *   Injects the topic content, which is expected to be HTML including the relevant CSS, into the page using `{@html \`${styles}${topicData?.content}\`}`. Styles from the `<style>` tag named `styles` are added to allow for formatting of the dynamic HTML.
            *   A "Next Topic" `<Card>` that displays a link to the next topic in the course.
            *   A "Textbook" `<Card>` with a link to open the textbook.
    *   `Videos Tab (activeTab === "videos")`:
        *   `Loading State (topicData === null)`: Displays a grid of `<Skeleton>` components, simulating video previews, to indicate that the video data is loading.
        *   `Video List (topicData !== null)`:
            *   Displays a grid of video previews.
            *   Each video preview includes:
                *   A thumbnail image.
                *   The video title (truncated to two lines using `line-clamp-2`).
                *   The channel title with a `<Video>` icon.
                *   The video duration displayed on the bottom right corner of the thumbnail.
            *   Clicking a video preview calls the `openVideo(video.videoId)` function, which currently only logs the video ID to the console.
    *   `Report and Quiz Buttons (Always visible)`:
        *   A `div` containing two buttons.
        *   `Report Button`:
            *   An "outline" style `<Button>` that allows the user to report an issue with the topic.
            *   Displays a red `<Flag>` icon.
            *   Navigates to the "/report" route when clicked using the `push` function from `$app/navigation` (not directly visible in the code but assumed to be available).
        *   `Start Quiz Button`:
            *   A default style `<Button>` that navigates the user to a quiz related to the topic.
            *   Displays a `<Play>` icon.

## Navigation

-   **Outgoing Navigation:**
    -   Back Button: Navigates to the previous page in the browser history. Context: User wants to return to the previous screen.
    -   Start Quiz Button (Top Right): Navigates to the quiz page. Context: User wants to test their knowledge of the topic.
    -   "Next Topic" Card: Navigates to the next topic detail page. Context: User wants to continue learning within the course.
    -   "Textbook" Card: Navigates to the textbook resource. Context: User wants to reference the textbook for additional information.
    -   Report Button: Navigates to the report issue page ("/report"). Context: User wants to report an issue.
    -   Video preview: Clicks on a single video and the `openVideo` function will attempt to open the video on a player, or redirect to a new page.

## Special Notes

-   The component uses Svelte's `$state` for reactive state management.
-   The component uses `onMount` to fetch topic data when the component is mounted.
-   The HTML content of the topic is dynamically injected using the `{@html}` tag. This can be a security risk if the content is not properly sanitized.
-   The component uses `transition:fade` to animate the transition between the "main" and "videos" tabs.
-   The `openTextbook` and `openVideo` functions are currently placeholders and need to be implemented with actual navigation logic.
-   The video data is currently hardcoded and should be fetched from an API in a real application.
-   The styling of the HTML content is applied using a CSS string injected into the page. This approach can be improved by using CSS Modules or a similar approach for better style isolation.
-   The `push` function used by report button comes from `$app/navigation` which is not directly importable.
-   The `params` prop comes from `use:page`, which needs to be added to the script tag in order to resolve `params.courseId` and `params.filename`

## TODO

[ ] Implement the actual navigation logic for the `openTextbook` function.
[ ] Implement the actual navigation logic for the `openVideo` function to open a dedicated video player page.
[ ] Implement proper sanitization of the HTML content fetched from the `topicData`.
[ ] Fetch the video data from an API instead of using hardcoded data.

[ ] Implement error handling for API calls (e.g., display an error message if the topic data cannot be fetched).
[ ] Refactor the CSS styling to use CSS Modules or a similar approach for better style isolation.
[ ] Add accessibility attributes (ARIA) to improve accessibility for users with disabilities.
[ ] Implement a more robust loading state for the video tab, potentially showing skeletons for a larger number of videos.
[ ] Make the video grid responsive to different screen sizes.
[ ] Consider adding pagination or infinite scrolling to the video list if there are a large number of videos.
[ ] Improve the UI/UX of the tab navigation, possibly using a more visually appealing tab component.
[ ] Allow the user to configure the `qtypes` settings in a setting page instead of hardcoding it.
```

---



## topic

```reference.md
# Screen Reference: Topic Detail Screen

## Goal
Display detailed information about a specific topic, including slides, videos, and navigation to related content.

## API Functions and State

- **API Functions:**
  - `getTopicData(courseId, filename)`: Fetches topic data from the server based on the provided course ID and filename.

- **State Variables:**
  - `params`:  An object containing route parameters, specifically `courseId` and `filename` to identify the topic.
  - `topicData`:  Stores the fetched `TopicData` object, initially `null` until the API call completes.
  - `funfactIndex`:  Index to track the currently displayed fun fact from the `topicData.funfacts` array, initialized to 0.
  - `slideIndex`: Index to track the currently displayed slide from the `topicData.slides` array, initialized to 7.
  - `difficultyLabel`:  A derived state that converts the `topicData.difficulty` number into a user-friendly string ("Easy," "Medium," or "Challenging").
  - `activeTab`: String state that switches view between `main` and `videos` view

## UI Description

The screen is divided into two main sections: a header and a content area.

**1. Header (Blue Background):**

-   **Back Button:**
    -   Uses the `ArrowLeft` icon from `lucide-svelte`.
    -   Navigates the user back to the previous page using `history.back()`.
    -   Positioned on the left side of the header.
-   **Tab Buttons:**
    -   A row of buttons, implemented with `<button>` tags, to switch between content views.
    -   **Slides Button:**
        -   When active (`activeTab === 'main'`), it has a white background and blue text. Otherwise, it has a blue background and white text.
        -   Clicking it sets `activeTab = "main"`, displaying the slides content.
        -   Displays "Slides" text.
    -   **Videos Button:**
        -   When active (`activeTab === 'videos'`), it has a white background and blue text. Otherwise, it has a blue background and white text.
        -   Clicking it sets `activeTab = "videos"`, displaying the videos content.
        -   Displays "Videos" text.
    -   **Quiz Button:**
        -   Triggers the `startQuiz` function when clicked.
        -   Has a blue background and white text.
        -   Displays "Quiz" text.

**2. Content Area (White Background):**

The content displayed depends on the value of `activeTab`. A `fade` transition is used when switching between the `main` and `videos` tabs.

*   **`activeTab === "main"` (Slides View):**

    -   **Loading State (Skeleton):**
        -   If `topicData` is `null` (while data is being fetched), a series of `Skeleton` components are displayed as placeholders. These simulate the layout of the actual content.
        -   Includes skeletons for the title, short paragraphs, and larger text blocks.

    -   **Topic Data Display (after loading):**
        -   A container for displaying the topic content. `overflow-y-auto` makes the container scrollable vertically.

        -   **Topic Metadata (if `slideIndex == 0`):**
            -   **Duration Badge:**
                -   Displays the topic duration using the `Clock` icon and `topicData.duration`.
                -   Styled with a green background and text.
            -   **Difficulty Badge:**
                -   Displays the topic difficulty using the `Flag` icon and the `difficultyLabel` (derived state).
                -   Styled with an orange background and text.
            -   **Blooms Levels:**
                -   Displays first two blooms levels in blue badges

        -   **Slide Content:**
            -   Dynamically renders the content of the current slide using `{@html ...}`.
            -   The slide content is taken from `topicData.slides[slideIndex].slideContent`.
            -   Includes a dynamically injected `<style>` block to style the HTML content of the slides.  This includes styling for headings, paragraphs, lists, definitions, notes, examples, math, code, tables, and horizontal rules.

        -   **Report Button (if `slideIndex` is the last slide):**
            -   Uses the `Flag` icon.
            -   Triggers the `report` function when clicked.
            -   Styled as an outline button with red text.

        -   **Next Topic Card (if `slideIndex` is the last slide):**
            -   Displays a card with information about the next topic.
            -   Uses a blue background and text for the "Next Topic" label.
            -   Displays the title of the next topic (`topicData.nextTopic.title`).
            -   Includes a "Open" button that triggers the `nextTopic` function when clicked and navigates to the next topic. Uses `ArrowRight` icon.

        -   **Navigation Buttons:**
            -   A `div` containing the navigation buttons.
            -   **Previous Topic/Slide Button:**
                -   If `slideIndex` is 0, displays a "Previous Topic" button that calls the `prevTopic` function, using `ArrowLeft` icon.
                -   If `slideIndex` is greater than 0, displays a previous slide button that decrements the `slideIndex` (using Math.max to ensure it doesn't go below 0), using `ArrowLeft` icon.
            -   **Slide Counter:**
                -   Displays the current slide number and the total number of slides.
            -   **Next Slide Button:**
                -   If `slideIndex` is not the last slide, displays a next slide button that increments the `slideIndex` (using Math.min to ensure it doesn't exceed the last slide's index), using `ArrowRight` icon.

*   **`activeTab === "videos"` (Videos View):**

    -   **Fade Transition:**
        -   Uses the `fade` transition from Svelte to provide a smooth transition when switching to this tab.

    -   **Recommended Videos Section:**
        -   A heading "Recommended Videos".

        -   **Fun Fact Display:**
            -   Displays a fun fact related to the topic.
            -   Shows "Fun Fact:" in bold.
            -   Displays the current fun fact from `topicData.funfacts[funfactIndex]`.
            -   Includes a "More" button that triggers the `nextFunfact` function when clicked. Underlined text.

        -   **Video Grid:**
            -   A grid layout to display the recommended videos.
            -   **Loading State (Skeleton):**
                -   If `topicData` is `null`, displays a series of `Skeleton` components as placeholders for the videos.
            -   **Video Display (after loading):**
                -   Iterates over the `topicData.videos` array.
                -   For each video:
                    -   A button with a white background, rounded corners, and a shadow.
                    -   When the button is clicked, it calls the `openVideo` function, passing in the `video.videoId`.
                    -   **Video Thumbnail:**
                        -   Displays the video thumbnail using an `<img>` tag.
                        -   The `src` attribute is set to `video.thumbnails[0]`.
                        -   The `alt` attribute is set to `video.videoTitle`.
                    -   **Video Duration:**
                        -   Displays the video duration in the bottom right corner of the thumbnail.
                        -   Styled with a semi-transparent black background and white text.
                    -   **Video Title:**
                        -   Displays the video title using an `<h3>` tag.
                        -   The title is truncated to two lines using `line-clamp-2`.
                    -   **Channel Title:**
                        -   Displays the channel title using a `<p>` tag.
                        -   Includes a `Video` icon from `lucide-svelte`.

## Navigation

-   **Back Navigation:** Clicking the back button in the header navigates to the previous page in the browser history.
-   **Next/Previous Topic:**  Clicking the "Previous Topic" or "Next Topic" buttons navigates to the corresponding topic using `svelte-spa-router`'s `push` function. The route is constructed as `/topic/${params.courseId}/${topicData?.prevTopic?.filename}` or `/topic/${params.courseId}/${topicData?.nextTopic?.filename}`, respectively.
-   **Quiz Navigation:** Clicking the "Quiz" button navigates to the "/select-topics" route using `svelte-spa-router`'s `push` function. It sets the `tempstate.quiz` object to prepare for the quiz. `tempstate.quiz.courseId` will be equal to the current `params.courseId`.  `tempstate.quiz.topics` will be the filename of the current topic.
-   **Video Navigation:**  Clicking a video navigates to the video's YouTube page using the `navigateToLink` utility function.
-   **Report Navigation:** Clicking the "Report Feedback" navigates to the "/report" route using `svelte-spa-router`'s `push` function. It sets the `tempstate.report` to send data about what topic the report is for.

## Special Notes

-   The `<style>` block is dynamically injected into the component to style the HTML content of the slides.
-   The `fade` transition is used to provide a smooth transition when switching between tabs.
-   The `Skeleton` components are used to provide a loading state while the data is being fetched.
-   `tempstate` is used to pass data between screens and is not persisted.  `permstate` is persisted in local storage.
-   The `navigateToLink` function is used to open the YouTube video in a new tab or window.
-   The component uses `svelte-spa-router`'s `push` function for internal navigation.
-   The initial `slideIndex` is set to 7 for some reason (probably for testing purposes).

## TODO

[ ] Move the injected styles to a separate CSS file or Svelte component for better maintainability.
[ ] Use a more robust method for handling HTML content that might contain potentially harmful code.
[ ] Implement error handling for the `getTopicData` API call.
[ ] Consider using a dedicated YouTube component to display the videos, allowing for more control and customization.
[ ] Persist the `slideIndex` in local storage or a similar mechanism to maintain the user's progress.

[ ] Implement server-side rendering (SSR) for improved SEO and initial load performance.
[ ] Add support for different video resolutions and qualities.
[ ] Consider adding a feature to allow users to save topics for later viewing.
[ ] Add accessibility features, such as keyboard navigation and screen reader support.
[ ] Refactor the UI to be more responsive and adapt to different screen sizes.
[ ] Evaluate the intial `slideIndex` for correctness
```

---

