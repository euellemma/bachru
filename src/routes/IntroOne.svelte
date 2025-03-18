<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { GraduationCap, Building, Landmark } from "lucide-svelte";
  import { permstate, save } from "$lib/state.svelte";
  import { push } from "svelte-spa-router";
  import { blur } from "svelte/transition";

  let selectedFocus = $state("");

  const focusOptions = [
    { id: "highschool", label: "High School (Matric)", icon: Building },
    { id: "undergrad", label: "Undergraduate (College)", icon: Landmark },
    { id: "exitexam", label: "Exit Exam", icon: GraduationCap },
  ];

  const eduFocusClick = (eduFocus: string) => {
    permstate.userInfo = {
      ...permstate.userInfo,
      eduFocus,
      examFocus: eduFocus == "exitexam" ? "exitexam" : "matric",
    };
    save(permstate);
    push("/intro-two");
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
    in:blur={{ duration: 300 }}
    class="z-10 text-center p-6 w-full max-w-3xl mx-auto"
  >
    <div class="space-y-8">
      <h1 class="text-4xl font-bold text-white mb-16">Welcome to GebiApp</h1>
      <p class="text-xl text-white mb-12">Select your educational focus:</p>

      <div class="flex flex-col gap-2">
        {#each focusOptions as option (option)}
          <Card.Root
            class="bg-black bg-opacity-30 border-[1px] transition-all duration-300 hover:bg-opacity-50 cursor-pointer {selectedFocus ===
            option.id
              ? 'border-blue-500'
              : 'border-gray-600'}"
            onclick={() => eduFocusClick(option.id)}
          >
            <Card.Content class="py-4 px-4 flex flex-row items-center">
              <option.icon class="w-5 h-5 text-white mr-3" />
              <h2 class="text-lg font-bold text-white">{option.label}</h2>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </div>
  </div>
</div>
