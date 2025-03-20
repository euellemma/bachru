```markdown
## Goal

The Quiz Screen displays individual questions from a quiz, handles user input, tracks progress, and provides feedback on answers. It manages navigation between questions and completion of the quiz, ultimately creating a study plan based on the user's performance.

## API Functions and State

**API Functions:**

*   None. This component primarily uses local state and navigation.

**State Variables:**

*   `currentQuestionIndex`: (State) The index of the current question being displayed. Initialized from route parameter `params.index`.
*   `currentProgress`: (State)  A number representing the user's progress through the quiz (percentage).
*   `showSolution`: (State) A boolean indicating whether the solution to the current question should be displayed.
*   `selectedAnswer`: (State) A string or null representing the user's selected answer for a multiple-choice question.
*   `isCorrect`: (State) A boolean or null indicating whether the user's selected answer is correct.
*   `solution`: (State) A string containing the solution text for the current question.
*   `seconds`: (State) A number representing the time elapsed during the quiz (in seconds).
*   `timerInterval`: (State) A number or null representing the interval ID for the timer.
*   `isPaused`: (State) A boolean indicating whether the timer is paused.
*   `tempstate`: (State - from `$lib/state.svelte`) Global state containing the quiz data (`tempstate.quiz`).
*   `permstate`: (State - from `$lib/state.svelte`) Global state to store quiz results, stars, and other user data.
*   `location`: (State - from `svelte-spa-router`) Used to access the current URL and trigger effects when it changes.
* `params`: (Props) A prop passed to the svelte component that indicates the index

## UI Description

The Quiz Screen's UI is driven by the `Question` component. The main component itself primarily handles state management, navigation, and logic related to quiz progression.

*   **`Question` Component:** This component is the central element of the UI.  It receives the following props:
    *   `question`: The question text to be displayed.  This is taken from `tempstate.quiz.questions[currentQuestionIndex].question`.
    *   `options`: An array of answer options for the question. The format depends on the question type (see `getQuestionOptions` function). Each option is an object with `value` and `text` properties.
    *   `solution`: The solution text for the question.  This is either directly the solution for the question or from `tempstate.quiz.questions[currentQuestionIndex].solution`
    *   `hint`: A hint for the current question, taken from  `tempstate.quiz.questions[currentQuestionIndex]?.hint`.
    *   `showSolution`: A boolean that determines whether the solution section of the `Question` component is visible.
    *   `selectedAnswer`: The user's selected answer, used to highlight the selection.
    *   `isCorrect`:  A boolean indicating if the selected answer is correct; used for visual feedback.
    *   `handleAnswerSelect`: A function called when the user selects an answer (for multiple-choice and true/false questions).
    *   `handleWorkoutAnswer`: A function called for "workout" type questions; takes a boolean (`gotItRight`) as input.
    *   `handleNext`: A function to advance to the next question.
    *   `currentProgress`: The current progress percentage through the quiz, displayed (likely) in a progress bar.
    *   `seconds`: The elapsed time during the quiz, displayed to the user.
    *   `goBack`: A function that navigates back to the previous page (using `window.history.back()`).
    *   `currentQuestionIndex`:  The index of the current question (used for display purposes, e.g., "Question 1 of 10").
    *   `showAnswerForWorkout`: A function used to display the answer for a workout type question.
    *   `handleDone`: A function called when the user wants to finish the quiz before answering all questions.
    *   `report`: A function to navigate to the report page for the current question.
    *   `questionType`:  The type of question (`multiple-choice`, `true-false`, or `workout`), determining the input method. Taken from `tempstate.quiz.questions[currentQuestionIndex].metadata.questionType`.
    *   `totalQuestions`: The total number of questions in the quiz.

*   **Conditional Rendering:** The entire UI is rendered conditionally based on `tempstate.quiz.questions.length > 0`. This ensures that the UI is only displayed if there are questions in the quiz.

*   **Question Display:** The `question` prop of the Question component is the main content that will get displayed

*   **Options Display:** The `options` prop is an array of option objects for each question that the user will use to select and answer the question

*   **Solution Display:** The `solution` prop is a string that will contain the correct answer for the question

*   **Progress Indicator:** The `currentProgress` prop will show the user how far they've come

*   **Time Display:** The `seconds` prop displays a basic timer that will continue to tick up unless the page is paused

*   **`getQuestionOptions(question: Question)` function:** This function determines the answer options based on the question type.
    *   For `multiple-choice` questions, it maps the `question.options` array to an array of objects with `value` (index) and `text` (option text) properties.
    *   For `true-false` questions, it returns a fixed array of two objects: `{ value: "true", text: "True" }` and `{ value: "false", text: "False" }`.
    *   For other question types, it returns an empty array.

*   **`startTimer()` function:** This function starts a timer that increments the `seconds` variable every second, only if the timer is not already running and the quiz is not paused.
*   **`updateProgress()` function:** This function updates the `currentProgress` variable based on the `currentQuestionIndex` and the total number of questions.
*   **`handleAnswerSelect(answer: string)` function:** This function handles the selection of an answer for multiple-choice or true/false questions. It:
    *   Sets `selectedAnswer` to the user's choice.
    *   Determines if the answer is correct by comparing it to `currentQuestion.metadata.correctAnswer`.
    *   Sets `isCorrect` accordingly.
    *   Sets `solution` to `currentQuestion.solution`.
    *   Sets `showSolution` to true to reveal the answer.
    *   Updates `tempstate.quiz.questions[currentQuestionIndex]` with user answer, correct/incorrect status, and marks question as answered
    *   Pauses the timer (`isPaused = true`).
    *   Scrolls the "solution" element into view after a short delay.
*   **`handleWorkoutAnswer(gotItRight: boolean)` function:** This function handles the result of a "workout" question. It:
    *   Sets `showSolution` to true.
    *   Sets `isCorrect` based on the `gotItRight` parameter.
     *   Updates `tempstate.quiz.questions[currentQuestionIndex]` with user answer, correct/incorrect status, and marks question as answered
    *   Updates `solution` to `tempstate.quiz.questions[currentQuestionIndex].solution`.
    *   Pauses the timer (`isPaused = true`).
    *   Calls `handleNext()` to advance to the next question.
*   **`handleNext()` function:** This function advances the quiz to the next question.  If it's the last question, it calls `finishQuiz()`. Otherwise, it:
    *   Increments `currentQuestionIndex`.
    *   Resets `selectedAnswer`, `showSolution`, `isCorrect`, and `solution`.
    *   Calls `updateProgress()`.
    *   Unpauses the timer (`isPaused = false`).
    *   Navigates to the next question using `push(`/quiz/${nextIndex}`)`.
*   **`handleDone()` function:** This function allows the user to finish the quiz early. It:
    *   Filters the questions array to only include answered questions.
    *   Calls `finishQuiz()`.
*   **`finishQuiz()` function:**  This function is called when the quiz is completed (either by answering all questions or by calling `handleDone()`).  It:
    *   Clears the timer interval.
    *   Stores the elapsed time (`seconds`) in `tempstate.quiz.timeTook`.
    *   Calls `createStudyPlan()` to generate a study plan based on the user's performance.
    *   Updates `permstate.quizResults` with the study plan.
    *   Calculates and awards stars based on the number of correct answers.
    *   Saves the updated `permstate` to local storage.
    *   Navigates to the "/post-quiz" route.
*   **`createStudyPlan()` function:** This function generates a study plan based on the quiz results.
    *   It calls `quizStudyPlan()` for "normal" and "exitexam" quiz types.
    *   It calls `matricStudyPlan()` for "matric" quiz types.
    *   `quizStudyPlan()`: Analyzes the user's performance on each topic in the quiz.
        *   Counts the number of correct and total questions for each topic.
        *   Calculates the percentage of correct answers for each topic.
        *   Categorizes topics into `strongTopics` (>= 70% correct) and `weakTopics` (< 70% correct).
        *   Sorts `weakTopics` by ascending percentage (worst first) and `strongTopics` by descending total questions (most first).
        *   Returns an object containing `strongTopics` and `weakTopics`.
*  **`report()` function:** This function handles the navigation to the Report screen for the currently displayed question
*   **`$effect(() => { ... })` block:** This effect reacts to changes in the `$location` variable (from `svelte-spa-router`).  It parses the question index from the URL and updates the `currentQuestionIndex` if necessary, ensuring that the displayed question matches the URL. This also resets related states.

## Navigation

*   **Outgoing:**
    *   `/quiz/:index`: Navigates to a specific question in the quiz. The `:index` parameter determines the question to display. Triggered by `handleNext()`.
        * Context: The next question index in the quiz.
    *   `/post-quiz`: Navigates to the post-quiz screen after completing the quiz. Triggered by `finishQuiz()`.
        *   Context:  Quiz completion, stores results and study plan.
    *   `/report`: Navigates to the report screen for the currently displayed question. Triggered by `report()`.
        *   Context: The current question's id and text are saved to state
    *   Back navigation (using `window.history.back()`): Navigates to the previous page in the browser's history. Triggered by `goBack()`.
        *   Context:  User wants to return to the previous screen.

## Special Notes

*   The component relies heavily on the `tempstate` and `permstate` global stores. Changes to these stores will affect the component's behavior.
*   The timer functionality uses `setInterval` and `clearInterval` to track the elapsed time. It's important to clear the interval when the component is unmounted or when the quiz is finished to prevent memory leaks.
*   The `$effect` block ensures that the `currentQuestionIndex` stays in sync with the URL, allowing users to navigate directly to specific questions using the URL.
*   The `quizStudyPlan()` function could be optimized to avoid redundant calculations.
*   The component assumes that the `tempstate.quiz` object is properly initialized with an array of questions before the component is rendered.
*   The component uses `scrollIntoView` to smoothly scroll to the solution section. This requires that the solution section has an ID of "solution".
*   The `save` function in `$lib/state.svelte` limits the size of certain arrays in `permstate` before saving to local storage. This is likely to prevent exceeding local storage limits.

[ ] Ensure all properties are passed to the `Question` component correctly and that changes to props trigger the correct updates.
[ ] Double-check the logic in `quizStudyPlan()` to ensure that the study plan is generated correctly based on the user's performance.
[ ] Confirm that the back navigation functions as expected in all scenarios.

[ ] Consider adding error handling for cases where `tempstate.quiz` is not properly initialized.
[ ] Implement `matricStudyPlan()` function.
[ ] Add unit tests to verify the component's behavior, especially the `getQuestionOptions()`, `handleAnswerSelect()`, `handleNext()`, and `finishQuiz()` functions.
[ ] Explore ways to improve the performance of the `quizStudyPlan()` function, especially for quizzes with a large number of questions and topics.
[ ] Consider adding a visual indicator to show the user which questions they have already answered.
[ ] Improve the timer display to show minutes and seconds.
[ ] Add a confirmation dialog before allowing the user to finish the quiz early using `handleDone()`.
[ ] Implement keyboard navigation for selecting answers.
```