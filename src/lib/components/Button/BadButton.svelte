<script lang="ts">
  import {
    getContext,
    onMount,
    onDestroy,
    createEventDispatcher,
  } from "svelte";
  import { RefreshCw } from "lucide-svelte";
  type ButtonVariant = "primary" | "secondary" | "outline";
  type ButtonSize = "sm" | "md" | "lg";
  type ButtonPosition = "first" | "middle" | "last" | "single";
  export let variant: ButtonVariant = "primary";
  export let size: ButtonSize = "md";
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
  export let href: string | null = null;
  export let onClick: (e: MouseEvent) => void = () => {};
  export let borderRadius: string | null = null;
  let position: ButtonPosition = "single";
  let vertical = false;
  let rounded = "12px";

  interface ButtonGroupContext {
    register: (
      callback: (pos: ButtonPosition, vert: boolean, radius: string) => void
    ) => () => void;
  }

  const group = getContext<ButtonGroupContext | undefined>("button-group");

  let unregister: (() => void) | null = null;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (group?.register) {
      unregister = group.register(
        (pos: ButtonPosition, vert: boolean, radius: string) => {
          position = pos;
          vertical = vert;
          rounded = radius;
        }
      );
    }
  });

  onDestroy(() => {
    if (unregister) unregister();
  });

  function handleClick(e: MouseEvent) {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick(e);
    dispatch("click", e);
  }

  $: sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md";
  $: posClass = position;
  $: variantClass = variant;
  $: fullClass = fullWidth ? "w-full" : "";
  $: radiusVar = borderRadius ?? rounded;
</script>

<svelte:element
  this={href ? "a" : "button"}
  href={href ?? undefined}
  class={`btn ${variantClass} ${posClass} ${sizeClass} ${fullClass}`}
  aria-disabled={disabled ? "true" : "false"}
  on:click={handleClick}
  {...$$restProps}
  style={`--btn-radius: ${radiusVar};`}
>
  {#if loading}
    <RefreshCw class="spinner" aria-hidden="false" role="status" />
    <span class="sr-only">Loading</span>
  {/if}
  <slot />
</svelte:element>

<style>
  :global(:root) {
    --gray-0: #ffffff;
    --gray-50: #fafafa;
    --gray-100: #f5f5f5;
    --gray-200: #e5e5e5;
    --gray-300: #d4d4d4;
    --gray-400: #a3a3a3;
    --gray-500: #737373;
    --gray-600: #525252;
    --gray-700: #262626;
    --gray-800: #202020;
    --gray-900: #171717;
    --gray-950: #090909;
    --transition-fast: 160ms;
    --btn-radius: 12px;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast),
      border-color var(--transition-fast),
      transform var(--transition-fast);
    font-weight: 500;
    line-height: 1;
    border-radius: var(--btn-radius);
    color: var(--gray-0);
    user-select: none;
    border: none;
    text-decoration: none;
  }
  .btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.45;
    pointer-events: none;
  }
  .btn-sm {
    padding: 0.25rem 0.6rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .btn-md {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
  .btn-lg {
    padding: 0.75rem 1.25rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .primary {
    background-color: var(--gray-0);
    color: var(--gray-900);
  }
  .primary:hover:not([aria-disabled="true"]) {
    filter: brightness(0.95);
  }
  .secondary {
    background-color: var(--gray-700);
    color: var(--gray-0);
  }
  .secondary:hover:not([aria-disabled="true"]) {
    filter: brightness(0.95);
  }
  .outline {
    background-color: transparent;
    color: var(--gray-0);
    border: 1px solid var(--gray-600);
  }
  .outline:hover:not([aria-disabled="true"]) {
    background-color: --gray-900;
  }
  .outline.single {
    border-radius: var(--btn-radius);
  }
  .outline.first {
    border-right: none;
  }
  .outline.middle {
    border-left: none;
    border-right: none;
  }
  .outline.last {
    border-left: none;
  }
  .outline.first.vertical {
    border-bottom: none;
  }
  .outline.middle.vertical {
    border-top: none;
    border-bottom: none;
  }
  .outline.last.vertical {
    border-top: none;
  }
  .spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
    margin-right: 0.25rem;
    flex-shrink: 0;
    stroke: currentColor;
    fill: currentColor;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
