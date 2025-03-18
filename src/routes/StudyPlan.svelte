<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import {
    ArrowLeft,
    BookOpen,
    Play,
    CircleAlert,
    ChevronDown,
    CheckCircle,
  } from "lucide-svelte";
  import { tempstate, permstate } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { slide, fade, fly } from "svelte/transition";
  import { Skeleton } from "$lib/components/ui/skeleton";

  let activeTab = $state("weak"); // 'weak' or 'strong'
  let studyPlanData = $state({
    chapters: [],
  });
  let isLoading = $state(true);
  let displayPlan = $derived({
    chapters: studyPlanData.chapters
      .map((chapter) => ({
        ...chapter,
        topics: chapter.topics.filter((topic) => topic.status === activeTab),
      }))
      .filter((chapter) => chapter.topics.length > 0),
  });
  async function createMatricOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by chapter
    const chapterMap = new Map();

    // Track the order of chapters as they first appear in topics
    const chapterOrder = [];

    // Combine weak and strong topics to process them in the original order
    const allTopics = [...weakTopics, ...strongTopics];

    // Process all topics in order
    allTopics.forEach((topic) => {
      const chapterKey = topic.chapterFilename || topic.chapterTitle;

      // If this is the first time we see this chapter, add it to our order array
      if (!chapterMap.has(chapterKey)) {
        chapterMap.set(chapterKey, {
          title: topic.chapterTitle,
          topics: [],
          isExpanded: true,
          grade: topic.grade || "",
        });
        chapterOrder.push(chapterKey);
      }

      // Determine if this is a weak or strong topic
      const status = weakTopics.includes(topic) ? "weak" : "strong";

      chapterMap.get(chapterKey).topics.push({
        title: topic.title,
        status: status,
        filename: topic.filename,
      });
    });

    // Convert map to array using the order we tracked
    result.chapters = chapterOrder.map((key) => chapterMap.get(key));

    return result;
  }
  async function createExitOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by course
    const courseMap = new Map();

    // Process weak topics
    weakTopics.forEach((topic) => {
      const courseId = topic.courseId;
      const courseTitle = topic.courseTitle;

      if (!courseId || !courseTitle) {
        console.warn("Topic missing courseId or courseTitle", topic);
        return;
      }

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          title: courseTitle,
          topics: [],
          isExpanded: true,
        });
      }

      courseMap.get(courseId).topics.push({
        title: topic.title,
        status: "weak",
        filename: topic.filename,
        courseId: courseId,
      });
    });

    // Process strong topics
    strongTopics.forEach((topic) => {
      const courseId = topic.courseId;
      const courseTitle = topic.courseTitle;

      if (!courseId || !courseTitle) {
        console.warn("Topic missing courseId or courseTitle", topic);
        return;
      }

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          title: courseTitle,
          topics: [],
          isExpanded: true,
        });
      }

      courseMap.get(courseId).topics.push({
        title: topic.title,
        status: "strong",
        filename: topic.filename,
        courseId: courseId,
      });
    });

    // Convert map to array and add to result
    for (const chapter of courseMap.values()) {
      if (chapter.topics.length > 0) {
        result.chapters.push(chapter);
      }
    }

    return result;
  }

  async function createQuizOutline() {
    const quizResult = permstate.quizResults?.[0];
    if (!quizResult) {
      console.error("No quiz result found");
      isLoading = false;
      return;
    }

    const weakTopics = quizResult.weakTopics || [];
    const strongTopics = quizResult.strongTopics || [];

    const result = {
      chapters: [],
    };

    // Create a map to group topics by chapter
    const chapterMap = new Map();

    // Track the order of chapters as they first appear in topics
    const chapterOrder = [];

    // Combine weak and strong topics to process them in the original order
    const allTopics = [...weakTopics, ...strongTopics];

    // Process all topics in order
    allTopics.forEach((topic) => {
      const chapterKey = topic.chapterFilename || topic.chapterTitle;

      // If this is the first time we see this chapter, add it to our order array
      if (!chapterMap.has(chapterKey)) {
        chapterMap.set(chapterKey, {
          title: topic.chapterTitle,
          topics: [],
          isExpanded: true,
        });
        chapterOrder.push(chapterKey);
      }

      // Determine if this is a weak or strong topic
      const status = weakTopics.includes(topic) ? "weak" : "strong";

      chapterMap.get(chapterKey).topics.push({
        title: topic.title,
        status: status,
        filename: topic.filename,
      });
    });

    // Convert map to array using the order we tracked
    result.chapters = chapterOrder.map((key) => chapterMap.get(key));

    return result;
  }
  onMount(async () => {
    isLoading = true;

    if (tempstate.quiz.focus == "normal") studyPlanData = createQuizOutline();
    if (tempstate.quiz.focus == "exitexam") studyPlanData = createExitOutline();
    if (tempstate.quiz.focus == "matric") studyPlanData = createMatricOutline();
    isLoading = false;
  });

  // $inspect("how study plan changes", studyPlanData);

  const getStatusColor = (status: string) =>
    status === "strong"
      ? "text-green-500 bg-green-50"
      : status === "weak"
        ? "text-red-500 bg-red-50"
        : "";
  const getStatusText = (status: string) =>
    status === "strong"
      ? "Strong Topic"
      : status === "weak"
        ? "Weak Topic"
        : "";

  const readTopic = (topic: { filename: string; courseId: string }) => {
    if (tempstate.quiz.focus == "normal") {
      push(`/topic/${tempstate.quiz?.courseId || "default"}/${topic.filename}`);
    }
    if (
      tempstate.quiz.focus == "exitexam" ||
      tempstate.quiz.focus == "matric"
    ) {
      push(`/topic/${topic.courseId}/${topic.filename}`);
    }
  };

  const practice = (topic: { filename: string; courseId: string }) => {
    if (tempstate.quiz.focus == "normal") {
      tempstate.quiz.topics = [topic.filename];
      push("/select-topics");
    }
    if (tempstate.quiz.focus == "exitexam") {
      tempstate.quiz.courses = [topic.courseId];
      push("/select-courses");
    }
  };

  const toggleChapter = (chapter: { isExpanded: boolean }) => {
    chapter.isExpanded = !chapter.isExpanded;
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white">Study Plan</h1>
    </div>
    <div class="flex gap-1 justify-end">
      <button
        class="px-6 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'weak'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "weak")}
      >
        Weak Topics
      </button>
      <button
        class="px-6 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'strong'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "strong")}
      >
        Strong Topics
      </button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <div class="flex items-center justify-between py-2">
      <div
        class={`flex items-center gap-2 px-3 py-1.5 rounded-full ${activeTab === "weak" ? "text-yellow-500 bg-yellow-50" : "text-green-500 bg-green-50"}`}
      >
        <div class="flex items-center gap-2">
          {#if activeTab === "weak"}
            <CircleAlert class="w-6 h-6" />
            <span class="text-xl font-semibold">Topics to Focus On</span>
          {:else}
            <CheckCircle class="w-6 h-6" />
            <span class="text-xl font-semibold">Mastered Topics</span>
          {/if}
        </div>
      </div>
    </div>

    <div>
      {#if isLoading}
        <!-- Skeleton loader while loading -->
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <div class="mb-4">
            <Skeleton class="w-full h-14 mb-2 rounded-xl" />
            <div class="space-y-4 pl-2">
              {#each Array.from({ length: 3 }, (_, j) => j) as j (j)}
                <div class="p-3 space-y-3">
                  <div class="flex items-center gap-3">
                    <Skeleton class="h-6 w-3/4" />
                    <Skeleton class="h-5 w-20 rounded-full" />
                  </div>
                  <div class="flex gap-2">
                    <Skeleton class="h-9 w-24" />
                    <Skeleton class="h-9 w-24" />
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {:else if displayPlan.chapters.length === 0}
        <!-- Empty state messages -->
        <div class="text-center py-10 px-4" in:fade={{ duration: 300 }}>
          {#if activeTab === "weak"}
            <div class="flex flex-col items-center gap-4">
              <CircleAlert class="w-16 h-16 text-yellow-400" />
              <h3 class="text-xl font-semibold text-gray-800">
                No Weak Topics Found
              </h3>
              <p class="text-gray-600 max-w-md">
                Great job! You don't have any topics that need improvement. Keep
                up the good work or check your strong topics.
              </p>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-4">
              <CheckCircle class="w-16 h-16 text-green-400" />
              <h3 class="text-xl font-semibold text-gray-800">
                No Mastered Topics Yet
              </h3>
              <p class="text-gray-600 max-w-md">
                You haven't mastered any topics yet. Keep practicing and take
                more quizzes to identify your strengths.
              </p>
            </div>
          {/if}
        </div>
      {:else}
        {#each displayPlan.chapters as chapter (chapter)}
          <button
            in:slide={{ duration: 300 }}
            class="w-full bg-blue-50 mb-2 rounded-xl px-4 py-4 flex justify-between items-center"
            onclick={() => toggleChapter(chapter)}
          >
            <h2 class="text-xl text-left">
              {chapter.title}{!chapter.grade ? "" : ` (${chapter.grade})`}
            </h2>
            <ChevronDown
              class={"transform transition-transform " +
                (chapter.isExpanded ? "rotate-180" : "")}
            />
          </button>
          {#if chapter.isExpanded}
            <div class="space-y-4 mb-8">
              <div class="space-y-4">
                {#each chapter.topics.filter( (topic) => (activeTab === "weak" ? topic.status === "weak" : topic.status === "strong"), ) as topic, i (topic)}
                  <div
                    class="p-3 rounded-lg border space-y-3 mb-4"
                    in:fly={{ y: -50, duration: 300, delay: i * 50 }}
                    out:fade={{ duration: 0 }}
                  >
                    <div class="flex items-center gap-3 flex-wrap">
                      <div class="font-bold text-lg text-gray-900">
                        {topic.title}
                      </div>
                      <div
                        class={`flex items-center gap-2 px-3 py-0 rounded-full w-fit ${getStatusColor(topic.status)}`}
                      >
                        <span class="text-xs font-bold"
                          >{getStatusText(topic.status)}</span
                        >
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        class="flex items-center justify-center"
                        onclick={() => readTopic(topic)}
                      >
                        <BookOpen class="w-4 h-4 mr-1" />
                        <span>Read</span>
                      </Button>
                      {#if tempstate.quiz.focus != "matric"}
                        <Button
                          size="sm"
                          variant="secondary"
                          class="flex items-center justify-center"
                          onclick={() => practice(topic)}
                        >
                          <Play class="w-4 h-4 mr-1" />
                          <span>Practice Topic</span>
                        </Button>
                      {/if}
                      <span class="flex-grow"></span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>
