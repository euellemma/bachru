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