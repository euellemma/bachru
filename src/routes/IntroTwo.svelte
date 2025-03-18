<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Combobox from "$lib/mycomps/Combobox.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import { ArrowRight, BookOpenText, Calendar } from "lucide-svelte";
  import { blur } from "svelte/transition";
  import { years, fields, grades } from "../config";
  import { onMount } from "svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";

  let eduFocus = "";

  let selectedField = $state("");
  let selectedYear = $state("freshman");
  let isHighSchool = $state(false);

  const triggerContent = $derived(
    isHighSchool
      ? "Select your grade"
      : (years.find((year) => year.value === selectedYear)?.label ??
          "Select your year"),
  );

  function handleContinue() {
    permstate.userInfo = {
      ...permstate.userInfo,
      dept: selectedField,
      yearOfStudy: selectedYear,
    };
    save(permstate);
    push("/intro-three");
  }

  const selectGrade = (grade: string) => {
    permstate.userInfo.grade = grade;
    save(permstate);
    push("/intro-three");
  };

  onMount(() => {
    if (permstate?.userInfo?.eduFocus) {
      eduFocus = permstate.userInfo.eduFocus;
      isHighSchool = eduFocus === "highschool";
    }
  });
</script>

<div class="relative min-h-screen flex justify-center overflow-hidden flex-col">
  <!-- Background image with blur -->
  <div class="absolute inset-0 z-0">
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#a88563] via-[#165a61] to-[#001618] opacity-80"
      style="backdrop-filter: blur(100px);"
    ></div>
  </div>

  <div class="z-10 text-center p-6 w-full" in:blur={{ duration: 200 }}>
    <div class="space-y-6">
      <h1 class="text-4xl font-bold text-white mb-16">
        {isHighSchool ? "Tell us about class" : "Tell us about your field"}
      </h1>

      {#if isHighSchool}
        <div class="w-full max-w-md mx-auto">
          <div class="flex items-center gap-2 mb-4 text-white text-left">
            <Calendar class="w-5 h-5" />
            <span>Select your grade level:</span>
          </div>
          <div class="flex flex-col gap-2">
            {#each grades as grade (grade)}
              <Card.Root
                class="bg-black bg-opacity-30 border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer border-gray-600"
                onclick={() => selectGrade(grade.value)}
              >
                <Card.Content class="py-4 px-6 flex flex-row items-center">
                  <h2 class="text-lg font-bold text-white">{grade.label}</h2>
                </Card.Content>
              </Card.Root>
            {/each}
          </div>
        </div>
      {:else}
        <div class="w-full flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <BookOpenText class="w-5 h-5" />
            <span>Department/Field</span>
          </div>
          <Combobox
            items={fields}
            bind:value={selectedField}
            placeholder="Select your field of study"
            buttonClass="text-white font-bold py-6 w-full md:w-[280px] justify-between bg-opacity-95"
            contentClass="w-full md:w-[280px] p-0"
            searchPlaceholder="Search fields..."
            emptyMessage="No field found"
          />
        </div>
        <div class="w-full md:w-[280px]">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <Calendar class="w-5 h-5" />
            <span>Year of Study</span>
          </div>
          <Select.Root
            type="single"
            name="yearOfStudy"
            bind:value={selectedYear}
          >
            <Select.Trigger
              class="w-full md:w-[280px] py-6 bg-black bg-opacity-20 text-white font-bold border-white"
            >
              {triggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each years as year (year)}
                  <Select.Item value={year.value} label={year.label}>
                    {year.label}
                  </Select.Item>
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Button
          class="mt-4 text-lg bg-blue-500 font-bold"
          variant="default"
          size="lg"
          disabled={isHighSchool ? false : !selectedField}
          onclick={handleContinue}
        >
          Continue
          <ArrowRight class="w-8 h-8" />
        </Button>
      {/if}
    </div>
  </div>
</div>
