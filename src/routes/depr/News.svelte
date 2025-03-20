<script>
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Home, ArrowRight, Newspaper, Settings } from "lucide-svelte";
</script>

<div class="bg-accent min-h-screen flex flex-col" style="padding-bottom: 80px">
  <div class="flex pt-8 px-4 flex-grow items-center">
    <span class="px-4 text-center">
      <h1 class="text-2xl font-bold mb-2 text-gray-900">Coming Soon</h1>

      <p class="text-gray-600 max-w-md mx-auto">
        Personalized news feed for your learning journey coming soon!
      </p>
    </span>

    <span class="flex-grow" />
    <!-- <Card
      class="border-0 shadow-lg max-w-md mx-auto rounded-3xl bg-gradient-to-tr from-black to-orange-950 text-white"
    >
      <CardHeader>
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 rounded-full overflow-hidden">
            <img
              src="https://randomuser.me/api/portraits/men/30.jpg"
              alt="Euel"
              class="h-full w-full object-cover"
            />
          </div>
          <CardTitle style="font-size: 1.2rem"
            >Hey it's Euel, creator of this app</CardTitle
          >
        </div>
      </CardHeader>
      <CardContent>
        <p
          class="text-white opacity-80 mb-6 text-lg"
          style="font-size: 1.125rem; line-height: 1.2"
        >
          Join my telegram channel if you're interested in <strong
            class="text-white opacity-100 underline"
            >building apps and AI</strong
          >
        </p>
        <a
          href="https://t.me/euelchannel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="default"
            class="bg-orange-600 font-bold hover:bg-blue-600"
          >
            Join Channel
            <ArrowRight class="ml-1" color="white" size={18} />
          </Button>
        </a>
      </CardContent>
    </Card> -->
  </div>

  <!-- <div
    class="fixed bottom-0 left-0 w-full p-1 bg-blue-500 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-3xl"
  >
    <div class="flex justify-around items-center">
      <a href="/" class="p-4 rounded-lg">
        <Home size="24" color="white" />
      </a>
      <div class="py-2 px-6 rounded-lg bg-blue-100">
        <Newspaper size="24" class="text-blue-500" />
      </div>
      <div class="p-4 rounded-lg">
        <Settings size="24" color="white" />
      </div>
    </div>
  </div> -->
</div>
