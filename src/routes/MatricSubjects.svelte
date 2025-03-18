<script lang="ts">
  import {
    ArrowLeft,
    BookOpen,
    Atom,
    Calculator,
    Globe,
    Microscope,
    FlaskConical,
    Leaf,
    Camera,
    Building,
    Landmark,
    BadgeDollarSign,
    Languages,
    BookText,
    Cpu,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { permstate, save } from "$lib/state.svelte";
  import type { MatricExam } from "../types.d.ts";
  import { getMatricExam } from "$lib/api.ts";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { push } from "svelte-spa-router";

  const { params } = $props();
  let exam: MatricExam | null = $state(null);
  let loading = $state(true);
  let progress: Record<string, number> = $state({});

  function getSubjectProgress(
    progress: typeof permstate.matricExamProgress,
    exam: MatricExam,
  ): Record<string, number> {
    if (!exam || !progress || !progress[exam.examId]) {
      return {};
    }

    const result: Record<string, number> = {};
    const examProgress = progress[exam.examId];

    for (const subject of exam.subjects) {
      const subjectId = subject.subjectId;
      const subjectProgress = examProgress?.[subjectId];

      if (!subjectProgress) {
        result[subjectId] = 0;
        continue;
      }

      let answeredCount = 0;
      let totalCount = 0;

      for (const chapter of subject.chapters) {
        const chapterProgress = subjectProgress[chapter.chapterId];

        if (chapterProgress) {
          answeredCount += chapterProgress.filter(
            (q) => q !== undefined,
          ).length;
          totalCount += chapterProgress.length;
        } else {
          totalCount += chapter.questionCount;
        }
      }

      result[subjectId] =
        totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    }

    return result;
  }

  onMount(async () => {
    exam = permstate.matricExams.find((e) => e.examId == params.examId);
    if (!exam) {
      const { data } = await getMatricExam(params.examId);
      exam = data;
      permstate.matricExams = [data, ...(permstate.exitExams || [])];
      save(permstate);
    }
    progress = getSubjectProgress(permstate.matricExamProgress, exam);
    loading = false;
  });

  function handleClick(subjectId: string) {
    push(`/matric/${exam?.examId}/${subjectId}`);
  }

  $inspect("the progress of each subject", progress);

  const subjectIcons = {
    agri: Leaf,
    amh: Camera,
    bio: Microscope,
    chem: FlaskConical,
    civics: Landmark,
    eco: BadgeDollarSign,
    eng: Languages,
    general: BookText,
    bus: Building,
    geo: Globe,
    hist: BookOpen,
    ict: Cpu,
    math: Calculator,
    phy: Atom,
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white text-right">
        {loading ? "Loading..." : exam?.examTitle || "Matric Exam"}
      </h1>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    {#if loading}
      <div class="grid grid-cols-2 gap-4 mb-8">
        {#each Array.from({ length: 10 }, (_, i) => i) as i (i)}
          <div class="p-4 rounded-lg border">
            <div class="flex flex-col items-center text-center">
              <Skeleton class="w-10 h-10 mb-2 rounded-full" />
              <Skeleton class="h-4 w-24 mb-3" />
              <Skeleton class="w-full h-2 rounded-full mt-3" />
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-4 mb-8">
        {#each exam?.subjects || [] as subject (subject.subjectId)}
          <button
            class="p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            onclick={() => handleClick(subject.subjectId)}
          >
            <div class="flex flex-col items-center text-center">
              {#if subjectIcons[subject.subjectId.toLowerCase()]}
                {@const IconComponent =
                  subjectIcons[subject.subjectId.toLowerCase()]}
                <IconComponent class="w-10 h-10 mb-2 text-blue-500" />
              {:else}
                <BookText class="w-10 h-10 mb-2 text-blue-500" />
              {/if}
              <h3 class="font-bold">{subject.subjectTitle}</h3>
              <div class="w-full h-2 bg-gray-200 rounded-full mt-3">
                <div
                  class="h-full bg-blue-400 rounded-full"
                  style="width: {progress[subject.subjectId] || 0}%"
                ></div>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
