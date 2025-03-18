<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ArrowLeft, BookOpen, CircleHelp } from "lucide-svelte";
  import { tempstate } from "$lib/state.svelte.ts";
  import { reportFeedback } from "$lib/api";
  import { toast } from "svelte-sonner";
  import { Loading } from "$lib/components/ui/command";

  let issue = $state("");
  let loading = $state(false);

  const handleSend = async () => {
    loading = true;
    await reportFeedback({
      ...tempstate.report,
      issue: issue,
    });
    loading = false;
    toast("Report sent successfully");
    window.history.back();
  };
</script>

<div class="bg-blue-500">
  <div class="px-4 py-4 rounded-b-3xl">
    <div class="flex items-center gap-2">
      <div class="flex-grow">
        <button onclick={() => history.back()}>
          <ArrowLeft color="white" size="28" />
        </button>
      </div>
    </div>
  </div>

  <div class="bg-white rounded-t-3xl pt-4 px-4">
    <div class="p-4">
      <div class="mb-4">
        <div
          class="flex items-center gap-3 p-4 bg-white rounded-lg border mb-6"
        >
          {#if tempstate?.report?.topic}
            <BookOpen size={24} />
            <span class="text-xl font-medium"
              >{tempstate?.report?.topic?.title || "Report on topic"}</span
            >
          {:else}
            <CircleHelp size={24} />
            {#if tempstate?.report?.question?.questionText}
              {@html tempstate?.report?.question?.questionText}
            {:else}
              <span class="text-xl font-medium">Report on question</span>
            {/if}
          {/if}
        </div>
        <label for="feedback" class="block text-lg font-medium mb-2"
          >Please describe the problem you encountered:</label
        >
        <div class="grid w-full gap-1.5">
          <Textarea
            id="feedback"
            bind:value={issue}
            rows={6}
            placeholder="Describe the issue in detail..."
          />
        </div>
      </div>

      <div class="flex justify-end">
        <Button
          size="lg"
          class="text-lg font-bold"
          onclick={handleSend}
          disabled={loading}
        >
          {#if loading}
            <span class="mr-2 inline-block">
              <Loading class="animate-spin h-4 w-4" />
            </span>
            Submitting...
          {:else}
            Submit
          {/if}
        </Button>
      </div>
    </div>
  </div>
</div>
