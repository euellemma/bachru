<script lang="ts">
  import { blur } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { Home, Newspaper, Settings } from "lucide-svelte";
  import HomeScreen from "./Home.svelte";
  import News from "./News.svelte";
  import SettingsScreen from "./Settings.svelte";

  let activeScreen = $state("home");

  function switchScreen(screenName: string) {
    activeScreen = screenName;
  }
</script>

<div class="mx-auto bg-background">
  <div class="screen-container relative min-h-screen">
    {#if activeScreen === "home"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <HomeScreen />
      </div>
    {:else if activeScreen === "course"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <News />
      </div>
    {:else if activeScreen === "settings"}
      <div in:blur={{ duration: 500, easing: quintOut }}>
        <SettingsScreen />
      </div>
    {/if}
  </div>

  <div
    class="fixed bottom-0 left-0 w-full p-1 bg-blue-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-3xl border-t border-gray-100"
  >
    <div class="flex justify-around items-center">
      <button
        onclick={() => switchScreen("home")}
        class={activeScreen === "home"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Home
          size="24"
          class={activeScreen === "home" ? "text-white" : "text-white/60"}
        />
      </button>
      <button
        onclick={() => switchScreen("course")}
        class={activeScreen === "course"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Newspaper
          size="24"
          class={activeScreen === "course" ? "text-white" : "text-white/60"}
        />
      </button>
      <button
        onclick={() => switchScreen("settings")}
        class={activeScreen === "settings"
          ? "py-2 my-1 px-6 rounded-lg bg-blue-700"
          : "py-2 my-1 px-6 rounded-lg"}
      >
        <Settings
          size="24"
          class={activeScreen === "settings" ? "text-white" : "text-white/60"}
        />
      </button>
    </div>
  </div>
</div>
