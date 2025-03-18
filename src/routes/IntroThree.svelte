<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label";
  import { ArrowRight, Venus, School } from "lucide-svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { blur } from "svelte/transition";
  import { push } from "svelte-spa-router";

  let school = $state("");
  let selectedGender = $state("");

  const userInfo = permstate.userInfo;

  console.log("userInfo in intro-three", userInfo);

  const setGender = () => {
    permstate.userInfo.gender = selectedGender;
    save(permstate);
  };

  const setSchool = () => {
    permstate.userInfo.school = school;
    save(permstate);
  };

  function handleContinue() {
    push("/intro-four");
  }
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
        Tell Us About Yourself
      </h1>

      <div class="w-full flex flex-col items-center gap-6">
        <div class="w-full flex md:w-[280px] mx-auto">
          <div
            class="flex flex-grow items-center gap-2 mt-2 mr-4 mb-2 text-white text-left"
          >
            <Venus class="w-5 h-5" />
            <strong>Gender:</strong>
          </div>
          <RadioGroup.Root
            class="flex gap-6"
            bind:value={selectedGender}
            onchange={() => setGender()}
          >
            <button
              onclick={() => {
                selectedGender = "male";
                setGender();
              }}
              class="flex items-center space-x-2 {selectedGender === 'male'
                ? 'bg-black bg-opacity-70'
                : 'bg-black bg-opacity-20 border-black border-2'} py-2 px-4 rounded-lg"
            >
              <RadioGroup.Item value="male" id="male" />
              <Label for="male" class="text-white">Male</Label>
            </button>
            <button
              onclick={() => {
                selectedGender = "female";
                setGender();
              }}
              class="flex items-center space-x-2 {selectedGender === 'female'
                ? 'bg-black bg-opacity-70'
                : 'bg-black bg-opacity-20 border-black border-2'} py-2 px-4 rounded-lg"
            >
              <RadioGroup.Item value="female" id="female" />
              <Label for="female" class="text-white ">Female</Label>
            </button>
          </RadioGroup.Root>
        </div>

        <div class="w-full md:w-[280px] mb-8">
          <div class="flex items-center gap-2 mb-2 text-white text-left">
            <School class="w-5 h-5" />
            <strong
              >{userInfo.eduFocus == "highschool"
                ? "School Name"
                : "University/College"}</strong
            >
          </div>
          <Input
            type="text"
            placeholder={userInfo.eduFocus == "highschool"
              ? "Enter your school name"
              : "Enter your university or college"}
            bind:value={school}
            onchange={() => setSchool()}
            class="w-full md:w-[280px] bg-black bg-opacity-20 text-black border-gray-700 placeholder:text-gray-400"
          />
          <div class="text-white opacity-90 mt-2">
            This is important for <strong class="underline">past exams</strong> search
          </div>
        </div>
      </div>
      <Button
        class="mt-16 text-lg bg-blue-500 font-bold"
        variant="default"
        size="lg"
        onclick={handleContinue}
        disabled={!selectedGender || !school}
      >
        Continue
        <ArrowRight class="ml-2 w-5 h-5" />
      </Button>
    </div>
  </div>
</div>
