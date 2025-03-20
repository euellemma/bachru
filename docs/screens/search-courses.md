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