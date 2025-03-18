<script lang="ts">
  import { getTopicData } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import {
    ArrowLeft,
    BookOpen,
    Play,
    Flag,
    Video,
    Book,
    Info,
  } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";

  const styles = `<style> /* Heading Structure */ h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem; color: #1e3a8a; } h2 { font-size: 1.75rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem; color: #1e40af; } h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e3a8a; } /* Content Containers */ p { margin-bottom: 1rem; line-height: 1.6; } .definition { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } .example { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } .note { background-color: #fff7ed; border-left: 4px solid #f97316; padding: 1rem; margin-bottom: 1rem; border-radius: 0.25rem; } /* Mathematical Content */ .math-inline { font-style: italic; font-family: "Georgia", serif; } .math-display { margin: 1rem 0; padding: 1rem; background-color: #f8fafc; border-radius: 0.25rem; overflow-x: auto; } /* Code Sections */ pre { background-color: #1e293b; border-radius: 0.25rem; padding: 1rem; margin-bottom: 1rem; overflow-x: auto; } code { font-family: "Consolas", "Monaco", monospace; color: #f8fafc; } /* List Structures */ ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; } ul { list-style-type: disc; } ol { list-style-type: decimal; } li { margin-bottom: 0.5rem; } /* Text Emphasis */ strong { font-weight: 700; color: #0f172a; } em { font-style: italic; } u { text-decoration: underline; } /* Special Elements */ blockquote { font-style: italic; border-left: 4px solid #cbd5e1; padding-left: 1rem; margin: 1rem 0; color: #475569; } table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; } th, td { border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; } th { background-color: #f1f5f9; font-weight: 600; } tr:nth-child(even) { background-color: #f8fafc; } hr { border: 0; height: 1px; background-color: #cbd5e1; margin: 2rem 0; }</style>`;

  let { params } = $props();
  let topicData: TopicData | null = $state(null);

  console.log("the html is", topicData?.content);

  onMount(async () => {
    const { data } = await getTopicData(params.courseId, params.filename);
    topicData = data;
  });

  let activeTab = $state("main"); // 'main' or 'videos'
  const openTextbook = () => {
    console.log("yes my g open the fucking text book");
  };

  // Sample video data (replace with actual data source)
  let videos = [
    {
      videoId: "abc123",
      videoTitle: "Introduction to Matrices and Vectors",
      channelTitle: "Math Explained",
      thumbnails: ["https://i.ytimg.com/vi/abc123/hqdefault.jpg"],
      duration: "12:34",
    },
    {
      videoId: "def456",
      videoTitle: "Linear Transformations Explained",
      channelTitle: "Professor Linear",
      thumbnails: ["https://i.ytimg.com/vi/def456/hqdefault.jpg"],
      duration: "8:45",
    },
    {
      videoId: "ghi789",
      videoTitle: "Eigenvalues and Eigenvectors - Visual Guide",
      channelTitle: "Math with Visual Proofs",
      thumbnails: ["https://i.ytimg.com/vi/ghi789/hqdefault.jpg"],
      duration: "15:20",
    },
  ];

  const openVideo = (videoId) => {
    // Implement video opening functionality
    console.log(`Opening video: ${videoId}`);
    // Could navigate to a video player component or open YouTube
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 pt-6 pb-2 rounded-b-3xl">
    <div class="flex items-center mb-4 gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
      <h1 class="text-3xl mb-2 font-bold text-white">Linear Algebra II</h1>
    </div>
    <div class="flex gap-2 justify-end">
      <!-- <Button variant="default">
        <BookOpen class="w-4 h-4 mr-2" />
        Open Textbook
      </Button> -->
      <Button variant="ghost" class="bg-blue-100 font-bold">
        <Play class="w-5 h-5 mr-2" />
        Start Quiz
      </Button>
    </div>
    <div class="flex gap-2 mt-4">
      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'main'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "main")}
      >
        Home
      </button>
      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all {activeTab ===
        'videos'
          ? 'bg-white text-blue-500'
          : 'bg-blue-400 text-white'}"
        onclick={() => (activeTab = "videos")}
      >
        Videos
      </button>

      <button
        class="px-5 py-2 text-xs rounded-full font-semibold transition-all bg-blue-400 text-white"
        onclick={openTextbook}
      >
        Textbook
      </button>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl pt-4 pb-8 px-4">
    {#if activeTab === "main"}
      <div in:fade={{ duration: 300 }}>
        {#if topicData === null}
          <div class="flex gap-2 items-center bg-gray-100 px-4 py-3 rounded-lg">
            <Skeleton class="h-20 w-full" />
          </div>
          <div class="mt-8"></div>
          <div class="mt-8">
            <Card class="pb-4">
              <CardHeader>
                <CardTitle>
                  <Skeleton class="h-5 w-40 mb-2" />
                  <Skeleton class="h-6 w-3/4 mb-4" />
                  <Skeleton class="h-10 w-36" />
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div class="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton class="h-5 w-24 mb-2" />
                  <Skeleton class="h-6 w-4/5 mb-4" />
                  <Skeleton class="h-10 w-36" />
                </CardTitle>
              </CardHeader>
              <CardContent class="m-0 p-2"></CardContent>
            </Card>
          </div>
        {:else}
          <!-- <div
            class="flex gap-2 items-center bg-pink-50 px-4
            py-3 rounded-lg"
          >
            <div class="text-gray-600">
              <strong>Fun Fact:</strong> Linear algebra is used in Google's
              PageRank algorithm to determine the importance of web pages.
              <button
                class="font-bold text-gray-900 underline text-right ml-auto"
                >More</button
              >
            </div>
          </div> -->

          <div class="mt-8">
            {@html `${styles}${topicData?.content}`}
          </div>
          <div class="mt-8">
            <Card class="pb-4">
              <CardHeader>
                <CardTitle>
                  <div
                    class="bg-blue-100 text-blue-500 rounded-full
                    px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Next Topic
                  </div>
                  Matrices and Vectors

                  <Button class="bg-blue-500 text-white font-bold mt-4">
                    Open
                    <ArrowRight class="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div class="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div
                    class="bg-green-100 text-green-500 rounded-full
                                    px-3 py-1 text-sm font-semibold mr-2 mb-2 w-fit"
                  >
                    Textbook
                  </div>
                  <p>Linear Algebra: A Modern Introduction</p>
                  <Button variant="outline" class="mt-4">
                    <BookOpen class="w-4 h-4 mr-2" />
                    Open Textbook
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent class="m-0 p-2"></CardContent>
            </Card>
          </div>
        {/if}
      </div>
    {:else if activeTab === "videos"}
      <div in:fade={{ duration: 300 }}>
        <div class="mt-4">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Recommended Videos
          </h2>
          <div class="grid gap-4">
            {#if topicData === null}
              {#each Array(3) as _, i}
                <div
                  class="bg-white rounded-xl text-left overflow-hidden shadow border border-gray-100"
                >
                  <div class="relative">
                    <Skeleton class="w-full h-40" />
                  </div>
                  <div class="p-4">
                    <Skeleton class="h-6 w-3/4 mb-1" />
                    <Skeleton class="h-4 w-1/3" />
                  </div>
                </div>
              {/each}
            {:else}
              {#each videos as video}
                <button
                  class="bg-white rounded-xl text-left overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onclick={() => openVideo(video.videoId)}
                >
                  <div class="relative">
                    <img
                      src={video.thumbnails[0]}
                      alt={video.videoTitle}
                      class="w-full h-40 object-cover"
                    />
                    <div
                      class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md font-medium"
                    >
                      {video.duration}
                    </div>
                  </div>
                  <div class="p-4">
                    <h3 class="font-bold text-gray-800 mb-1 line-clamp-2">
                      {video.videoTitle}
                    </h3>
                    <p class="text-sm text-gray-600 flex items-center">
                      <Video class="w-3 h-3 mr-1" />
                      {video.channelTitle}
                    </p>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="mt-8 flex">
      <Button
        variant="outline"
        class="text-red-500"
        onclick={() => push("/report")}
      >
        <Flag class="h-4 w-4 mr-2" />
        Report
      </Button>

      <span class="flex-grow"></span>
      <Button class="font-bold ">
        <Play strokeWidth="4" />
        Start Quiz
      </Button>
    </div>
  </div>
</div>
