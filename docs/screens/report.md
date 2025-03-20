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