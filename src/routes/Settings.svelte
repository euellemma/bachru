<script lang="ts">
  import { Card } from "$lib/components/ui/card";
  import Combobox from "$lib/mycomps/Combobox.svelte";
  import * as Select from "$lib/components/ui/select/index.js";
  import {
    Star,
    BookOpenText,
    Calendar,
    MessageCircle,
    ArrowLeft,
    User,
    FileCheck,
    GraduationCap,
  } from "lucide-svelte";
  import { blur } from "svelte/transition";
  import { permstate, save } from "$lib/state.svelte";
  import { fields, years, grades } from "../config";
  import { getCourseForEduFocus } from "$lib/api";

  let eduFocus = $state(permstate.userInfo.eduFocus || "highschool");
  let dept = $state(permstate.userInfo.dept || fields[0].value);
  let yearOfStudy = $state(permstate.userInfo.yearOfStudy || years[0].value);
  let gender = $state(permstate.userInfo.gender || "male");
  let examFocus = $state(permstate.userInfo.examFocus || "matric");
  let grade = $state(permstate.userInfo.grade || grades[0].value);

  const triggerContent = $derived(
    permstate.userInfo.eduFocus == "highschool"
      ? "Select your grade"
      : (years.find((year) => year.value === yearOfStudy)?.label ??
          "Select your year"),
  );

  $effect(async () => {
    permstate.userInfo.grade = grade;
    permstate.userInfo.dept = dept;
    permstate.userInfo.eduFocus = eduFocus;
    save(permstate);

    const deptOrGrade = eduFocus === "highschool" ? grade : dept;

    try {
      const response = await getCourseForEduFocus(eduFocus, deptOrGrade);
      if (response.data) {
        permstate.myCourses = response.data;
        save(permstate);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  });

  $effect(() => {
    permstate.userInfo.yearOfStudy = yearOfStudy;
    permstate.userInfo.gender = gender;
    permstate.userInfo.examFocus = examFocus;
    save(permstate);
  });
</script>

<div in:blur={{ duration: 150 }} class="bg-blue-500">
  <div class="px-4 py-6 rounded-b-3xl">
    <div class="flex mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white text-right">Settings</h1>
    </div>
    <div class="flex gap-2 justify-end">
      <span
        class="flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 w-fit"
      >
        <Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span class="text-md font-bold opacity-80">{permstate.stars} Stars</span
        >
      </span>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl py-4 px-4">
    <!-- Educational Focus -->
    <div class="w-full md:w-[280px] mb-4">
      <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
        <GraduationCap class="w-5 h-5" />
        <span>Educational Focus</span>
      </div>
      <Select.Root type="single" name="eduFocus" bind:value={eduFocus}>
        <Select.Trigger
          class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
        >
          {eduFocus === "highschool"
            ? "Highschool"
            : eduFocus === "undergrad"
              ? "University"
              : "Exit Exam"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="highschool" label="Highschool"
              >Highschool</Select.Item
            >
            <Select.Item value="undergrad" label="University"
              >University</Select.Item
            >
            <Select.Item value="exitexam" label="Exit Exam"
              >Exit Exam</Select.Item
            >
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    {#if eduFocus == "highschool"}
      <div class="w-full max-w-md mx-auto mb-4">
        <div class="flex items-center gap-2 mb-4 text-gray-800 text-left">
          <Calendar class="w-5 h-5" />
          <span>Select your grade level:</span>
        </div>
        <Select.Root type="single" name="grade" bind:value={grade}>
          <Select.Trigger
            class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
          >
            Grade {grade}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each grades as grade (grade)}
                <Select.Item value={grade.value} label={grade.label}>
                  {grade.label}
                </Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {:else}
      <div class="w-full flex flex-col justify-center mt-4 mb-4">
        <div class="flex items-center gap-2 text-gray-800 text-left">
          <BookOpenText class="w-5 h-5" />
          <span>Department/Field</span>
        </div>
        <Combobox
          items={fields}
          bind:value={dept}
          placeholder="Select your field of study"
          buttonClass="text-gray-800 font-bold py-6 w-full md:w-[280px] justify-between bg-white border border-gray-300"
          contentClass="w-full md:w-[280px] p-0"
          searchPlaceholder="Search fields..."
          emptyMessage="No field found"
        />
      </div>
      <div class="w-full md:w-[280px] mb-4">
        <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
          <Calendar class="w-5 h-5" />
          <span>Year of Study</span>
        </div>
        <Select.Root type="single" name="yearOfStudy" bind:value={yearOfStudy}>
          <Select.Trigger
            class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
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
    {/if}

    <!-- Gender Radio -->
    <div class="w-full md:w-[280px] mb-4">
      <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
        <User class="w-5 h-5" />
        <span>Gender</span>
      </div>
      <Select.Root type="single" name="gender" bind:value={gender}>
        <Select.Trigger
          class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
        >
          {gender === "male" ? "Male" : "Female"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="male" label="Male">Male</Select.Item>
            <Select.Item value="female" label="Female">Female</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Past Exams -->
    <div class="w-full md:w-[280px] mb-6">
      <div class="flex items-center gap-2 mb-2 text-gray-800 text-left">
        <FileCheck class="w-5 h-5" />
        <span>Past Exams</span>
      </div>

      <Select.Root type="single" name="gender" bind:value={examFocus}>
        <Select.Trigger
          class="w-full md:w-[280px] py-6 bg-white text-gray-800 font-bold border-gray-300"
        >
          {examFocus === "exitexam" ? "Exit Exam" : "Matric Exam"}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Item value="exitexam" label="Exit Exam"
              >Exit Exam</Select.Item
            >
            <Select.Item value="matric" label="Matric Exam"
              >Matric Exam</Select.Item
            >
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>

    <Card
      class="bg-blue-100 transition-colors duration-200 cursor-pointer border border-blue-100"
      style="margin-bottom: 80px"
    >
      <a href="mailto:dev@example.com" class="block p-4 no-underline">
        <div class="flex items-center gap-3">
          <span class="flex-grow text-gray-900 font-bold">Contact Us</span>
          <MessageCircle size="20" />
        </div>
      </a>
    </Card>
  </div>
</div>
