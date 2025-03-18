<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Play } from "lucide-svelte";
  import { permstate, tempstate, save } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExam } from "$lib/api";
  import { push } from "svelte-spa-router";
  import type { ExitExam } from "$lib/types";

  const { params } = $props();
  const examId = params.examId;

  let exam: ExitExam | null = $state(null);
  let progress: Record<string, number> = $state({});
  let loading: boolean = $state(true);

  function startExam(courseId?: string) {
    if (courseId) tempstate.quiz.courses = [courseId];
    push("/select-courses");
  }

  onMount(async () => {
    exam = permstate.exitExams?.find((e) => e.examId == examId);
    if (exam) {
      loading = false;
      return;
    }
    const { data } = await getExitExam(examId);
    exam = data;
    loading = false;
    permstate.exitExams = [...(permstate.exitExams || []), data];
    progress = getExamProgress(exam, examId, permstate.exitExamrogress);
    tempstate.quiz.focus = "exitexam";
    tempstate.quiz.examId = examId;
    save(permstate);
  });

  function getExamProgress(
    currentExam: ExitExam | null,
    examIdentifier: string,
    progressData: Record<
      string,
      Record<string, (string | undefined)[]> | undefined
    >,
  ) {
    if (!currentExam || !examIdentifier) return {};

    const progress = progressData?.[examIdentifier] || {};
    const result: Record<string, number> = {};

    if (currentExam.courses) {
      for (const course of currentExam.courses) {
        const courseId = course.courseId;
        const courseProgress = progress[courseId] || [];

        const uniqueAnsweredQuestions = new Set(
          courseProgress
            .map((answer, index) => (answer !== undefined ? index : -1))
            .filter((index) => index !== -1),
        );
        result[courseId] = uniqueAnsweredQuestions.size;
      }
    }

    return result;
  }
</script>

<div class="bg-blue-500">
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
          {exam?.examTitle || "Loading..."}
        </h1>
      {/if}
    </div>
    <div class="flex gap-2 justify-end">
      <Button onclick={startExam} variant="ghost" class="bg-blue-100 font-bold">
        <Play class="w-5 h-5 mr-1" />
        Start Exam
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="space-y-4 mb-8">
      {#if exam && !loading}
        {#each exam.courses as course (course)}
          <div class="mb-6">
            <div class="p-3 rounded-lg border space-y-3">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">{course.courseTitle}</h2>
                <span class="text-gray-700 font-bold text-sm text-right"
                  >{progress[course.courseId] || 0}/{course.questionCount} Qs</span
                >
              </div>
              <div class="h-3 bg-gray-200 rounded-full mb-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {((progress[course.courseId] || 0) /
                    course.questionCount) *
                    100}%"
                ></div>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => push(`/courses/${course.courseId}`)}
                  class="flex items-center justify-center"
                >
                  <BookOpen class="w-4 h-4 mr-1" />
                  <span>Read</span>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onclick={() => startExam(course.courseId)}
                  class="flex items-center justify-center"
                >
                  <Play class="w-4 h-4 mr-1" />
                  <span>Exam Topic</span>
                </Button>
                <span class="flex-grow"></span>
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
