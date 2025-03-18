<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import { ArrowRight, Loader2 } from "lucide-svelte";
  import { tempstate, save, permstate } from "$lib/state.svelte";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { getExitExam, getExitQuestions } from "$lib/api";

  let isLoading = $state(true);
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);
  let courses = $state<{ id: string; name: string; selected: boolean }[]>([]);

  let firstSelectedCourseRef = $state<HTMLElement | null>(null);
  let firstSelectedCourseFound = $state(false);

  let isContinueDisabled = $derived(
    !courses?.some((course) => course.selected) || isSubmitting,
  );

  // Scroll to the first selected course when it's available
  $effect(() => {
    if (firstSelectedCourseRef) {
      firstSelectedCourseRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  onMount(async () => {
    try {
      courses = permstate?.exitExams?.find(
        (e) => e?.examId == tempstate?.quiz?.examId,
      )?.courses;

      if (courses && courses?.length > 0) {
        isLoading = false;
        return;
      }
      const { data } = await getExitExam(tempstate?.quiz?.examId);

      courses = data.courses?.map((course) => ({
        id: course.courseId,
        name: course.courseTitle,
        selected: tempstate?.quiz?.courses?.includes(course.id),
      }));
      isLoading = false;
      permstate.exitExams = [data, ...(permstate.exitExams || [])];
      save(permstate);
    } catch (err) {
      console.error("Error loading courses:", err);
      error = "Failed to load courses. Please try again.";
      isLoading = false;
    }
  });

  function setFirstSelectedCourseRef(node: HTMLElement, isSelected: boolean) {
    if (isSelected && !firstSelectedCourseFound) {
      firstSelectedCourseRef = node;
      firstSelectedCourseFound = true;
    }
    return {};
  }

  async function handleContinue() {
    try {
      isSubmitting = true;
      const selectedCourses = courses
        .filter((course) => course.selected)
        .map((course) => course.id);
      const { data } = await getExitQuestions();
      tempstate.quiz.courses = selectedCourses;
      tempstate.quiz.questions = data;
      push("/quiz/0");
    } catch (err) {
      console.error("Error during continue:", err);
      error = "Failed to proceed. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="p-8 bg-blue-50 min-h-screen flex flex-col">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-semibold">Select Courses</h1>
    <Button
      onclick={handleContinue}
      disabled={isContinueDisabled}
      size="lg"
      class="text-lg font-bold"
    >
      {#if isSubmitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        Loading
      {:else}
        Next <ArrowRight />
      {/if}
    </Button>
  </div>

  {#if isLoading}
    <div
      class="space-y-4 flex-grow overflow-y-auto pr-2"
      style="height: calc(100vh - 150px);"
    >
      {#each Array.from({ length: 9 }, (_, i) => i) as i (i)}
        <div class="rounded-lg bg-white p-4">
          <div class="flex items-center gap-3">
            <Skeleton class="h-5 w-5 rounded" />
            <Skeleton class="h-7 w-48" />
          </div>
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
      {#each courses as course (course)}
        <div
          class="rounded-lg bg-white p-4 transition-all cursor-pointer hover:bg-gray-50"
          class:bg-blue-100={course.selected}
          use:setFirstSelectedCourseRef={course.selected}
        >
          <label class="flex items-center gap-3 text-xl font-medium w-full">
            <Checkbox
              checked={course.selected}
              onCheckedChange={() => {
                course.selected = !course.selected;
                console.log(
                  `Course selected: ${course.name} - ${course.selected}`,
                );
              }}
            />
            <span>{course.name}</span>
          </label>
        </div>
      {/each}
    </div>
  {/if}
</div>
