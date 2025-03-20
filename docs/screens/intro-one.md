```md
## Goal

The "Educational Focus Selection" screen allows users to select their primary educational focus (High School, Undergraduate, or Exit Exam) to tailor the app's content and functionality to their needs.

## API Functions and State

- **API Functions**: None. All state management is handled client-side.
- **State Variables**:
    - `selectedFocus` (local state): String representing the currently selected educational focus. This is a Svelte `$state` variable, meaning changes to it will trigger component re-renders.
    - `permstate` (global state): Object conforming to the `PermState` interface, managed by `$lib/state.svelte`.  Specifically, `permstate.userInfo` is updated.
    - `permstate.userInfo`: Contains user information including `eduFocus` (string) and `examFocus` (string).  These are set based on the user's selection.

## UI Description

The screen presents the user with a selection of educational focuses, each represented by a card with an icon and label.

-   **Overall Layout**:
    -   The screen uses a `div` with `min-h-screen` to ensure it always takes up at least the full screen height.
    -   The content is centered both horizontally and vertically using `flex justify-center items-center flex-col`.
    -   An overlaid blurred background is present behind all the elements.
-   **Background**:
    -   A `div` with `position: absolute` and `inset-0` creates a full-screen background.
    -   A gradient (`bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618]`) is applied to the background for visual appeal.
    -   `opacity-80` makes the background slightly transparent.
    -   `backdrop-filter: blur(100px)` applies a blur effect, enhancing the depth.
-   **Main Content Area**:
    -   A `div` with `z-10` (to ensure it's above the background) contains the main content.
    -   `text-center` aligns the content horizontally.
    -   `p-6` adds padding around the content.
    -   `w-full max-w-3xl mx-auto` limits the width of the content and centers it horizontally.
    -   `in:blur={{ duration: 300 }}` applies a blur-in transition when the component is mounted.
-   **Heading and Description**:
    -   `h1`: "Welcome to GebiApp" with `text-4xl`, `font-bold`, `text-white`, and `mb-16` (margin-bottom).
    -   `p`: "Select your educational focus:" with `text-xl`, `text-white`, and `mb-12`.
-   **Focus Options (Cards)**:
    -   A `div` with `flex flex-col gap-2` arranges the focus options in a column with a gap between them.
    -   `{#each focusOptions as option (option)}`: Iterates over the `focusOptions` array. The `(option)` is a key expression for Svelte's keyed each block, improving performance when the array changes.
    -   **`Card.Root` (Custom Card Component)**:
        -   `bg-black bg-opacity-30`: Sets a semi-transparent black background.
        -   `border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer`: Adds a border, transition for hover effects, and cursor style to indicate it's clickable.
        -   `{selectedFocus === option.id ? 'border-blue-500' : 'border-gray-600'}`: Conditionally applies a blue border if the card is selected, otherwise a gray border.
        -   `onclick={() => eduFocusClick(option.id)}`: Calls the `eduFocusClick` function when the card is clicked, passing the `option.id` as the selected focus.
    -   **`Card.Content` (Card Content Component)**:
        -   `py-4 px-4 flex flex-row items-center`: Adds padding and aligns the icon and label horizontally.
        -   `<option.icon class="w-5 h-5 text-white mr-3" />`: Renders the icon associated with the focus option, with styling for size, color, and margin.  The icon component is dynamically rendered from the `focusOptions` array.
        -   `<h2 class="text-lg font-bold text-white">{option.label}</h2>`: Displays the label of the focus option with styling for font size, weight, and color.
-   **`focusOptions` array**:
    - `id`: internal id for tracking
    - `label`: User facing text for display
    - `icon`: Lucide SVG icon component to display

## Navigation

-   **Outgoing**:
    -   Clicking on a focus option card triggers the `eduFocusClick` function.
    -   `eduFocusClick` updates the `permstate.userInfo` with the selected `eduFocus` and `examFocus`.
    -   `save(permstate)` saves the updated `permstate` to local storage.
    -   `push("/intro-two")` navigates to the "/intro-two" route (presumably the next screen in the onboarding flow).  The user's educational focus is passed implicitly via the updated `permstate` in local storage.

## Special Notes

-   The component uses Svelte's reactive statements (`$state`) for state management, making it efficient in updating the UI in response to state changes.
-   The `save` function persists the `permstate` to local storage.  This means the user's selected focus will be remembered even if they close and reopen the app.
-   The blurred background is implemented using CSS backdrop-filter, which requires browser support (most modern browsers support it).
- The examFocus field is defaulted to "matric" unless the eduFocus chosen is "exitexam".
- The `limitArrays` function in `save` is used to prevent local storage from becoming too large by limiting the size of certain arrays within the `permstate`.
- The keyed each block `{#each focusOptions as option (option)}` is crucial for performance, especially if the `focusOptions` array were to change dynamically.  Without it, Svelte would have to re-render all the card components on any change, which could be inefficient.

## TODO

- [ ] Add error handling to the `save` function in case local storage is full or unavailable.
- [ ] Provide visual feedback (e.g., a loading indicator) while the state is being saved to local storage.
- [ ] Consider adding accessibility attributes (e.g., `aria-label`, `role`) to the cards for screen reader users.
- [ ] Implement a mechanism to handle cases where the user's selected focus needs to be updated or reset.

- [ ] Implement analytics tracking to monitor which focus options are most frequently selected.
- [ ] Allow users to change their educational focus later in the app (e.g., in a settings screen).
- [ ] Create a custom card component instead of relying on a general-purpose one to simplify the code.
- [ ] Explore alternative background effects or animations to enhance the visual appeal.
