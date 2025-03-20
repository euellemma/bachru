<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, ChevronDown } from "lucide-svelte";
  import { tempstate, permstate, save } from "$lib/state.svelte";
  import { getCourse } from "$lib/api";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let chapters = $state<
    {
      title: string;
      expanded: boolean;
      selectAll: boolean;
      topics: { name: string; selected: boolean; filename: string }[];
    }[]
  >([]);

  let firstSelectedTopicRef = $state<HTMLElement | null>(null);
  let firstSelectedTopicFound = $state(false);
  $effect(() => {
    if (firstSelectedTopicRef) {
      console.log("Scrolling to first selected topic");
      firstSelectedTopicRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  onMount(async () => {
    console.log("SelectTopics onMount called");
    try {
      let course = [
        ...(permstate.allCourses || []),
        ...(permstate.myCourses || []),
      ].find(({ courseId }) => courseId === tempstate.quiz.courseId);
      let courseOutline = course?.outline;
      if (!courseOutline) {
        const { data } = await getCourse(tempstate.quiz.courseId);
        courseOutline = data.outline;
        permstate.allCourses = permstate.allCourses || [];
        permstate.allCourses.push(data);
        save(permstate);
      }
      const previouslySelectedTopics = tempstate.quiz.topics || [];
      chapters = courseOutline.map((section) => {
        const topics = section.topics
          ? section.topics.map((topic) => ({
              name: topic.title,
              filename: topic.filename,
              selected: previouslySelectedTopics.includes(topic.filename),
            }))
          : [];

        // Check if all topics in this chapter are selected
        const allTopicsSelected =
          topics.length > 0 && topics.every((topic) => topic.selected);

        return {
          title: section.title,
          expanded: topics.some((topic) => topic.selected), // Auto-expand chapters with selected topics
          selectAll: allTopicsSelected,
          topics,
        };
      });

      console.log("Transformed course outline into chapters:", chapters);
      isLoading = false;
    } catch (err) {
      console.error("Error loading topics:", err);
      error = "Failed to load topics. Please try again.";
      isLoading = false;
    }
  });

  function toggleChapter(index: number) {
    console.log(`toggleChapter called for index: ${index}`);
    console.log(`Current expanded state: ${chapters[index].expanded}`);
    chapters[index].expanded = !chapters[index].expanded;
    console.log(`New expanded state: ${chapters[index].expanded}`);
  }

  function toggleSelectAll(chapterIndex: number) {
    console.log(`toggleSelectAll called for chapterIndex: ${chapterIndex}`);
    console.log(`Current selectAll state: ${chapters[chapterIndex].selectAll}`);
    chapters[chapterIndex].selectAll = !chapters[chapterIndex].selectAll;
    console.log(`New selectAll state: ${chapters[chapterIndex].selectAll}`);

    chapters = chapters.map((chapter, idx) => {
      if (idx === chapterIndex) {
        console.log(
          `Updating all topics in chapter ${idx} to selected: ${chapter.selectAll}`,
        );
        return {
          ...chapter,
          topics: chapter.topics.map((topic) => ({
            ...topic,
            selected: chapter.selectAll,
          })),
        };
      }
      return chapter;
    });
    console.log("Updated chapters after toggleSelectAll:", chapters);
  }

  function updateSelectAll(chapterIndex: number) {
    console.log(`updateSelectAll called for chapterIndex: ${chapterIndex}`);
    const chapter = chapters[chapterIndex];
    const allSelected = chapter.topics.every((topic) => topic.selected);
    console.log(
      `All topics selected in chapter ${chapterIndex}? ${allSelected}`,
    );
    chapter.selectAll = allSelected;
    console.log(`Updated selectAll state: ${chapter.selectAll}`);
  }

  function setFirstSelectedTopicRef(node: HTMLElement, isSelected: boolean) {
    if (isSelected && !firstSelectedTopicFound) {
      firstSelectedTopicRef = node;
      firstSelectedTopicFound = true;
    }
    return {};
  }

  let isContinueDisabled = $derived(
    !chapters.some((chapter) => chapter.topics.some((topic) => topic.selected)),
  );

  function handleContinue() {
    const selectedTopics = chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.selected)
        .map((topic) => topic.filename),
    );
    tempstate.quiz.topics = selectedTopics;
    push("/quest-type");
  }
</script>

<div class="p-8 bg-blue-50 min-h-screen flex flex-col">
  <div class="flex justify-between items-center mb-2">
    <h1 class="text-2xl font-semibold">Select Topics</h1>
    <Button
      onclick={handleContinue}
      disabled={isContinueDisabled}
      size="lg"
      class="text-lg font-bold"
    >
      Next <ArrowRight />
    </Button>
  </div>

  {#if isLoading}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      <!-- Skeleton loading states for chapters -->
      {#each Array(5) as _, i}
        <div class="rounded-lg bg-white">
          <div class="w-full p-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <Skeleton class="h-5 w-5 rounded" />
              <Skeleton class="h-7 w-48" />
            </div>
            <Skeleton class="h-6 w-6 rounded-full" />
          </div>
          {#if i % 2 === 0}
            <div class="p-4 border-t-2">
              <div class="space-y-3">
                {#each Array(4) as _, j}
                  <div class="flex items-center gap-3 p-2">
                    <Skeleton class="h-5 w-5 rounded" />
                    <Skeleton class="h-6 w-40" />
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="flex-grow flex items-center justify-center">
      <p class="text-xl text-red-500">{error}</p>
    </div>
  {:else}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      {#each chapters as chapter, chapterIndex}
        <div class="rounded-lg bg-white">
          <div class="w-full p-4 flex justify-between items-center">
            <label class="flex items-center gap-3 text-xl font-medium">
              <Checkbox
                checked={chapter.selectAll}
                onCheckedChange={() => toggleSelectAll(chapterIndex)}
              />
              <span>{chapter.title}</span>
            </label>
            <button onclick={() => toggleChapter(chapterIndex)}>
              <ChevronDown
                class={"transform transition-transform " +
                  (chapter.expanded ? "rotate-180" : "")}
              />
            </button>
          </div>

          {#if chapter.expanded}
            <div class="p-4 border-t-2">
              <div class="space-y-2">
                {#each chapter.topics as topic, topicIndex}
                  <label
                    class="flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-gray-50"
                    class:bg-blue-100={topic.selected}
                    use:setFirstSelectedTopicRef={topic.selected}
                  >
                    <Checkbox
                      checked={topic.selected}
                      onCheckedChange={() => {
                        topic.selected = !topic.selected;
                        console.log(
                          `Topic checkbox changed: ${chapter.title} - ${topic.name} - new state: ${topic.selected}`,
                        );
                        updateSelectAll(chapterIndex);
                      }}
                    />
                    <span class="text-lg">{topic.name}</span>
                  </label>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
