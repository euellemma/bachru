<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card } from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import * as Dialog from "$lib/components/ui/dialog";
  import { AlertCircle, BookOpen, ArrowLeft, Flag, Timer } from "lucide-svelte";
  import { Progress } from "$lib/components/ui/progress";
  import { blur, slide } from "svelte/transition";

  const {
    question,
    handleDone,
    options,
    solution,
    hint,
    showSolution,
    showAnswerForWorkout,
    selectedAnswer,
    isCorrect,
    handleAnswerSelect,
    handleWorkoutAnswer,
    handleNext,
    currentProgress,
    seconds,
    goBack,
    report,
    currentQuestionIndex,
    questionType,
    totalQuestions,
  } = $props();

  let isHintOpen = $state(false);

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="container mx-auto p-4 max-w-3xl bg-accent min-h-screen">
  <div class="flex justify-between items-center mb-2">
    <ArrowLeft onclick={goBack} class="w-8 h-8 p-1" />

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 font-medium">
        <Timer class="h-4 w-4" />
        {formatTime(seconds)}
      </div>
      <Button
        onclick={handleDone}
        variant="primary"
        class="bg-blue-600 px-6 text-white"
      >
        <span class="font-bold">Done</span>
      </Button>
    </div>
  </div>

  <Progress value={currentProgress} class="h-1 mb-8" />

  {#key currentQuestionIndex}
    <div class="space-y-6" in:blur={{ duration: 200 }}>
      <h2 class="text-xl font-semibold">
        {@html question}
      </h2>

      {#if questionType !== "workout"}
        <div class="grid gap-3">
          {#each options as option (option)}
            <Button
              variant={selectedAnswer === option.value
                ? isCorrect
                  ? "outline"
                  : "destructive"
                : "outline"}
              onclick={() => !showSolution && handleAnswerSelect(option.value)}
              class="w-full justify-start px-4 py-6 text-left whitespace-normal {selectedAnswer ===
                option.value && isCorrect
                ? 'bg-green-100 hover:bg-green-100 border-green-600 text-green-800 font-medium'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}"
            >
              {@html option.text}
            </Button>
          {/each}
        </div>
      {:else}
        <!-- Workout question type -->
        <div class="space-y-4">
          {#if !showSolution}
            <Button
              variant="outline"
              class="w-full border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-800"
              onclick={() => {
                showAnswerForWorkout();
              }}
            >
              Show Answer
            </Button>
          {:else if !isCorrect && isCorrect !== false}
            <div class="space-y-4" in:slide={{ duration: 300 }}>
              <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 id="solution" class="font-semibold mb-2 text-green-800">
                  Solution
                </h3>
                id solution {@html solution}
              </div>
              <div class="text-center font-medium mb-2">
                Did you get it right?
              </div>
              <div class="flex gap-4">
                <Button
                  variant="outline"
                  class="flex-1 border-red-500 text-red-700 hover:bg-red-50 font-medium"
                  onclick={() => handleWorkoutAnswer(false)}
                >
                  No
                </Button>
                <Button
                  variant="outline"
                  class="flex-1 border-green-600 text-green-800 hover:bg-green-50 font-medium"
                  onclick={() => handleWorkoutAnswer(true)}
                >
                  Yes
                </Button>
              </div>
              <Separator class="my-6" />

              {@render OpenTopic()}
              <Button variant="outline" class="text-red-500">
                <Flag class="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          {/if}
        </div>
      {/if}

      {#if !showSolution && hint}
        <div class="flex justify-end">
          <Dialog.Root bind:open={isHintOpen}>
            <Dialog.Trigger>
              <Button class="bg-blue-300 text-black font-bold">
                <AlertCircle class="h-4 w-4 mr-2" />
                Hint
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Hint</Dialog.Title>
                <Dialog.Description>
                  {@html hint}
                </Dialog.Description>
              </Dialog.Header>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      {/if}

      {#if showSolution && isCorrect !== null}
        <div class="mt-6 space-y-6" in:slide={{ duration: 300 }}>
          {#if questionType !== "workout"}
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 id="solution" class="font-semibold mb-2 text-green-800">
                Solution
              </h3>
              {@html solution}
            </div>
          {/if}

          {@render OpenTopic()}

          <div class="flex justify-between items-center">
            <Button variant="outline" class="text-red-500" onclick={report}>
              <Flag class="h-4 w-4 mr-2" />
              Report
            </Button>
            <Button onclick={handleNext}>
              {currentQuestionIndex < totalQuestions - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {/key}
</div>
{#snippet OpenTopic()}
  <Card class="mt-3 p-4 flex items-center">
    <h3 class="font-bold text-gray-900 mb-2">
      <div
        class="inline-flex items-center justify-center rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 mr-2 min-w-min"
      >
        Topic
      </div>
      <br />
      Introduction to Mechanics and the morning coffee of ayu
    </h3>
    <Button variant="outline" class="bg-blue-100">
      <BookOpen class="h-4 w-4 mr-2" />
      Read
    </Button>
  </Card>
{/snippet}
