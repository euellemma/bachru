<script lang="ts">
  import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import {
    PanelRight,
    Loader,
    ArrowRight,
    BookOpen,
    Video,
    Brain,
    Lightbulb,
    Dices,
    HelpCircle,
    Info,
    List,
    BookMarked,
    Undo,
  } from "lucide-svelte";
  import { blur, scale } from "svelte/transition";
  import { push } from "svelte-spa-router";
  import { getCourseForEduFocus } from "$lib/api";
  import { permstate, save } from "$lib/state.svelte";
  import type { EduFocus } from "../types.d.ts";

  let loading = $state(false);

  const handleContinue = async () => {
    loading = true;

    try {
      const eduFocus = permstate.userInfo?.eduFocus as EduFocus;
      const deptOrGrade =
        eduFocus === "highschool"
          ? permstate.userInfo?.grade
          : permstate.userInfo?.dept;

      if (eduFocus && deptOrGrade) {
        const response = await getCourseForEduFocus(eduFocus, deptOrGrade);

        if (response.data) {
          permstate.myCourses = response.data;
          save(permstate);
        }
      }

      push("/search-courses");
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      loading = false;
    }
  };
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div
    class="z-10 container flex-grow flex flex-col justify-between py-8 mx-auto p-4"
    in:blur={{ duration: 200 }}
  >
    <div class="text-3xl text-white font-bold text-center">
      How GebiApp works
    </div>
    <div>
      <div class="flex justify-center" in:scale={{ delay: 100, duration: 500 }}>
        <Undo size={80} style="transform: rotate(-15deg);" class="text-white" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
        <!-- First Card -->

        <div in:blur={{ duration: 400, delay: 100 }}>
          <Card
            class="w-full shadow-md bg-black bg-opacity-20 text-white border-gray-700"
          >
            <CardHeader class="p-3">
              <PanelRight size={30} />
              <span class="text-lg font-bold">Learn about</span>
              <span class="text-sm opacity-80">Linear Equations</span>
            </CardHeader>
            <CardContent class="p-3">
              <div class="space-y-2 font-bold">
                {#each [{ icon: BookOpen, text: "Read" }, { icon: Video, text: "Videos" }, { icon: Brain, text: "Simplified" }, { icon: Lightbulb, text: "Fun Facts" }] as item (item)}
                  <div
                    class="flex items-center gap-1 p-2 hover:bg-black hover:bg-opacity-30 rounded-md transition-all cursor-pointer text-sm"
                  >
                    <item.icon size={24} class="text-white p-1 rounded-md" />
                    <span>{item.text}</span>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Second Card -->
        <div in:blur={{ duration: 400, delay: 200 }}>
          <Card
            class="w-full shadow-md bg-black bg-opacity-20 text-white border-gray-700"
          >
            <CardHeader class="p-3">
              <Dices size={30} />
              <span class="text-lg font-bold">Quiz on</span>
              <span class="text-sm opacity-80">Linear Equations</span>
            </CardHeader>
            <CardContent class="p-3">
              <div class="space-y-2 font-bold">
                {#each [{ icon: HelpCircle, text: "Hints" }, { icon: Info, text: "Explanations" }, { icon: List, text: "Study Plan" }, { icon: BookMarked, text: "Read Topics" }] as item (item)}
                  <div
                    class="flex items-center gap-1 p-2 hover:bg-black hover:bg-opacity-30 rounded-md transition-all cursor-pointer text-sm"
                  >
                    <item.icon size={24} class="text-white p-1 rounded-md" />
                    <span>{item.text}</span>
                  </div>
                {/each}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div class="flex justify-center" in:scale={{ duration: 500, delay: 400 }}>
        <Undo size={80} style="transform: rotate(165deg);" class="text-white" />
      </div>
    </div>

    <div class="flex justify-center w-full">
      <Button
        class="text-lg bg-blue-500 font-bold"
        variant="default"
        size="lg"
        onclick={handleContinue}
        disabled={loading}
      >
        {#if loading}
          Loading Courses
          <div class="animate-spin mr-2">
            <Loader size={20} />
          </div>
        {:else}
          Start Quiz
          <ArrowRight class="ml-2 w-5 h-5" />
        {/if}
      </Button>
    </div>
  </div>
</div>
