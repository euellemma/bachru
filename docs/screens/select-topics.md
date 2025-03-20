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