```markdown
# Reference: Topic Detail Screen

## Goal
The Topic Detail Screen displays detailed content for a specific topic within a course, including text, videos, and links to related resources like textbooks and quizzes.

## API Functions and State

- **API Functions:**
  - `getTopicData(courseId: string, filename: string)`: Fetches the topic's content from the server.

- **State Variables:**
  - `params`: (From `$props()`) Contains route parameters, specifically `courseId` and `filename` to identify the topic.
  - `topicData: TopicData | null`: Stores the fetched topic data. Initialized to `null` and updated when the API call completes.
  - `activeTab: "main" | "videos"`: Controls which tab is currently displayed ("main" for content, "videos" for related videos). Defaults to "main".
  - `videos`: An array of video objects with information about each video. In a real application, this will likely be fetched from the API along with the topic data.

## UI Description

The Topic Detail Screen is divided into several key sections:

1.  **Top Bar (Blue Background):**
    *   `Background`: A `div` with a blue background (`bg-blue-500`) and rounded bottom corners (`rounded-b-3xl`).
    *   `Back Button`:
        *   A button that navigates the user back to the previous page using `history.back()`.
        *   Displays a white `<ArrowLeft>` icon.
    *   `Course Title`:
        *   An `<h1>` element displaying the course title ("Linear Algebra II").
        *   Styled with white, bold text.
    *   `Start Quiz Button`:
        *   A "ghost" style `<Button>` that navigates the user to a quiz related to the topic.
        *   Displays a `<Play>` icon.
    *   `Tab Navigation (Home, Videos, Textbook)`:
        *   A `div` containing three `<button>` elements for tab selection.
        *   `Home`: Sets `activeTab` to "main" to show the topic content.
        *   `Videos`: Sets `activeTab` to "videos" to show related videos.
        *   `Textbook`: Calls `openTextbook()` function, which currently only logs a message to the console. Styling: the currently active tab will be highlighted by white text on blue background. All buttons are styled with rounded corners.

2.  **Main Content Area (White Background):**
    *   `Background`: A `div` with a white background (`bg-white`) and rounded top corners (`rounded-t-3xl`).
    *   `Conditional Content based on activeTab`: The content displayed changes based on the value of `activeTab`. It utilizes Svelte's `{#if}` and `{:else if}` blocks to render different sections. Also utilizes `in:fade` for smooth transitions.
    *   `Main Tab (activeTab === "main")`:
        *   `Loading State (topicData === null)`: Displays a series of `<Skeleton>` components to indicate that the topic data is loading. Includes:
            *   A skeleton for a "fun fact" banner.
            *   Skeletons for the topic title, next topic title, and related content.
        *   `Content Display (topicData !== null)`: Displays the actual content of the topic. Includes:
            *   Injects the topic content, which is expected to be HTML including the relevant CSS, into the page using `{@html \`${styles}${topicData?.content}\`}`. Styles from the `<style>` tag named `styles` are added to allow for formatting of the dynamic HTML.
            *   A "Next Topic" `<Card>` that displays a link to the next topic in the course.
            *   A "Textbook" `<Card>` with a link to open the textbook.
    *   `Videos Tab (activeTab === "videos")`:
        *   `Loading State (topicData === null)`: Displays a grid of `<Skeleton>` components, simulating video previews, to indicate that the video data is loading.
        *   `Video List (topicData !== null)`:
            *   Displays a grid of video previews.
            *   Each video preview includes:
                *   A thumbnail image.
                *   The video title (truncated to two lines using `line-clamp-2`).
                *   The channel title with a `<Video>` icon.
                *   The video duration displayed on the bottom right corner of the thumbnail.
            *   Clicking a video preview calls the `openVideo(video.videoId)` function, which currently only logs the video ID to the console.
    *   `Report and Quiz Buttons (Always visible)`:
        *   A `div` containing two buttons.
        *   `Report Button`:
            *   An "outline" style `<Button>` that allows the user to report an issue with the topic.
            *   Displays a red `<Flag>` icon.
            *   Navigates to the "/report" route when clicked using the `push` function from `$app/navigation` (not directly visible in the code but assumed to be available).
        *   `Start Quiz Button`:
            *   A default style `<Button>` that navigates the user to a quiz related to the topic.
            *   Displays a `<Play>` icon.

## Navigation

-   **Outgoing Navigation:**
    -   Back Button: Navigates to the previous page in the browser history. Context: User wants to return to the previous screen.
    -   Start Quiz Button (Top Right): Navigates to the quiz page. Context: User wants to test their knowledge of the topic.
    -   "Next Topic" Card: Navigates to the next topic detail page. Context: User wants to continue learning within the course.
    -   "Textbook" Card: Navigates to the textbook resource. Context: User wants to reference the textbook for additional information.
    -   Report Button: Navigates to the report issue page ("/report"). Context: User wants to report an issue.
    -   Video preview: Clicks on a single video and the `openVideo` function will attempt to open the video on a player, or redirect to a new page.

## Special Notes

-   The component uses Svelte's `$state` for reactive state management.
-   The component uses `onMount` to fetch topic data when the component is mounted.
-   The HTML content of the topic is dynamically injected using the `{@html}` tag. This can be a security risk if the content is not properly sanitized.
-   The component uses `transition:fade` to animate the transition between the "main" and "videos" tabs.
-   The `openTextbook` and `openVideo` functions are currently placeholders and need to be implemented with actual navigation logic.
-   The video data is currently hardcoded and should be fetched from an API in a real application.
-   The styling of the HTML content is applied using a CSS string injected into the page. This approach can be improved by using CSS Modules or a similar approach for better style isolation.
-   The `push` function used by report button comes from `$app/navigation` which is not directly importable.
-   The `params` prop comes from `use:page`, which needs to be added to the script tag in order to resolve `params.courseId` and `params.filename`

## TODO

[ ] Implement the actual navigation logic for the `openTextbook` function.
[ ] Implement the actual navigation logic for the `openVideo` function to open a dedicated video player page.
[ ] Implement proper sanitization of the HTML content fetched from the `topicData`.
[ ] Fetch the video data from an API instead of using hardcoded data.

[ ] Implement error handling for API calls (e.g., display an error message if the topic data cannot be fetched).
[ ] Refactor the CSS styling to use CSS Modules or a similar approach for better style isolation.
[ ] Add accessibility attributes (ARIA) to improve accessibility for users with disabilities.
[ ] Implement a more robust loading state for the video tab, potentially showing skeletons for a larger number of videos.
[ ] Make the video grid responsive to different screen sizes.
[ ] Consider adding pagination or infinite scrolling to the video list if there are a large number of videos.
[ ] Improve the UI/UX of the tab navigation, possibly using a more visually appealing tab component.
[ ] Allow the user to configure the `qtypes` settings in a setting page instead of hardcoding it.
```