<script lang="ts">
  import { ArrowLeft } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExams, getMatricExams } from "$lib/api";
  import { blur } from "svelte/transition";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import type { ExitExam, MatricExam } from "$lib/types";

  let examFocus = $state(permstate.userInfo?.examFocus || "exitexam");
  let loading: boolean = $state(true);

  onMount(async () => {
    // Determine exam type based on user preference
    examFocus = permstate.userInfo?.examFocus || "exitexam";
    loading = true;
    // permstate.examFocus = "matric";

    if (examFocus === "exitexam") {
      // If we have exit exams in state, use them immediately but still fetch in background
      if (permstate.exitExams && permstate.exitExams.length > 0) {
        loading = false;
      }

      // Fetch exit exams in background and update permstate
      try {
        const { data } = await getExitExams();
        if (!permstate.exitExams || permstate.exitExams.length === 0) {
          permstate.exitExams = data;
          loading = false;
        } else {
          // Merge new data with existing data, preventing duplicates based on examId
          const existingExamIds = new Set(
            permstate.exitExams.map((exam) => exam.examId),
          );
          const newExams = data.filter(
            (exam) => !existingExamIds.has(exam.examId),
          );

          // Update existing exams and add new ones
          permstate.exitExams = [
            ...permstate.exitExams.map((existingExam) => {
              // Find matching exam in new data to update properties
              const updatedExam = data.find(
                (e) => e.examId === existingExam.examId,
              );
              return updatedExam
                ? { ...existingExam, ...updatedExam }
                : existingExam;
            }),
            ...newExams,
          ];
        }
        save(permstate);
      } catch (error) {
        console.error("Failed to fetch exit exams:", error);
        if (!permstate.exitExams || permstate.exitExams.length === 0) {
          loading = false;
        }
      }
    } else if (examFocus === "matric") {
      // If we have matric exams in state, use them immediately but still fetch in background
      if (permstate.matricExams && permstate.matricExams.length > 0) {
        loading = false;
      }

      // Fetch matric exams in background and update permstate
      try {
        const { data } = await getMatricExams();
        if (!permstate.matricExams || permstate.matricExams.length === 0) {
          permstate.matricExams = data;
          loading = false;
        } else {
          // Merge new data with existing data, preventing duplicates based on examId
          const existingExamIds = new Set(
            permstate.matricExams.map((exam) => exam.examId),
          );
          const newExams = data.filter(
            (exam) => !existingExamIds.has(exam.examId),
          );

          // Update existing exams and add new ones
          permstate.matricExams = [
            ...permstate.matricExams.map((existingExam) => {
              // Find matching exam in new data to update properties
              const updatedExam = data.find(
                (e) => e.examId === existingExam.examId,
              );
              return updatedExam
                ? { ...existingExam, ...updatedExam }
                : existingExam;
            }),
            ...newExams,
          ];
        }
        save(permstate);
      } catch (error) {
        console.error("Failed to fetch matric exams:", error);
        if (!permstate.matricExams || permstate.matricExams.length === 0) {
          loading = false;
        }
      }
    }
  });

  function calculateExitExamProgress(examId: string) {
    if (!examId) return { completedQuestions: 0, totalQuestions: 0 };

    const exam = permstate.exitExams?.find((e) => e.examId === examId);
    if (!exam) return { completedQuestions: 0, totalQuestions: 0 };

    const progressData = permstate.exitExamProgress?.[examId] || {};
    let totalQuestionsCount = 0;
    let totalAnsweredCount = 0;

    if (exam.courses) {
      for (const course of exam.courses) {
        const courseId = course.courseId;
        const courseProgress = progressData[courseId] || [];
        totalQuestionsCount += course.questionCount || 0;

        const uniqueAnsweredQuestions = new Set(
          courseProgress
            .map((answer, index) => (answer !== undefined ? index : -1))
            .filter((index) => index !== -1),
        );

        totalAnsweredCount += uniqueAnsweredQuestions.size;
      }
    }

    return {
      completedQuestions: totalAnsweredCount,
      totalQuestions: totalQuestionsCount,
    };
  }

  function calculateMatricExamProgress(examId: string) {
    if (!examId) return { completedQuestions: 0, totalQuestions: 0 };

    const exam = permstate.matricExams?.find((e) => e.examId === examId);
    if (!exam) return { completedQuestions: 0, totalQuestions: 0 };

    const examProgressData = permstate.matricExamProgress?.[examId] || {};
    let totalQuestionsCount = 0;
    let totalAnsweredCount = 0;

    if (exam.subjects) {
      for (const subject of exam.subjects) {
        const subjectId = subject.subjectId;
        const subjectProgress = examProgressData[subjectId] || {};

        for (const chapter of subject.chapters) {
          const chapterId = chapter.chapterId;
          const chapterProgress = subjectProgress[chapterId] || [];
          totalQuestionsCount += chapter.questionCount || 0;

          const uniqueAnsweredQuestions = new Set(
            chapterProgress.filter((answer) => answer !== undefined),
          );

          totalAnsweredCount += uniqueAnsweredQuestions.size;
        }
      }
    }

    return {
      completedQuestions: totalAnsweredCount,
      totalQuestions: totalQuestionsCount,
    };
  }

  function navigateToExam(exam: ExitExam | MatricExam) {
    if (examFocus === "exitexam") {
      push(`/exitexam/${exam.examId}`);
    } else if (examFocus === "matric") {
      // For matric exams, we need to select a subject first
      // Using the first subject as default if available
      const matricExam = exam as MatricExam;
      if (matricExam.subjects && matricExam.subjects.length > 0) {
        push(`/matric/${exam.examId}/${matricExam.subjects[0].subjectId}`);
      } else {
        push(`/matric/${exam.examId}`);
      }
    }
  }
</script>

<div
  in:blur={{ duration: 150 }}
  class="container mx-auto p-4 pt-8 bg-accent min-h-screen"
>
  <div class="flex gap-4 items-center">
    <ArrowLeft onclick={() => window.history.back()} />
    <span class="text-2xl"
      >{examFocus === "exitexam" ? "Exit Exams" : "Matriculation Exams"}</span
    >
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {#if loading}
      {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
        <div
          class="card bg-white border-2 border-gray-200 rounded-lg overflow-hidden p-4 space-y-3"
        >
          <div class="flex justify-between items-center">
            <Skeleton class="h-6 w-40" />
            <Skeleton class="h-4 w-16" />
          </div>
          <Skeleton class="h-4 w-full rounded-full" />
        </div>
      {/each}
    {:else}
      {#each examFocus === "exitexam" ? permstate.exitExams || [] : permstate.matricExams || [] as exam (exam.examId)}
        {@const progress =
          examFocus === "exitexam"
            ? calculateExitExamProgress(exam.examId)
            : calculateMatricExamProgress(exam.examId)}
        <button
          class="card bg-white border-2 border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onclick={() => navigateToExam(exam)}
        >
          <div class="card-header px-4 pt-4 pb-2">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold">{exam.examTitle}</h2>
              <span class="text-gray-700 text-right font-bold text-sm">
                {progress.completedQuestions || 0}/{progress.totalQuestions ||
                  0} Qs
              </span>
            </div>
          </div>
          <div class="card-content px-4 py-2 pb-4">
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                class="bg-blue-400 h-4 rounded-full"
                style="width: {progress.totalQuestions
                  ? (progress.completedQuestions / progress.totalQuestions) *
                    100
                  : 0}%"
              ></div>
            </div>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
