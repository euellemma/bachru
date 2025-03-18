<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { Search, Plus, ArrowLeft } from "lucide-svelte";
  import { Input } from "$lib/components/ui/input";

  let searchQuery = $state("");

  let courses = $state([
    {
      id: 1,
      name: "Introduction to Computer Science",
      emoji: "💻",
      selected: false,
    },
    {
      id: 2,
      name: "Advanced Mathematics",
      emoji: "🔢",
      selected: false,
    },
    {
      id: 3,
      name: "Physics 101",
      emoji: "⚛️",
      selected: false,
    },
    {
      id: 4,
      name: "Biology Fundamentals",
      emoji: "🧬",
      selected: false,
    },
    {
      id: 5,
      name: "History of Art",
      emoji: "🎨",
      selected: false,
    },
  ]);

  let filteredCourses = $derived(
    courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );
</script>

<div class="p-8 bg-blue-50 min-h-screen">
  <div class="max-w-3xl mx-auto">
    <div class="mb-2">
      <Button
        onclick={() => window.history.back()}
        class="flex items-center gap-2 font-bold"
      >
        <ArrowLeft />
        Back
      </Button>
    </div>

    <div class="relative mb-6">
      <Search
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={20}
      />
      <Input
        type="text"
        placeholder="Search courses..."
        class="pl-10 py-6 text-lg"
        bind:value={searchQuery}
      />
    </div>

    <div class="space-y-4">
      {#each filteredCourses as course}
        <Card
          class={`border-0 cursor-pointer transition-all ${course.selected ? "bg-blue-100" : ""}`}
          onclick={() => (course.selected = !course.selected)}
        >
          <CardContent>
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-2 hover:underline">
                <span class="text-2xl mr-2">{course.emoji}</span>
                <span>{course.name}</span>
              </span>
              <Button variant="outline" size="sm">
                Add <Plus size={16} class="ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      {/each}

      {#if filteredCourses.length === 0}
        <div class="text-center py-8 text-gray-600">
          <p>No courses found matching "{searchQuery}"</p>
        </div>
      {/if}
    </div>
  </div>
</div>
