<script lang="ts">
  import { getTopicData } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import { navigateToLink } from "$lib/myutils";
  import type { TopicData } from "../types.d.ts";
  import { fade } from "svelte/transition";
  import { tempstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { Card, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { ArrowLeft, Clock, ArrowRight, Flag, Video } from "lucide-svelte";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const styles = `<style>
    .course h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course p {
          margin-bottom: 1rem;
          line-height: 1.5; /* A bit more readable line height */
          color: #121212; /* Regular readable paragraph color */
          font-size: 1.125rem;
        }

    .course ul,
    .course ol {
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }

    .course li {
          margin-bottom: 0.5rem;
          margin-left: 16px;
          color: #161616;
          list-style-type: disc !important;
          font-size: 1.125rem;
        }

    .course .definition {
          border-left: 4px solid rgb(96 165 250); /* Tailwind's 'blue-400' */
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: rgb(232 240 254); /*Light blue*/
          font-size: 1.125rem;
        }

    .course .definition strong {
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course .note {
    font-size: 1.125rem;
          background-color: rgb(239 246 255); /* Tailwind's 'blue-50' */
          border-left: 6px solid rgb(37 99 235); /* Tailwind's 'blue-700' */
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 0.25rem;
        }

    .course .example {
    font-size: 1.125rem;
    border: 1px solid rgb(219 234 254); /* Tailwind's 'blue-100' */
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 0.25rem;
          color: #121212;
        }

    .course .math-inline {
          font-style: italic;
        }

    .course .math-display {
          display: block;
          margin: 1rem 0;
          padding: 0.5rem;
          background-color: rgb(232 240 254);
          border: 1px solid rgb(147 197 253);
          border-radius: 0.25rem;
          color: rgb(37 99 235); /* Tailwind 'blue-600'*/
        }

    .course pre {
          padding: 1rem;
          overflow-x: auto;
          border-radius: 0.25rem;
        }

    .course code {
          font-family: monospace;
        }

    .course strong {
          font-weight: bold;
        }

    .course em {
            font-style: italic;
        }

    .course u {
          text-decoration: underline;
        }

    .course table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }

    .course th,
    .course td {
          border: 1px solid rgb(156 163 175); /* Tailwind's 'gray-400' */
          padding: 0.5rem;
          text-align: left;
        }

    .course th {
          background-color: rgb(232 240 254); /* Tailwind's 'blue-100' */
          font-weight: bold;
          color: rgb(30 58 138); /* Tailwind's 'blue-900' */
        }

    .course hr {
          border: 0;
          height: 1px;
          background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0),
            rgba(96, 165, 250, 0.75),
            rgba(0, 0, 0, 0)
          );
          margin: 1.5rem 0; /* Larger margin for emphasis */
        }
  </style>`;

  let { params } = $props();
  let topicData: TopicData | null = $state(null);
  let funfactIndex = $state(0);
  let slideIndex = $state(7);
  let difficultyLabel = $derived(
    topicData?.difficulty <= 5
      ? "Easy"
      : topicData?.difficulty <= 8
        ? "Medium"
        : "Challenging",
  );

  const nextFunfact = () => {
    funfactIndex = (funfactIndex + 1) % topicData?.funfacts.length;
  };
  const prevTopic = () => {
    push(`/topic/${params.courseId}/${topicData?.prevTopic?.filename}`);
  };
  const nextTopic = () => {
    push(`/topic/${params.courseId}/${topicData?.nextTopic?.filename}`);
  };
  const startQuiz = () => {
    tempstate.quiz.courseId = params.courseId;
    tempstate.quiz.topics = [topicData?.filename];
    tempstate.quiz.focus = "normal";
    push("/select-topics");
  };

  onMount(async () => {
    const { data } = await getTopicData(params.courseId, params.filename);
    topicData = data;
  });

  let activeTab = $state("main"); // 'main' or 'videos'
  const openVideo = (videoId) => {
    navigateToLink(`https://www.youtube.com/watch?v=${videoId}`);
  };
  const report = () => {
    tempstate.report.topic = {
      title: topicData.title,
      courseId: topicData.courseId,
      filename: params.filename,
    };
    push("/report");
  };
</script>

<div class="bg-blue-500 min-h-screen flex flex-col">
  <div class="px-4 pt-6 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <button onclick={() => history.back()}>
        <ArrowLeft color="white" size="28" />
      </button>
      <div class="flex flex-grow gap-2 ml-2 items-center">
        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all {activeTab ===
          'main'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "main")}
        >
          Slides
        </button>
        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all {activeTab ===
          'videos'
            ? 'bg-white text-blue-500'
            : 'bg-blue-400 text-white'}"
          onclick={() => (activeTab = "videos")}
        >
          Videos
        </button>

        <button
          class="px-4 py-2 text-sm rounded-full font-bold transition-all bg-blue-400 text-white"
          onclick={startQuiz}
        >
          Quiz
        </button>
      </div>
    </div>
  </div>

  <div class="bg-white flex flex-col flex-grow rounded-t-3xl pt-4 pb-4 px-4">
    {#if activeTab === "main"}
      <div in:fade={{ duration: 250 }} class="flex-grow flex flex-col">
        {#if topicData === null}
          <Skeleton class="h-12 w-full rounded-md" />
          <div class="mt-4 space-y-4">
            <Skeleton class="h-4 w-3/5 rounded-md" />
            <Skeleton class="h-4 w-4/5 rounded-md" />
            <Skeleton class="h-4 w-2/5 rounded-md" />
          </div>

          <div class="mt-8">
            <Skeleton class="h-4 w-1/2 rounded-md" />
            <div class="mt-4 space-y-2">
              <Skeleton class="h-24 w-full rounded-md" />
              <Skeleton class="h-4 w-full rounded-md" />
              <Skeleton class="h-4 w-5/6 rounded-md" />
            </div>
          </div>

          <div class="mt-8">
            <Skeleton class="h-4 w-1/3 rounded-md" />
            <div class="mt-4 space-y-2">
              <Skeleton class="h-24 w-full rounded-md" />
              <Skeleton class="h-4 w-full rounded-md" />
              <Skeleton class="h-4 w-5/6 rounded-md" />
            </div>
          </div>
        {:else}
          <div class="flex-grow">
            <div class="overflow-y-auto">
              {#if slideIndex == 0}
                <div class="flex gap-2 flex-wrap mb-2">
                  <span
                    class="flex items-center w-fit bg-green-200 rounded-full px-3 py-1 text-sm font-bold text-green-800"
                  >
                    <Clock class="w-4 h-4 mr-2" />
                    {topicData.duration} minutes
                  </span>

                  <span
                    class="flex items-center w-fit bg-orange-100 rounded-full px-3 py-1 text-sm font-bold text-orange-800"
                  >
                    <Flag class="w-4 h-4 mr-2" />
                    {difficultyLabel} Topic
                  </span>
                </div>

                <div class="flex gap-2 flex-wrap mb-3">
                  {#each topicData.bloomsLevels.slice(0, 2) as level (level)}
                    <span
                      class="flex items-center w-fit bg-blue-100 rounded-full px-3 py-1 text-sm font-bold text-blue-900"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  {/each}
                </div>
              {/if}

              {@html `${styles}<div class="course">${topicData?.slides[slideIndex].slideContent}</div>`}
              {#if slideIndex == topicData.slides.length - 1}
                <Button
                  variant="outline"
                  class="text-red-500 ml-auto"
                  onclick={report}
                >
                  <Flag class="h-4 w-4 mr-2" />
                  Report Feedback
                </Button>
              {/if}
            </div>
          </div>

          {#if slideIndex == topicData.slides.length - 1}
            <Card class="pb-2 pt-1 mb-4">
              <CardHeader class="mt-0 pt-2 px-6">
                <CardTitle class="mt-0 flex flex-col items-start">
                  <div
                    class="bg-blue-100 text-blue-500 rounded-full
                                                px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Next Topic
                  </div>
                  {topicData.nextTopic.title}

                  <Button
                    class="bg-blue-500 text-white font-bold mt-4 ml-auto"
                    onclick={nextTopic}
                  >
                    Open
                    <ArrowRight class="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          {/if}

          <div class="flex justify-between items-center">
            {#if slideIndex == 0}
              <Button
                class="bg-blue-500 text-white font-bold"
                onclick={prevTopic}
              >
                <ArrowLeft class="h-4 w-4" />
                Previous Topic
              </Button>
            {:else}
              <Button
                class="bg-blue-500 text-white"
                size="icon"
                onclick={() => {
                  slideIndex = Math.max(0, slideIndex - 1);
                }}
              >
                <ArrowLeft class="h-4 w-4" />
              </Button>
            {/if}

            <strong>
              {slideIndex + 1} / {topicData.slides.length}
            </strong>
            {#if slideIndex != topicData.slides.length - 1}
              <Button
                size="icon"
                class="bg-blue-500 text-white"
                onclick={() => {
                  slideIndex = Math.min(
                    topicData.slides.length - 1,
                    slideIndex + 1,
                  );
                }}
              >
                <ArrowRight class="h-4 w-4" />
              </Button>
            {/if}
          </div>
        {/if}
      </div>
    {:else if activeTab === "videos"}
      <div in:fade={{ duration: 300 }}>
        <div class="mt-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Recommended Videos
          </h2>
          <div
            class="flex gap-2 items-center bg-pink-50 px-4 py-3 rounded-lg mb-4"
          >
            <div class="text-gray-600 flex flex-col">
              <strong>Fun Fact:</strong>
              {topicData?.funfacts[funfactIndex]}
              <button
                class="font-bold text-gray-900 underline ml-auto"
                onclick={() => nextFunfact()}>More</button
              >
            </div>
          </div>

          <div class="grid gap-4">
            {#if topicData === null}
              {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
                <div
                  class="bg-white rounded-xl text-left overflow-hidden shadow border border-gray-100"
                >
                  <div class="relative">
                    <Skeleton class="w-full h-40" />
                  </div>
                  <div class="p-4">
                    <Skeleton class="h-6 w-3/4 mb-1" />
                    <Skeleton class="h-4 w-1/3" />
                  </div>
                </div>
              {/each}
            {:else}
              {#each topicData.videos as video (video)}
                <button
                  class="bg-white rounded-xl text-left overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onclick={() => openVideo(video.videoId)}
                >
                  <div class="relative">
                    <img
                      src={video.thumbnails[0]}
                      alt={video.videoTitle}
                      class="w-full h-40 object-cover"
                    />
                    <div
                      class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded-md font-medium"
                    >
                      {video.duration}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">
                      {video.videoTitle}
                    </h3>
                    <p class="text-sm text-gray-600 flex items-center">
                      <Video class="w-3 h-3 mr-1" />
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
