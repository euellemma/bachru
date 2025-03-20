```markdown
## Goal

The screen aims to introduce users to the GebiApp platform, showcasing its learning and quiz functionalities, and then navigates them to the course selection page based on their profile information.

## API Functions and State

*   **API Functions:**
    *   `getCourseForEduFocus(eduFocus: EduFocus, deptOrGrade: string)`: Fetches course data based on the user's educational focus and department/grade.
*   **State Variables:**
    *   `loading: boolean`: Controls the visibility of the loading indicator during the course fetching process.
    *   `permstate: PermState`: Stores persistent user information, including `userInfo` (containing `eduFocus`, `grade`, `dept`), and `myCourses`. See STATE MANAGEMENT for definition.

## UI Description

The screen's UI is designed to be visually appealing and informative, guiding the user towards initiating a quiz based on customized course selections. The whole screen is wrapped in a relative-positioned div with a minimum height equal to the screen, a flexbox for content layout, and an `overflow-hidden` property. This allows for the blurred background to work without clipping content.

1.  **Background:**

    *   A gradient background is applied using CSS (`bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618]`).
    *   A blur effect is added using `backdrop-filter: blur(100px)`. The opacity is set to 80%.
    *   The background is positioned absolutely behind the main content (`z-0`).

2.  **Container:**

    *   A container div with `z-10` ensures the content is above the background.
    *   It uses `flex-grow` to take up available vertical space.
    *   The layout is a vertical flexbox (`flex flex-col`) with content distributed `justify-between`.
    *   Padding of `py-8` and `p-4` is applied for spacing.

3.  **Title:**

    *   A centered title "How GebiApp works" is displayed using `text-3xl`, `text-white`, `font-bold`, and `text-center` classes.

4.  **Feature Showcase:**

    *   Two `Undo` icons are displayed on the screen rotated slightly to draw visual attention to the cards below.
    *   A grid layout (`grid grid-cols-2 md:grid-cols-2 gap-3`) is used to display two cards side-by-side on larger screens, and stacked on smaller screens.
    *   Each card is wrapped in a `div` element with a blur transition.
    *   **First Card ("Learn about Linear Equations"):**
        *   A `Card` component is used with shadow, background, text color, and border styles.  The backgroun is black with 20% opacity and the border is gray.
        *   The `CardHeader` contains a `PanelRight` icon, a "Learn about" text, and a "Linear Equations" sub-text.  The text-lg font-bold styles the heading, and text-sm opacity-80 styles the subtext.
        *   The `CardContent` contains a list of learning resources using a loop.
        *   Each resource (`BookOpen`, `Video`, `Brain`, `Lightbulb`) is displayed with an icon and text within a clickable `div`.
        *   Each clickable div has the hover style of black with 30% opacity
    *   **Second Card ("Quiz on Linear Equations"):**
        *   Similar structure to the first card, but with different content.
        *   The `CardHeader` contains a `Dices` icon, a "Quiz on" text, and a "Linear Equations" sub-text.
        *   The `CardContent` contains a list of quiz features (`HelpCircle`, `Info`, `List`, `BookMarked`) using a loop.
        *   Each quiz feature is displayed with an icon and text within a clickable `div`.
        *   Each clickable div has the hover style of black with 30% opacity

5.  **Continue Button:**

    *   A `Button` component is used with `text-lg`, `bg-blue-500`, and `font-bold` classes.
    *   The button text changes to "Loading Courses" with a loading indicator (`Loader`) when `loading` is true.
    *   Otherwise, it displays "Start Quiz" with an `ArrowRight` icon.
    *   The button's `onclick` event is bound to the `handleContinue` function.
    *   The button is disabled when `loading` is true.

## Navigation

*   **Outgoing:**
    *   Navigates to the `/search-courses` route using `push("/search-courses")` after successfully fetching courses.  It passes no explicit parameters, but the destination page will read the `permstate.myCourses` value set on this page.

## Special Notes

*   The `handleContinue` function fetches courses based on `permstate.userInfo.eduFocus` and either `permstate.userInfo.grade` (for "highschool") or `permstate.userInfo.dept` (for other educational focuses).
*   Error handling is implemented within the `handleContinue` function to catch and log errors during course fetching.
*   The component uses Svelte's `$state` and `save` functions for state management and persistence.
*   The blurred background effect relies on the `backdrop-filter` CSS property, which may not be supported by all browsers.
*   Animations are used on the `Undo` icons.

## TODO

[ ] Implement click actions for each item in the cards.
[ ] Add more descriptive text in the cards for the features that will be present in the app.
[ ] Handle cases where `permstate.userInfo` or its nested properties are undefined.

[ ] Add more robust error handling, potentially displaying an error message to the user.
[ ] Consider pre-loading some data in the background to improve perceived performance.
[ ] Implement a more sophisticated animation for the loading indicator.
[ ] Make the background gradient dynamic or customizable.
[ ] Add keyboard navigation support.
```