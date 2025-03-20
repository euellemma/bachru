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
