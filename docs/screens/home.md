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
