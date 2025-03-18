<script lang="ts">
  import { Card, CardContent } from "../lib/components/ui/card";
  import { Button } from "../lib/components/ui/button";
  import {
    ArrowRight,
    Settings,
    EllipsisVertical,
    X,
    Search,
    Plus,
    CheckCircle,
  } from "lucide-svelte";
  import { permstate, save } from "../lib/state.svelte";
  import { push } from "svelte-spa-router";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "../lib/components/ui/dialog";
  import { searchCourses } from "../lib/api";
  import type { Course } from "../types.d";
  import { Skeleton } from "../lib/components/ui/skeleton";

  let searching = $state(false);
  let searchMode = $state(false);
  let confirmDeleteDialog = $state(false);
  let courseToDelete = $state<string | null>(null);
  let searchQuery = $state("");
  let searchResults = $state<Course[]>([]);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let isLoading = $state(false);
  let addedCourses = $state<Record<string, boolean>>({});

  const removeCourse = (courseId: string) => {
    courseToDelete = courseId;
    confirmDeleteDialog = true;
  };

  const confirmRemoveCourse = () => {
    console.log("yes remove this course", courseToDelete);
    confirmDeleteDialog = false;
    courseToDelete = null;
  };

  const cancelRemoveCourse = () => {
    confirmDeleteDialog = false;
    courseToDelete = null;
  };

  const openCourse = (courseId: string) => {
    const currentIndex = permstate.myCourses.findIndex(
      (c) => c.courseId === courseId,
    );
    if (currentIndex > 0) {
      const course = permstate.myCourses.splice(currentIndex, 1)[0];
      permstate.myCourses.unshift(course);
    }
    save(permstate);
    push(`/course/${courseId}`);
  };

  const addCourse = (course) => {
    permstate.myCourses.unshift(course);
    addedCourses[course.courseId] = true;
    save(permstate);
  };

  function stopSearch() {
    searching = false;
    searchMode = false;
    searchQuery = "";
    searchResults = [];
  }

  function handleSearch(query: string) {
    searchQuery = query;
    searching = query.length > 0;
    isLoading = true;

    // Clear the previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout for debounce
    searchTimeout = setTimeout(async () => {
      if (query.length > 0) {
        const results = await searchCourses(query);
        searchResults = results.data;
        isLoading = false;
      } else {
        searchResults = [];
        isLoading = false;
      }
    }, 300); // 300ms debounce
  }

  function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (
        node &&
        !node.contains(event.target as Node) &&
        event.target !== node
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<div
  class="container mx-auto p-4 pt-12 pb-20 bg-accent min-h-screen flex flex-col"
>
  <div class="flex">
    <div class="flex-1 flex items-center mb-4 rounded-lg">
      {#if searchMode}
        <X
          strokeWidth="3"
          class="text-gray-800 h-6 w-6 mx-4"
          onclick={stopSearch}
        />
      {/if}
      <div class="relative w-full border-4 border-blue-200 rounded-lg">
        <input
          type="text"
          value={searchQuery}
          onfocus={() => (searchMode = true)}
          onkeyup={(e) => handleSearch(e.currentTarget.value)}
          placeholder="Search courses..."
          class="w-full pl-4 pr-12 py-3 text-lg font-medium rounded-lg border-3 shadow-lg bg-white/95"
        />
      </div>
      <Settings
        onclick={() => push("/settings")}
        size="2rem"
        class="ml-3 mr-1 text-gray-800"
      />
    </div>
  </div>

  {#if searchMode && searching}
    <div class="mt-2">
      {#if isLoading}
        {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
          <Card class="mb-3 border-0 shadow-sm">
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
        {#each searchResults as course (course)}
          <Card class="mb-3 bg-white text-lg border-0 shadow-md">
            <CardContent class="pb-4">
              <div class="flex items-center justify-between">
                <button
                  onclick={() => openCourse(course.courseId)}
                  class="hover:underline flex items-center gap-2"
                >
                  <span class="text-2xl mr-1">{course.emoji || "📚"}</span>
                  <span class="text-left text-lg font-bold"
                    >{course.courseTitle}</span
                  >
                </button>
              </div>
              <div class="flex justify-end gap-2 mt-2">
                {#if addedCourses[course.courseId] || permstate.myCourses
                    .map(({ courseId }) => courseId)
                    .includes(course.courseId)}
                  <Button
                    variant="ghost"
                    class="bg-green-100 text-green-700 h-9"
                    >Added<CheckCircle /></Button
                  >
                {:else}
                  <Button
                    variant="ghost"
                    class="bg-blue-50 h-9"
                    onclick={() => addCourse(course)}>Add<Plus /></Button
                  >
                {/if}
                <Button
                  variant="ghost"
                  class="bg-blue-50 h-9"
                  onclick={() => openCourse(course.courseId)}
                  >Open<ArrowRight /></Button
                >
              </div>
            </CardContent>
          </Card>
        {/each}
      {:else}
        <div class="text-center p-4 text-gray-500">
          No courses found. Try a different search term.
        </div>
      {/if}
    </div>
  {:else if searchMode && !searching}
    <div class="mt-2">
      <div class="text-center p-8 text-gray-600">
        <Search class="h-8 w-8 mx-auto mb-3 text-gray-400" />
        <p class="text-xl font-medium">Start typing to search for courses</p>
        <p class="text-sm mt-2">Enter a course name, subject, or keyword</p>
      </div>
    </div>
  {:else}
    <Card
      class="mb-4 border-0 bg-blue-100 border-blue-200 border-2 relative overflow-hidden"
      onclick={() => push("/past-exams")}
    >
      <CardContent class="py-4 px-4">
        <div class="flex items-center">
          <span class="text-2xl mr-2">🗒</span>
          <div class="flex-grow">
            <div class="text-xl font-bold">
              {permstate.userInfo.examFocus == "matric"
                ? "Matric Exams"
                : "Exit Exams"}
            </div>
            <div class="text-sm">2016, 2015 and more...</div>
          </div>
          <ArrowRight />
        </div>
      </CardContent>
    </Card>
    {#each permstate.myCourses as course (course)}
      <Card class="mb-3 bg-white text-lg shadow-sm">
        <CardContent>
          <div class="flex items-center justify-between">
            <button
              onclick={() => openCourse(course.courseId)}
              class="hover:underline flex items-center gap-2"
            >
              <span class="text-2xl mr-2">{course.emoji}</span>
              <span class="text-left">{course.courseTitle}</span>
            </button>
            {#if course.isHighschool == false || course.grade != permstate.userInfo.grade}
              <div
                class="relative"
                use:clickOutside={() => (course.showMenu = false)}
              >
                <button
                  class="text-gray-700"
                  onclick={(e) => {
                    e.stopPropagation();
                    course.showMenu = !course.showMenu;
                  }}
                >
                  <EllipsisVertical />
                </button>
                {#if course.showMenu}
                  <div
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border"
                  >
                    <div class="py-1">
                      <button
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onclick={() => openCourse(course.courseId)}>Open</button
                      >
                      <button
                        class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onclick={() => removeCourse(course.courseId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>
    {/each}
  {/if}
</div>

<Dialog bind:open={confirmDeleteDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Remove Course</DialogTitle>
      <DialogDescription>
        Are you sure you want to remove this course? This action cannot be
        undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter class="gap-2">
      <Button variant="outline" onclick={cancelRemoveCourse}>Cancel</Button>
      <Button variant="destructive" onclick={confirmRemoveCourse}>Remove</Button
      >
    </DialogFooter>
  </DialogContent>
</Dialog>
