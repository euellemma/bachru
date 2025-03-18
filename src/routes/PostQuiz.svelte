<script lang="ts">
  import {
    X,
    Star,
    Clock,
    CheckSquare,
    PlayCircle,
    ClipboardList,
  } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { tempstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";

  let count = $state(0);
  let showContent = $state(false);
  let correctAnswers = $state(0);
  let totalQuestions = $state(0);
  let timeTaken = $state(0);
  let performanceMessage = $state("");

  function goBackUntilUrl(searchString: string) {
    const navigateBack = () => {
      const currentUrl = window.location.href;
      if (currentUrl.includes(searchString)) {
        // Found the target URL
        return;
      }

      // Go back one step in history
      window.history.back();

      // Check again after a short delay to allow navigation to complete
      setTimeout(() => {
        // If we're still not at the target URL, try again
        if (!window.location.href.includes(searchString)) {
          navigateBack();
        }
      }, 100);
    };

    navigateBack();
  }

  function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function getPerformanceMessage(percentage: number): string {
    if (percentage >= 90) return "Outstanding!";
    if (percentage >= 80) return "Excellent!";
    if (percentage >= 70) return "Great Job!";
    if (percentage >= 60) return "Good Work!";
    if (percentage >= 50) return "Nice Effort!";
    return "Keep Practicing!";
  }

  onMount(() => {
    totalQuestions = tempstate.quiz.questions.length;
    correctAnswers = tempstate.quiz.questions.filter(
      (q) => q.isUserCorrect === true,
    ).length;
    timeTaken = tempstate.quiz.timeTook || 0;

    // Calculate percentage and set performance message
    const percentage = (correctAnswers / totalQuestions) * 100;
    performanceMessage = getPerformanceMessage(percentage);

    // Set the target score (5 points per correct answer)
    const targetScore = correctAnswers * 5;

    // Animate the score counter
    const duration = 1000; // 1 second
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      count = Math.min(
        targetScore,
        Math.floor((progress / duration) * targetScore),
      );

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        count = targetScore;
        showContent = true;
      }
    };

    requestAnimationFrame(animate);
  });

  function handleClose() {
    console.log("idk where to go man");
  }
  const moreQuestions = () => {
    push(`/select-topics`);
  };
  const studyPlan = () => {
    push(`/study-plan`);
  };
</script>

<div
  transition:fade={{ duration: 200 }}
  class="min-h-screen bg-blue-500 flex flex-col"
>
  <div class="p-4">
    <button onclick={() => goBackUntilUrl("main")}>
      <X class="h-6 w-6 text-white" />
    </button>
  </div>

  <div class="flex flex-col flex-1 items-center justify-center">
    <div class="flex items-center justify-center gap-3 mb-4">
      <Star class="h-12 w-12 fill-yellow-400 text-yellow-400" />
      <span class="text-7xl font-bold text-white">{count}</span>
    </div>
    <div class="text-center">
      <h2 class="text-3xl font-bold text-white">{performanceMessage}</h2>
    </div>

    <div class="flex items-center justify-center gap-8 mt-8">
      <div class="flex items-center gap-2">
        <CheckSquare class="h-5 w-5 text-white" />
        <span class="text-2xl font-bold text-white"
          >{correctAnswers}/{totalQuestions}</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Clock class="h-5 w-5 text-white" />
        <span class="text-2xl font-bold text-white"
          >{formatTime(timeTaken)}</span
        >
      </div>
    </div>
  </div>

  <div
    transition:fly={{ y: 100, duration: 500 }}
    class="bg-white rounded-t-3xl flex-1 px-6 flex flex-col justify-center"
  >
    <div class="w-4/5 mx-auto space-y-4">
      <Button
        variant="primary"
        onclick={studyPlan}
        class="bg-blue-500 text-white w-full py-6 text-lg"
        ><ClipboardList class="mr-2 h-5 w-5" />Create Study Plan</Button
      >
      <Button
        variant="ghost"
        class="bg-blue-100 w-full py-6 text-lg"
        onclick={moreQuestions}
        ><PlayCircle class="mr-2 h-5 w-5" />More Questions</Button
      >
    </div>
  </div>
</div>
