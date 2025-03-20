<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { ArrowLeft, BookOpen, Play, ChevronDown } from "lucide-svelte";
  import { push } from "svelte-spa-router";
  import { slide, blur } from "svelte/transition";
  import { permstate, save, tempstate } from "../lib/state.svelte";
  import { onMount } from "svelte";
  import type { Course, Chapter, Topic } from "../types.d.ts";
  import { getCourse } from "$lib/api";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const { params } = $props();

  let courseData: Course | "" = $state({});
  let isLoading: boolean = $state(true);

  onMount(async () => {
    courseData =
      [...(permstate.allCourses || []), ...(permstate.myCourses || [])].find(
        ({ courseId }) => courseId == params.courseId,
      ) || null;
    if (!courseData) {
      const { data } = await getCourse(params.courseId);
      courseData = data;
      permstate.allCourses = permstate.allCourses || [];
      permstate.allCourses.unshift(data);
      save(permstate);
    }
    updateTopicStatus();
    courseData.outline[1].topics[2].status = "weak";
    isLoading = false;
  });

  function updateTopicStatus() {
    if (!permstate?.quizResults?.length) {
      console.log("No quiz results to map to");
      return;
    }
    const topicStatusMap = new Map();

    [...permstate.quizResults].reverse().forEach((result) => {
      (result.weakTopics || []).forEach((topic) => {
        topicStatusMap.set(topic.filename, "weak");
      });

      (result.strongTopics || []).forEach((topic) => {
        topicStatusMap.set(topic.filename, "strong");
      });
    });

    courseData.outline.forEach((chapter: Chapter) => {
      if (chapter.topics && Array.isArray(chapter.topics)) {
        chapter.topics.forEach((topic: Topic) => {
          if (!topic.divider && topic.filename) {
            topic.status = topicStatusMap.get(topic.filename) || "";
          }
        });
      }
    });
  }

  const readTopic = (topicFilename: string) => {
    push(`/topic/${params.courseId}/${topicFilename}`);
  };
  const startQuiz = (topicFilename: string) => {
    tempstate.quiz.focus = "normal";
    tempstate.quiz.courseId = params.courseId;
    if (topicFilename) tempstate.quiz.topics = [topicFilename];
    push("/select-topics");
  };

  const getStatusColor = (status: string) =>
    status === "strong"
      ? "text-green-500 bg-green-50"
      : status === "weak"
        ? "text-yellow-500 bg-yellow-50"
        : "";

  const getStatusText = (status: string) =>
    status === "strong"
      ? "Your Strong Topic"
      : status === "weak"
        ? "Your Weak Topic"
        : "";

  const toggleChapter = (chapter: { isExpanded: boolean }) => {
    chapter.isExpanded = !chapter.isExpanded;
  };
</script>

<div in:blur={{ duration: 150 }} class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      {#if isLoading}
        <Skeleton class="h-10 w-48 rounded bg-white/20" />
      {:else}
        <h1 class="text-3xl mb-2 font-bold text-white text-right">
          {courseData.courseTitle}
        </h1>
      {/if}
    </div>
    <div class="flex gap-2 justify-end">
      <Button
        variant="ghost"
        class="bg-blue-100 font-bold"
        onclick={() => startQuiz()}
      >
        <Play class="w-5 h-5 mr-2" />
        Start Quiz
      </Button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    {#if isLoading}
      <div class="space-y-4">
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
        <Skeleton class="h-16 w-full rounded-xl bg-blue-50" />
      </div>
    {:else}
      <div>
        {#each courseData.outline as chapter (chapter)}
          <button
            class="w-full bg-blue-50 mb-2 rounded-xl px-4 py-4 flex justify-between items-center"
            onclick={() => toggleChapter(chapter)}
          >
            <h2 class="text-xl text-left">{chapter.title}</h2>
            <ChevronDown
              class={"transform transition-transform " +
                (chapter.isExpanded ? "rotate-180" : "")}
            />
          </button>
          {#if chapter.isExpanded}
            <div transition:slide={{ duration: 150 }} class="space-y-4 mb-8">
              {#each chapter.topics as topic (topic)}
                {#if topic.divider}
                  <div class="font-bold text-xl text-black">{topic.title}</div>
                {:else}
                  <div class="p-3 rounded-lg border space-y-3">
                    <div class="flex items-center gap-3 flex-wrap">
                      {#if topic.status}
                        <div
                          class={`flex items-center gap-2 px-3 py-0 rounded-full w-fit ${getStatusColor(topic.status)}`}
                        >
                          <span class="text-sm font-bold"
                            >{getStatusText(topic.status)}</span
                          >
                        </div>
                      {/if}
                      <div class="font-bold text-lg text-gray-900">
                        {topic.title}
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => readTopic(topic.filename)}
                      >
                        <BookOpen class="w-4 h-4 mr-1" />
                        <span>Read</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => startQuiz(topic.filename)}
                      >
                        <Play class="w-4 h-4 mr-1" />
                        <span>Quiz Topic</span>
                      </Button>
                      <span class="flex-grow"></span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>
in blur
