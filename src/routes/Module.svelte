<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowLeft } from "lucide-svelte";
  import ky from "ky";

  let start = 1;
  let end = 27;

  let pages: any[] = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      // Create array of promises for page fetches
      const promises = [];
      for (let i = start; i <= end; i++) {
        promises.push(ky.get(`/logic/page-${i}.html`).text());
      }

      // Fetch all pages in parallel
      pages = await Promise.all(promises);
      loading = false;
    } catch (error) {
      console.error("Error fetching pages:", error);
      loading = false;
    }
  });
</script>

<main class="h-screen flex flex-col">
  <header
    class="sticky top-0 left-0 right-0 bg-blue-500 p-4 flex items-center z-10 shadow-md rounded-b-2xl"
  >
    <button onclick={() => history.back()}>
      <ArrowLeft color="white" />
    </button>
  </header>
  <div class="overflow-y-auto">
    {#if loading}
      <div class="text-center py-8 text-xl text-gray-600">Loading...</div>
    {:else}
      {#each pages as page}
        {@html page}
      {/each}
    {/if}
  </div>
</main>
