<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  type ComboboxItem = {
    value: string;
    label: string;
  };

  let {
    items = [] as ComboboxItem[],
    value = $bindable(""),
    placeholder = "Select an item...",
    emptyMessage = "No item found...",
    searchPlaceholder = "Search...",
    buttonClass = "w-[200px] justify-between",
    contentClass = "w-[200px] p-0",
    buttonVariant = "outline" as
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link",
    icon = ChevronsUpDown,
    iconClass = "opacity-50",
    checkIcon = Check,
    open = false,
  } = $props();

  // If you need these to be reactive within the component, declare them separately with $state
  let itemsState = $state(items);
  let valueState = $state(value);
  let openState = $state(open);

  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    itemsState.find((item) => item.value === valueState)?.label,
  );

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    openState = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  export function setOpen(isOpen: boolean) {
    openState = isOpen;
  }

  export function setValue(newValue: string) {
    valueState = newValue;
  }
  $effect(() => {
    valueState = value;
  });

  // Ensure updates to valueState reflect back to value
  $effect(() => {
    value = valueState;
  });
</script>

<Popover.Root bind:open={openState}>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        variant={buttonVariant}
        class={buttonClass}
        {...props}
        role="combobox"
        aria-expanded={openState}
      >
        {selectedValue || placeholder}
        <svelte:component this={icon} class={iconClass} />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class={contentClass}>
    <Command.Root>
      <Command.Input placeholder={searchPlaceholder} />
      <Command.List>
        <Command.Empty>{emptyMessage}</Command.Empty>
        <Command.Group>
          {#each itemsState as item}
            <Command.Item
              value={item.value}
              onSelect={() => {
                valueState = item.value;
                closeAndFocusTrigger();
              }}
            >
              <svelte:component
                this={checkIcon}
                class={cn(valueState !== item.value && "text-transparent")}
              />
              {item.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
