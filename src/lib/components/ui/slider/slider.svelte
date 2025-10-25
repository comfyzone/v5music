<script lang="ts">
  import { Slider as SliderPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    value = $bindable(),
    orientation = "horizontal",
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
  bind:ref
  bind:value={value as never}
  data-slot="slider"
  class={cn(
    "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full " +
      "data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto " +
      "data-[orientation=vertical]:flex-col data-[disabled]:opacity-50",
    className
  )}
  {...restProps}
>
  {#snippet children({ thumbs })}
    <span
      data-orientation={orientation}
      data-slot="slider-track"
      class={cn(
        "bg-[#2f3136] relative grow overflow-hidden rounded-full " +
          "data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:h-full " +
          "data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5"
      )}
    >
      <SliderPrimitive.Range
        data-slot="slider-range"
        class={cn(
          "bg-[#5865F2] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        )}
      />
    </span>
    {#each thumbs as thumb (thumb)}
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        index={thumb}
        class="w-4 h-4 bg-[#5865F2] border-2 border-[#7289da] rounded-full shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#5865F2] transition"
      />
    {/each}
  {/snippet}
</SliderPrimitive.Root>
