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