<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Loader2, Play } from "lucide-svelte";
  import { slide, blur } from "svelte/transition";
  import { permstate, tempstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getMatricExam, getQuizQuestions } from "$lib/api";
  import type { MatricExam } from "$lib/types";

  const { params } = $props();
  const { examId, subjectId } = params;

  let exam: MatricExam | null = $state(null);
  let subject: MatricExam["subjects"] | null = $state(null);
  let progress: Record<string, number> = $state({});
  let loading: boolean = $state(true);
  let quizLoading: string | null = $state(null);
  let activeTab = $state("g9-10");

  async function startExam(id = "all") {
    quizLoading = id;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const { data } = await getQuizQuestions();
    if (id != "all") {
      tempstate.quiz.chapters = [id];
    }
    tempstate.quiz.questions = data;
    push("/exam");
  }

  // Fetch the exam data when component mounts
  onMount(async () => {
    tempstate.quiz.focus = "matric";
    tempstate.quiz.examId = examId;
    exam = permstate.matricExams?.find((e) => e.examId == examId);
    if (!exam) {
      const { data } = await getMatricExam(examId);
      exam = data;
    }

    subject = exam.subjects.find((s) => s.subjectId == subjectId);
    progress = getExamProgress(exam, examId, permstate.matricExamProgress);
    loading = false;

    permstate.matricExams = [...(permstate.matricExams || []), exam];
    progress = getExamProgress(exam, examId, permstate.matricExamProgress);

    save(permstate);
  });

  function getExamProgress(
    currentExam: MatricExam | null,
    examIdentifier: string,
    progressData: Record<
      string,
      | Record<string, Record<string, (string | undefined)[]> | undefined>
      | undefined
    >,
  ) {
    if (!currentExam || !examIdentifier) return {};

    const subjectProgress = progressData?.[examIdentifier]?.[subjectId] || {};
    const result: Record<string, number> = {};

    for (const chapterId in subjectProgress) {
      const nqs = [
        ...new Set(subjectProgress[chapterId]?.filter((x) => x) || []),
      ].length;
      result[chapterId] = nqs;
    }

    return result;
  }
</script>

<div in:blur={{ duration: 150 }} class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      {#if loading}
        <Skeleton class="h-10 w-60 bg-blue-400/50" />
      {:else}
        <h1 class="text-3xl mb-2 font-bold text-white text-right">
          {subject?.subjectTitle || "Loading..."}
        </h1>
      {/if}
    </div>
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <button
          class="px-4 py-2 text-sm rounded-full font-semibold transition-all {activeTab ===
          'g9-10'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "g9-10")}
          disabled={quizLoading !== null}
        >
          9-10
        </button>
        <button
          class="px-4 py-2 text-sm rounded-full font-semibold transition-all {activeTab ===
          'g11-12'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "g11-12")}
          disabled={quizLoading !== null}
        >
          11-12
        </button>
      </div>
      <Button
        variant="ghost"
        class="bg-blue-100 font-bold"
        onclick={() => startExam()}
        disabled={quizLoading !== null}
      >
        {#if quizLoading === "all"}
          <Loader2 class="w-5 h-5 mr-1 animate-spin" />
          Loading...
        {:else}
          <Play class="w-5 h-5 mr-1" />
          Start Exam
        {/if}
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="space-y-4 mb-8">
      {#if exam && !loading}
        {#each subject?.chapters.filter((chapter) => chapter.gradeGroup === activeTab) as chapter (chapter)}
          <div class="mb-6" in:slide={{ duration: 150 }}>
            <div class="p-3 rounded-lg border space-y-3">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">{chapter.chapterTitle}</h2>
                <span class="text-gray-700 font-bold text-sm text-right"
                  >{progress[chapter.chapterId] || 0}/{chapter.questionCount}
                  Qs</span
                >
              </div>
              <div class="h-3 bg-gray-200 rounded-full mb-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {((progress[chapter.chapterId] || 0) * 100) /
                    chapter.questionCount}%"
                ></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() =>
                    push(`/topic/${subjectId}/${chapter.chapterId}`)}
                  class="flex items-center justify-center"
                  disabled={quizLoading !== null}
                >
                  <BookOpen class="w-4 h-4 mr-1" />
                  <span>Read</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => startExam(chapter.chapterId)}
                  class="flex items-center justify-center"
                  disabled={quizLoading !== null}
                >
                  {#if quizLoading === chapter.chapterId}
                    <Loader2 class="w-4 h-4 mr-1 animate-spin" />
                    <span>Loading</span>
                  {:else}
                    <Play class="w-4 h-4 mr-1" />
                    <span>Exam Chapter</span>
                  {/if}
                </Button>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="space-y-4">
          {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
            <div class="mb-6">
              <div class="p-3 rounded-lg border space-y-3">
                <div class="flex justify-between items-center">
                  <Skeleton class="h-7 w-40" />
                  <Skeleton class="h-5 w-16" />
                </div>
                <Skeleton class="h-3 w-full rounded-full" />
                <div class="flex flex-wrap gap-2">
                  <Skeleton class="h-9 w-20" />
                  <Skeleton class="h-9 w-28" />
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
