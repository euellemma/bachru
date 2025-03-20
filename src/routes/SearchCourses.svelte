<script lang="ts">
  import { Card, CardContent } from "../lib/components/ui/card";
  import { Search, X } from "lucide-svelte";
  import { permstate, tempstate, save } from "../lib/state.svelte";
  import { searchCourses, requestCourse } from "../lib/api";
  import type { Course } from "../types.d";
  import { Skeleton } from "../lib/components/ui/skeleton";
  import { onMount } from "svelte";
  import { Input } from "../lib/components/ui/input";
  import { Button } from "../lib/components/ui/button";
  import { devusename } from "../config";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { toast } from "svelte-sonner";
  import { push } from "svelte-spa-router";

  let searchQuery = $state("");
  let searchResults = $state<Course[]>([]);
  let isLoading = $state(true);
  let isRequestingCourse = $state(false);
  let searchTimeout = $state<number | null>(null);
  const DEBOUNCE_TIME = 300; // 300ms debounce time
  let newCourseName = $state("");

  onMount(async () => {
    try {
      const results = await searchCourses("", permstate.userInfo.eduFocus);
      searchResults = results.data;
      isLoading = false;
    } catch (error) {
      console.error("Error fetching courses:", error);
      isLoading = false;
    }
  });

  const handleCardClick = (course: Course) => {
    if (!permstate.myCourses) {
      permstate.myCourses = [];
    }
    const courseExists = permstate.myCourses.some(
      (c) => c.courseId === course.courseId,
    );
    if (!courseExists) {
      permstate.myCourses.unshift(course);
    }

    tempstate.quiz = {
      ...tempstate.quiz,
      courseId: course.courseId,
      focus: "normal",
      topics: [],
    };
    save(permstate);

    push("/select-topics");
  };

  async function handleSearch() {
    isLoading = true;
    try {
      const results = await searchCourses(
        searchQuery,
        permstate.userInfo.eduFocus,
      );
      searchResults = results.data;
    } catch (error) {
      console.error("Error searching courses:", error);
    } finally {
      isLoading = false;
    }
  }

  function clearSearch() {
    searchQuery = "";
    handleSearch();
  }

  // Debounced search function that triggers when user types
  function debouncedSearch() {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = setTimeout(() => {
      handleSearch();
    }, DEBOUNCE_TIME);
  }

  // Watch for changes to searchQuery
  let prevSearchQuery = $state(searchQuery);
  $effect(() => {
    if (searchQuery !== undefined && searchQuery !== prevSearchQuery) {
      prevSearchQuery = searchQuery;
      debouncedSearch();
    }
  });

  async function handleRequestCourse() {
    if (!newCourseName.trim()) return;

    isRequestingCourse = true;
    try {
      const success = await requestCourse(newCourseName);
      if (success) {
        toast.success(
          `Thanks! I've added "${newCourseName}" to our list. If you have materials for this course, feel free to share them with me on Telegram!`,
        );
        newCourseName = "";
      } else {
        toast.error("Failed to request course. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting course:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      isRequestingCourse = false;
    }
  }
</script>

<div class="container mx-auto p-4 bg-accent min-h-screen">
  <div class="flex items-center mb-2 mt-4">
    <h1 class="text-3xl font-bold flex-1">Search Courses</h1>
  </div>

  <div class="flex mb-4">
    <div class="w-full relative border-4 border-blue-200 rounded-lg">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Type course here..."
        class="w-full pl-4 pr-12 py-3 text-lg font-medium rounded-lg bg-white/95"
      />
      {#if searchQuery}
        <button
          class="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500"
          onclick={clearSearch}
        >
          <X size={20} />
        </button>
      {/if}
      <button
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        onclick={handleSearch}
      >
        <Search size={20} />
      </button>
    </div>
  </div>

  <div class="mt-2">
    {#if isLoading}
      {#each Array.from({ length: 5 }, (_, i) => i) as i (i)}
        <Card class="mb-3 border-0 ">
          <CardContent class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Skeleton class="h-8 w-8 rounded-full" />
                <Skeleton class="h-6 w-48" />
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <Skeleton class="h-9 w-20" />
              <Skeleton class="h-9 w-20" />
            </div>
          </CardContent>
        </Card>
      {/each}
    {:else if searchResults.length > 0}
      {#each searchResults as course (course.courseId)}
        <Card
          class="mb-3 bg-white text-lg border-2 cursor-pointer hover:shadow-lg transition-shadow"
          onclick={() => handleCardClick(course)}
        >
          <CardContent class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl mr-1">{course.emoji || "📚"}</span>
                <span class="text-left text-lg font-bold"
                  >{course.courseTitle}</span
                >
              </div>
            </div>
          </CardContent>
        </Card>
      {/each}
    {:else}
      <Search class="h-12 w-12 mx-auto mb-3 mt-10 text-gray-400" />
      <h2 class="text-xl text-center font-medium mb-8">Course not found</h2>
      <Card class="mb-3">
        <CardContent class="text-center p-8">
          <div class="mt-2">
            <h3 class="text-lg mb-8 font-medium">
              Tell me the name of the course and I will add it
            </h3>
            <div class="flex gap-2">
              <Input
                type="text"
                bind:value={newCourseName}
                placeholder="Enter course name..."
                class="flex-1"
              />
              <Button
                variant="default"
                onclick={handleRequestCourse}
                disabled={isRequestingCourse || !newCourseName.trim()}
              >
                {#if isRequestingCourse}
                  Submitting...
                {:else}
                  Submit
                {/if}
              </Button>
            </div>
            <Separator class="mt-8 mb-6" />
            <p class="text-lg">
              or send me the modules on telegram <a
                href="https://t.me/{devusename}"
                class="text-blue-600"
                target="_blank"
                rel="noopener noreferrer">@{devusename}</a
              >
            </p>
          </div>
        </CardContent>
      </Card>
    {/if}
  </div>
</div>
