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