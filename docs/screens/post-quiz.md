```md
## Goal
The Quiz Results Screen displays the user's performance on a completed quiz, showing their score, the number of correct answers, the time taken, and a performance message. It provides options to either create a study plan or attempt more questions.

## API Functions and State
- **API Functions:** None
- **State Variables:**
    - `count`: (Local Svelte State) Animated score counter that increments to the final score.
    - `correctAnswers`: (Local Svelte State, derived from `tempstate`) The number of correctly answered questions in the quiz.
    - `totalQuestions`: (Local Svelte State, derived from `tempstate`) The total number of questions in the quiz.
    - `timeTaken`: (Local Svelte State, derived from `tempstate`) The time taken to complete the quiz, in seconds.
    - `performanceMessage`: (Local Svelte State) A message indicating the user's performance level.
    - `tempstate`: (Global Svelte State, from `$lib/state.svelte`) Stores temporary application state, including the quiz results. Accessed to retrieve `quiz.questions` and `quiz.timeTook`.

## UI Description
The Quiz Results Screen is structured into two main sections: a top section displaying the results and a bottom section with action buttons.

**Top Section (Results Display):**
- **Background:** `bg-blue-500` (light blue)
- **Layout:** `flex flex-col flex-1 items-center justify-center` (vertically centered content)
- **Score Display:**
    - `Star` icon: `lucide-svelte` Star icon filled with yellow.  Visually represents achievement.
    - Score Value: `text-7xl font-bold text-white` (large, bold, white text) The animated score (`count`) is prominently displayed.
- **Performance Message:**
    - `text-3xl font-bold text-white` (large, bold, white text) Displays a dynamically generated message (e.g., "Outstanding!", "Good Work!") based on the percentage of correct answers. Uses the `getPerformanceMessage` function.
- **Metrics Display:**
    - Layout: `flex items-center justify-center gap-8 mt-8` (horizontal arrangement with spacing).
    - Correct Answers:
        - `CheckSquare` icon: `lucide-svelte` CheckSquare icon.
        - Text: `text-2xl font-bold text-white` Displays the number of correct answers out of the total number of questions (e.g., "8/10").
    - Time Taken:
        - `Clock` icon: `lucide-svelte` Clock icon.
        - Text: `text-2xl font-bold text-white` Displays the time taken to complete the quiz, formatted as `MM:SS` (e.g., "05:30"). Uses the `formatTime` function for formatting.

**Bottom Section (Action Buttons):**
- **Background:** `bg-white rounded-t-3xl` (white with rounded top corners).
- **Layout:** `flex-1 px-6 flex flex-col justify-center` (vertically centered content with horizontal padding).  `flex-1` allows this bottom section to fill the remaining available vertical space.
- **Content:** `w-4/5 mx-auto space-y-4` (content container with spacing between elements, centered horizontally).
    - **Create Study Plan Button:**
        - `Button` component: Custom `Button` component with `variant="primary"`.
        - Style: `bg-blue-500 text-white w-full py-6 text-lg` (blue background, white text, full width, large padding, large text).
        - Icon: `ClipboardList` icon from `lucide-svelte`. Placed to the left of the button text.
        - Functionality: On click, navigates to the `/study-plan` route using `svelte-spa-router`.
    - **More Questions Button:**
        - `Button` component: Custom `Button` component with `variant="ghost"`.
        - Style: `bg-blue-100 w-full py-6 text-lg` (light blue background, full width, large padding, large text).
        - Icon: `PlayCircle` icon from `lucide-svelte`. Placed to the left of the button text.
        - Functionality: On click, navigates to the `/select-topics` route using `svelte-spa-router`.

**Transitions:**
- The main `div` uses a `fade` transition for initial appearance.
- The bottom section uses a `fly` transition, sliding up from the bottom, upon the screen being rendered.

## Navigation
- **Outgoing:**
    - `/study-plan`: Navigated to when the "Create Study Plan" button is clicked. No specific context is passed, but the user's performance on the quiz is implicitly used to inform the study plan generated on that screen.
    - `/select-topics`: Navigated to when the "More Questions" button is clicked. No specific context is passed.

## Special Notes
- The `count` state variable is animated from 0 to the final score value using `requestAnimationFrame`. This provides a visual indication of the user's score increasing.
- The `getPerformanceMessage` function provides dynamic, encouraging feedback based on the user's performance percentage.
- The time is formatted using `formatTime` which pad with leading zeros.

## TODO
[ ] Investigate how to better handle state management for animations, possibly using Svelte's built-in animation features more directly.
[ ] Add error handling for cases where `tempstate.quiz` or its properties are undefined.
[ ] Ensure appropriate ARIA attributes are set for accessibility.

[ ] Consider persisting the score to the `permstate`.
[ ] Implement a "Review Quiz" button that allows users to go back through the questions and see their answers.
[ ] Add social sharing options to allow users to share their scores.
[ ] Implement adaptive difficulty based on quiz performance.
```