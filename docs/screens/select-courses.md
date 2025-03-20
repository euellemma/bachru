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
