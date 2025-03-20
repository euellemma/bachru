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