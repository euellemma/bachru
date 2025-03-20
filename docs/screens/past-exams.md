```reference.md
# App Screen: Exam List

- **Goal**: Display a list of available exams (Exit Exams or Matriculation Exams) based on the user's preferred exam type, allowing the user to navigate to a specific exam.

- **API Functions and State**:
  - `getExitExams()`: Fetches a list of exit exams from the API.
  - `getMatricExams()`: Fetches a list of matriculation exams from the API.
  - `permstate`: A Svelte store holding persistent application state, including:
    - `permstate.userInfo?.examFocus`:  String indicating the user's preferred exam type ("exitexam" or "matric"). Defaults to "exitexam".
    - `permstate.exitExams`: Array of `ExitExam` objects.
    - `permstate.matricExams`: Array of `MatricExam` objects.
    - `permstate.exitExamProgress`:  Record storing the progress of each exit exam, keyed by examId.  Each examId maps to a record storing course progress data, keyed by courseId, which maps to an array of strings representing the user's answers for each question in that course.  If an answer is `undefined`, it means the question hasn't been answered yet.
    - `permstate.matricExamProgress`: Record storing the progress of each matric exam, keyed by examId. Each examId maps to a record storing subject progress data, keyed by subjectId, which maps to a record storing chapter progress data, keyed by chapterId. This chapterId record maps to an array of strings representing the user's answers for each question in that chapter. If an answer is `undefined`, it means the question hasn't been answered yet.
  - `save(permstate)`: Function to save the `permstate` to local storage.
  - `examFocus`: A state variable indicating the type of exams to show ("exitexam" or "matric").
  - `loading`: A boolean state variable indicating whether the exam data is currently being fetched.

- **UI Description**:
  - **Container (`div.container`)**: The outermost container provides basic styling and padding.  It's responsible for the overall layout of the screen. It has `bg-accent` set as the background color.
  - **Header (`div.flex`)**: Contains an "ArrowLeft" icon and a title indicating the type of exams being displayed.
    - **ArrowLeft (`lucide-svelte` component)**: An arrow icon, presumably intended for navigation back to the previous screen.  Currently, it's non-functional.
    - **Title (`span.text-2xl`)**:  Displays "Exit Exams" or "Matriculation Exams" based on the `examFocus` state.
  - **Exam Grid (`div.grid`)**: A grid layout to display the list of exams. It uses CSS grid classes to adjust the number of columns based on the screen size (1 column on small screens, 2 on medium, 3 on large).
    - **Loading State**:
      - When `loading` is true, a series of skeleton loaders are displayed.
      - **Skeleton Loader (`div.card`)**:  A placeholder card with skeleton elements to indicate that the exam data is still loading. It uses `ui/skeleton` components, which are likely custom components to create a shimmer loading effect.  There are six of these cards displayed. Each skeleton card has a title skeleton, a progress skeleton bar, and a smaller text skeleton.
    - **Exam List**:
      - When `loading` is false, the list of exams is displayed based on the `examFocus` state. It iterates through `permstate.exitExams` or `permstate.matricExams`.
      - **Exam Card (`button.card`)**: A button that represents a single exam.
        - **Card Header (`div.card-header`)**: Contains the exam title and progress information.
          - **Exam Title (`h2.text-xl`)**: Displays the title of the exam (`exam.examTitle`).
          - **Progress Text (`span.text-gray-700`)**: Shows the progress of the exam, displaying the number of completed questions out of the total number of questions. The counts are dynamically calculated through the `calculateExitExamProgress` or `calculateMatricExamProgress` functions depending on the exam type.
        - **Card Content (`div.card-content`)**: Contains a progress bar visualizing the exam progress.
          - **Progress Bar Container (`div.w-full`)**: The outer container for the progress bar, styled with a light gray background and rounded corners.
          - **Progress Bar (`div.bg-blue-400`)**: The actual progress bar, filled with a blue color. Its width is dynamically set based on the calculated progress percentage using inline styling. The width style is `width: {progress.totalQuestions ? (progress.completedQuestions / progress.totalQuestions) * 100 : 0}%`.  This calculates the percentage of completed questions and sets the width of the blue bar accordingly.

  - **calculateExitExamProgress(examId: string)**: Calculates the progress of a specific exit exam.
    - It finds the exam based on the `examId` within `permstate.exitExams`.
    - It retrieves progress data for the exam from `permstate.exitExamProgress`.
    - It iterates through the `courses` within the exam.
    - For each course, it retrieves the user's answers from the `progressData` which is `permstate.exitExamProgress?.[examId] || {}`.
    - It counts the total questions and the number of answered questions.
    - It returns an object containing the `completedQuestions` and `totalQuestions`.

  - **calculateMatricExamProgress(examId: string)**: Calculates the progress of a specific matric exam.
    - It finds the exam based on the `examId` within `permstate.matricExams`.
    - It retrieves the progress data for the exam from `permstate.matricExamProgress`.
    - It iterates through the `subjects` within the exam.
    - For each subject, it iterates through the `chapters`.
    - For each chapter, it retrieves the user's answers from the `subjectProgress` data, which is `permstate.matricExamProgress?.[examId]?.[subjectId] || {}`.
    - It counts the total questions and the number of answered questions.
    - It returns an object containing the `completedQuestions` and `totalQuestions`.

- **Navigation**:
  - Clicking on an exam card navigates to the exam details page.
    - If `examFocus` is "exitexam", it navigates to `/exitexam/{exam.examId}`.
    - If `examFocus` is "matric", it navigates to `/matric/{exam.examId}/{matricExam.subjects[0].subjectId}` if the exam has subjects, selecting the first subject by default.  If the exam has no subjects, it navigates to `/matric/{exam.examId}`.

- **Special Notes**:
  - The component fetches exam data on mount and merges it with existing data in `permstate` to prevent duplicates.  It uses `examId` as the unique identifier for exams.
  - The component uses skeleton loaders to provide a better user experience while the exam data is loading.
  - The component handles cases where the exam data is not available in `permstate` or when the API request fails.
  - Exam progress is calculated based on the data stored in `permstate.exitExamProgress` and `permstate.matricExamProgress`.
  - The component uses the `svelte-spa-router` library for navigation.
  -  The progress calculation involves nested iteration through courses and questions for `exitexam` and subjects, chapters, and questions for `matric` exams. Careful consideration is required for performance when dealing with a large number of courses, subjects, or questions.

- **TODO**:
[ ] Add functionality to the ArrowLeft icon to navigate back to the previous screen.
[ ] Implement error handling to display user-friendly messages when API requests fail or data is missing.

[ ] Consider adding pagination or infinite scrolling for a large number of exams.
[ ] Implement a more robust caching strategy for exam data to reduce API requests.
[ ] Add search/filtering functionality to easily find specific exams.
[ ] Allow users to switch between different exam types (e.g., from Exit Exams to Matriculation Exams) directly on this screen.
[ ] Explore using virtual lists for rendering the exam list, especially for performance with long lists of exams.
[ ] Add the ability to select specific subjects for `matric` exams upon navigation instead of automatically using the first subject.
[ ] Add a "Last Updated" timestamp for exams, indicating when the exam data was last fetched.
```