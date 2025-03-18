<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, LoaderCircle } from "lucide-svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { location } from "svelte-spa-router";
  import { getQuizQuestions } from "$lib/api";

  let isLoading = $state(false);

  let selectedTypes = $state({
    multipleChoice: permstate?.qtypes?.multipleChoice ?? true,
    trueFalse: permstate?.qtypes?.trueFalse ?? true,
    shortAnswer: permstate?.qtypes?.shortAnswer ?? true,
  });

  async function handleContinue() {
    // Map selected types to the format expected by the Quiz interface
    isLoading = true;
    const qtypes: string[] = [];

    if (selectedTypes.multipleChoice) {
      qtypes.push("choice");
    }

    if (selectedTypes.trueFalse) {
      qtypes.push("tf");
    }

    if (selectedTypes.shortAnswer) {
      qtypes.push("workout");
    }

    // Update the quiz in tempstate with selected question types
    const { data } = await getQuizQuestions();
    tempstate.quiz = {
      ...tempstate.quiz,
      qtypes: qtypes,
      questions: data,
    };
    permstate.qtypes = selectedTypes;
    save(permstate);
    push(`/quiz/0`);
  }

  let isContinueDisabled = $derived(
    !Object.values(selectedTypes).some((value) => value) || isLoading,
  );
</script>

<div
  class="flex flex-col justify-center items-center h-screen gap-8 p-8 bg-blue-50"
>
  <div class="space-y-4 text-center">
    <p class="text-3xl font-semibold mb-16">Select Question Types</p>
    <div class="flex flex-col gap-4">
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.multipleChoice}
        class:bg-blue-100={selectedTypes.multipleChoice}
      >
        <Checkbox bind:checked={selectedTypes.multipleChoice} size="lg" />
        <span class="text-xl">Multiple Choice</span>
      </label>
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.trueFalse}
        class:bg-blue-100={selectedTypes.trueFalse}
      >
        <Checkbox bind:checked={selectedTypes.trueFalse} size="lg" />
        <span class="text-xl">True/False</span>
      </label>
      <label
        class="flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50"
        class:border-primary={selectedTypes.shortAnswer}
        class:bg-blue-100={selectedTypes.shortAnswer}
      >
        <Checkbox bind:checked={selectedTypes.shortAnswer} size="lg" />
        <span class="text-xl">Short Answer/Workout</span>
      </label>
    </div>
  </div>
  <Button
    onclick={handleContinue}
    disabled={isContinueDisabled}
    size="lg"
    class="text-lg font-bold w-full mt-8"
  >
    Next
    {#if isLoading}
      <LoaderCircle class="animate-spin" />{:else}
      <ArrowRight />
    {/if}
  </Button>
</div>
