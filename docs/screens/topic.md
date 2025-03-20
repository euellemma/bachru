```reference.md
# Screen Reference: Topic Detail Screen

## Goal
Display detailed information about a specific topic, including slides, videos, and navigation to related content.

## API Functions and State

- **API Functions:**
  - `getTopicData(courseId, filename)`: Fetches topic data from the server based on the provided course ID and filename.

- **State Variables:**
  - `params`:  An object containing route parameters, specifically `courseId` and `filename` to identify the topic.
  - `topicData`:  Stores the fetched `TopicData` object, initially `null` until the API call completes.
  - `funfactIndex`:  Index to track the currently displayed fun fact from the `topicData.funfacts` array, initialized to 0.
  - `slideIndex`: Index to track the currently displayed slide from the `topicData.slides` array, initialized to 7.
  - `difficultyLabel`:  A derived state that converts the `topicData.difficulty` number into a user-friendly string ("Easy," "Medium," or "Challenging").
  - `activeTab`: String state that switches view between `main` and `videos` view

## UI Description

The screen is divided into two main sections: a header and a content area.

**1. Header (Blue Background):**

-   **Back Button:**
    -   Uses the `ArrowLeft` icon from `lucide-svelte`.
    -   Navigates the user back to the previous page using `history.back()`.
    -   Positioned on the left side of the header.
-   **Tab Buttons:**
    -   A row of buttons, implemented with `<button>` tags, to switch between content views.
    -   **Slides Button:**
        -   When active (`activeTab === 'main'`), it has a white background and blue text. Otherwise, it has a blue background and white text.
        -   Clicking it sets `activeTab = "main"`, displaying the slides content.
        -   Displays "Slides" text.
    -   **Videos Button:**
        -   When active (`activeTab === 'videos'`), it has a white background and blue text. Otherwise, it has a blue background and white text.
        -   Clicking it sets `activeTab = "videos"`, displaying the videos content.
        -   Displays "Videos" text.
    -   **Quiz Button:**
        -   Triggers the `startQuiz` function when clicked.
        -   Has a blue background and white text.
        -   Displays "Quiz" text.

**2. Content Area (White Background):**

The content displayed depends on the value of `activeTab`. A `fade` transition is used when switching between the `main` and `videos` tabs.

*   **`activeTab === "main"` (Slides View):**

    -   **Loading State (Skeleton):**
        -   If `topicData` is `null` (while data is being fetched), a series of `Skeleton` components are displayed as placeholders. These simulate the layout of the actual content.
        -   Includes skeletons for the title, short paragraphs, and larger text blocks.

    -   **Topic Data Display (after loading):**
        -   A container for displaying the topic content. `overflow-y-auto` makes the container scrollable vertically.

        -   **Topic Metadata (if `slideIndex == 0`):**
            -   **Duration Badge:**
                -   Displays the topic duration using the `Clock` icon and `topicData.duration`.
                -   Styled with a green background and text.
            -   **Difficulty Badge:**
                -   Displays the topic difficulty using the `Flag` icon and the `difficultyLabel` (derived state).
                -   Styled with an orange background and text.
            -   **Blooms Levels:**
                -   Displays first two blooms levels in blue badges

        -   **Slide Content:**
            -   Dynamically renders the content of the current slide using `{@html ...}`.
            -   The slide content is taken from `topicData.slides[slideIndex].slideContent`.
            -   Includes a dynamically injected `<style>` block to style the HTML content of the slides.  This includes styling for headings, paragraphs, lists, definitions, notes, examples, math, code, tables, and horizontal rules.

        -   **Report Button (if `slideIndex` is the last slide):**
            -   Uses the `Flag` icon.
            -   Triggers the `report` function when clicked.
            -   Styled as an outline button with red text.

        -   **Next Topic Card (if `slideIndex` is the last slide):**
            -   Displays a card with information about the next topic.
            -   Uses a blue background and text for the "Next Topic" label.
            -   Displays the title of the next topic (`topicData.nextTopic.title`).
            -   Includes a "Open" button that triggers the `nextTopic` function when clicked and navigates to the next topic. Uses `ArrowRight` icon.

        -   **Navigation Buttons:**
            -   A `div` containing the navigation buttons.
            -   **Previous Topic/Slide Button:**
                -   If `slideIndex` is 0, displays a "Previous Topic" button that calls the `prevTopic` function, using `ArrowLeft` icon.
                -   If `slideIndex` is greater than 0, displays a previous slide button that decrements the `slideIndex` (using Math.max to ensure it doesn't go below 0), using `ArrowLeft` icon.
            -   **Slide Counter:**
                -   Displays the current slide number and the total number of slides.
            -   **Next Slide Button:**
                -   If `slideIndex` is not the last slide, displays a next slide button that increments the `slideIndex` (using Math.min to ensure it doesn't exceed the last slide's index), using `ArrowRight` icon.

*   **`activeTab === "videos"` (Videos View):**

    -   **Fade Transition:**
        -   Uses the `fade` transition from Svelte to provide a smooth transition when switching to this tab.

    -   **Recommended Videos Section:**
        -   A heading "Recommended Videos".

        -   **Fun Fact Display:**
            -   Displays a fun fact related to the topic.
            -   Shows "Fun Fact:" in bold.
            -   Displays the current fun fact from `topicData.funfacts[funfactIndex]`.
            -   Includes a "More" button that triggers the `nextFunfact` function when clicked. Underlined text.

        -   **Video Grid:**
            -   A grid layout to display the recommended videos.
            -   **Loading State (Skeleton):**
                -   If `topicData` is `null`, displays a series of `Skeleton` components as placeholders for the videos.
            -   **Video Display (after loading):**
                -   Iterates over the `topicData.videos` array.
                -   For each video:
                    -   A button with a white background, rounded corners, and a shadow.
                    -   When the button is clicked, it calls the `openVideo` function, passing in the `video.videoId`.
                    -   **Video Thumbnail:**
                        -   Displays the video thumbnail using an `<img>` tag.
                        -   The `src` attribute is set to `video.thumbnails[0]`.
                        -   The `alt` attribute is set to `video.videoTitle`.
                    -   **Video Duration:**
                        -   Displays the video duration in the bottom right corner of the thumbnail.
                        -   Styled with a semi-transparent black background and white text.
                    -   **Video Title:**
                        -   Displays the video title using an `<h3>` tag.
                        -   The title is truncated to two lines using `line-clamp-2`.
                    -   **Channel Title:**
                        -   Displays the channel title using a `<p>` tag.
                        -   Includes a `Video` icon from `lucide-svelte`.

## Navigation

-   **Back Navigation:** Clicking the back button in the header navigates to the previous page in the browser history.
-   **Next/Previous Topic:**  Clicking the "Previous Topic" or "Next Topic" buttons navigates to the corresponding topic using `svelte-spa-router`'s `push` function. The route is constructed as `/topic/${params.courseId}/${topicData?.prevTopic?.filename}` or `/topic/${params.courseId}/${topicData?.nextTopic?.filename}`, respectively.
-   **Quiz Navigation:** Clicking the "Quiz" button navigates to the "/select-topics" route using `svelte-spa-router`'s `push` function. It sets the `tempstate.quiz` object to prepare for the quiz. `tempstate.quiz.courseId` will be equal to the current `params.courseId`.  `tempstate.quiz.topics` will be the filename of the current topic.
-   **Video Navigation:**  Clicking a video navigates to the video's YouTube page using the `navigateToLink` utility function.
-   **Report Navigation:** Clicking the "Report Feedback" navigates to the "/report" route using `svelte-spa-router`'s `push` function. It sets the `tempstate.report` to send data about what topic the report is for.

## Special Notes

-   The `<style>` block is dynamically injected into the component to style the HTML content of the slides.
-   The `fade` transition is used to provide a smooth transition when switching between tabs.
-   The `Skeleton` components are used to provide a loading state while the data is being fetched.
-   `tempstate` is used to pass data between screens and is not persisted.  `permstate` is persisted in local storage.
-   The `navigateToLink` function is used to open the YouTube video in a new tab or window.
-   The component uses `svelte-spa-router`'s `push` function for internal navigation.
-   The initial `slideIndex` is set to 7 for some reason (probably for testing purposes).

## TODO

[ ] Move the injected styles to a separate CSS file or Svelte component for better maintainability.
[ ] Use a more robust method for handling HTML content that might contain potentially harmful code.
[ ] Implement error handling for the `getTopicData` API call.
[ ] Consider using a dedicated YouTube component to display the videos, allowing for more control and customization.
[ ] Persist the `slideIndex` in local storage or a similar mechanism to maintain the user's progress.

[ ] Implement server-side rendering (SSR) for improved SEO and initial load performance.
[ ] Add support for different video resolutions and qualities.
[ ] Consider adding a feature to allow users to save topics for later viewing.
[ ] Add accessibility features, such as keyboard navigation and screen reader support.
[ ] Refactor the UI to be more responsive and adapt to different screen sizes.
[ ] Evaluate the intial `slideIndex` for correctness
```