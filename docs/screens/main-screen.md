```markdown
## Goal
The main screen provides a bottom navigation bar allowing users to switch between three main sections: Home, News, and Settings.

## API Functions and State

*   **State**:
    *   `activeScreen`: A string state variable that determines which screen is currently displayed (`"home"`, `"course"`, or `"settings"`).

## UI Description

The UI consists of a container div with a background color and a main content area that displays different screens based on the `activeScreen` state. Below is a detailed breakdown:

1.  **Outer Container (`div.mx-auto bg-background`)**:
    *   This is the outermost container, responsible for centering the content horizontally (`mx-auto`) and setting the overall background color (`bg-background`). The `bg-background` class should be defined elsewhere in the CSS to provide a color, and it's not part of the Svelte code itself.
2.  **Screen Container (`div.screen-container relative min-h-screen`)**:
    *   This container holds the currently active screen.
    *   `relative`:  Positions the container relatively, allowing absolute positioning of children (though none are used in this snippet).
    *   `min-h-screen`: Sets the minimum height to the full viewport height, ensuring the content stretches to fill the screen vertically.
3.  **Conditional Screen Rendering (`{#if activeScreen === ...}`)**:
    *   This section uses Svelte's conditional rendering to display different screens based on the value of `activeScreen`.
    *   `in:blur`: A Svelte transition that applies a blur effect when a screen is shown.
        *   `duration: 500`: The blur transition lasts for 500 milliseconds.
        *   `easing: quintOut`: Specifies the easing function for the transition, providing a smooth, decelerating effect.  `quintOut` is imported from `svelte/easing`.
    *   `<HomeScreen />`:  Renders the `HomeScreen` component when `activeScreen` is `"home"`.  (Defined in `Home.svelte`).
    *   `<News />`: Renders the `News` component when `activeScreen` is `"course"`. (Defined in `News.svelte`).
    *   `<SettingsScreen />`: Renders the `SettingsScreen` component when `activeScreen` is `"settings"`. (Defined in `SettingsScreen.svelte`).
4.  **Bottom Navigation Bar (`div.fixed bottom-0 ...`)**:
    *   This section creates a fixed navigation bar at the bottom of the screen.
    *   `fixed bottom-0 left-0 w-full`: Fixes the navigation bar to the bottom of the viewport, stretching across the full width.
    *   `p-1 bg-blue-500`: Adds padding and sets the background color to blue.
    *   `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`:  Applies a subtle shadow to the top of the navigation bar.  The shadow is defined using a CSS box-shadow property.
    *   `rounded-t-3xl`: Rounds the top corners of the navigation bar.
    *   `border-t border-gray-100`: Adds a subtle border to the top.
5.  **Navigation Buttons (`button[onclick]` x3)**:
    *   These buttons are responsible for switching between the different screens.
    *   `onclick={() => switchScreen("home")}`: Calls the `switchScreen` function (defined in the `<script>` section) when clicked, updating the `activeScreen` state and triggering a re-render.  The other two buttons work similarly for "course" and "settings".
    *   `class={activeScreen === ... ? "py-2 my-1 px-6 rounded-lg bg-blue-700" : "py-2 my-1 px-6 rounded-lg"}`:  Dynamically applies a background color (`bg-blue-700`) to the button that corresponds to the currently active screen, visually indicating the active screen. `py-2` and `my-1` provide padding and margin. `px-6` sets padding on left and right.
    *   `<Home size="24" ... />`:  Uses the `Home`, `Newspaper`, and `Settings` components from `lucide-svelte` to display icons.
        *   `size="24"`: Sets the size of the icon to 24 pixels.
        *   `class={activeScreen === ... ? "text-white" : "text-white/60"}`:  Dynamically sets the text color of the icon to white for the active screen and a semi-transparent white for the inactive screens.

## Navigation

*   Clicking the Home icon navigates to the `HomeScreen`.
*   Clicking the News icon navigates to the `News` screen.
*   Clicking the Settings icon navigates to the `SettingsScreen`.
*   No parameters are passed during navigation.

## Special Notes

*   The `blur` transition provides a visual cue when switching between screens, improving the user experience.
*   The dynamic class binding on the buttons in the navigation bar highlights the currently selected screen.
*   The state management uses localStorage to persist user data across sessions.
*   The `limitArrays` function is used to limit the size of arrays stored in localStorage, preventing the storage from becoming too large.

## TODO

[ ] Create a loading state to display while switching between screens.
[ ] Implement proper error handling for localStorage operations.
[ ] Add accessibility features, such as ARIA attributes, to the navigation bar.
[ ] Implement better UI feedback mechanism other than backgroun color change.

[ ] Implement a more sophisticated transition effect between screens.
[ ] Allow users to customize the appearance of the navigation bar.
[ ] Refactor state management to use a more robust solution like Zustand or Jotai.
[ ] Implement screen history to allow users to navigate back to previous screens.
```