<script lang="ts">
  import { getContext, onMount, onDestroy } from "svelte";

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
    if (unregister) {
      unregister();
    }
  });

  function handleClick(e: MouseEvent) {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick(e);
  }

  $: computedBorderRadius =
    borderRadius !== null
      ? borderRadius
      : vertical
        ? position === "first"
          ? `${rounded} ${rounded} 0 0`
          : position === "last"
            ? `0 0 ${rounded} ${rounded}`
            : "0"
        : position === "first"
          ? `${rounded} 0 0 ${rounded}`
          : position === "last"
            ? `0 ${rounded} ${rounded} 0`
            : "0";

  $: computedBorderStyle = (() => {
    if (variant !== "outline") return "";
    
    if (position === "single") return "border: 1px solid var(--gray-600);";
    
    if (vertical) {
      switch (position) {
        case "first":
          return "border: 1px solid var(--gray-600); border-bottom: none;";
        case "middle":
          return "border-left: 1px solid var(--gray-600); border-right: 1px solid var(--gray-600); border-bottom: none;";
        case "last":
          return "border: 1px solid var(--gray-600); border-top: none;";
      }
    } else {
      switch (position) {
        case "first":
          return "border: 1px solid var(--gray-600); border-right: none;";
        case "middle":
          return "border-top: 1px solid var(--gray-600); border-bottom: 1px solid var(--gray-600); border-right: none;";
        case "last":
          return "border: 1px solid var(--gray-600); border-left: none;";
      }
    }
    
    return "border: 1px solid var(--gray-600);";
  })();

  const sizeStyles = {
    sm: "padding: 0.25rem 0.6rem; font-size: 0.875rem; line-height: 1.25rem;",
    md: "padding: 0.5rem 1rem; font-size: 1rem; line-height: 1.5rem;",
    lg: "padding: 0.75rem 1.25rem; font-size: 1.125rem; line-height: 1.75rem;",
  };
</script>

{#if href}
  <a
    {href}
    class={`btn ${variant} ${position}`}
    style={`border-radius: ${computedBorderRadius}; ${computedBorderStyle} ${sizeStyles[size]}; width: ${fullWidth ? "100%" : "auto"};`}
    aria-disabled={disabled ? "true" : "false"}
    on:click={handleClick}
  >
    {#if loading}
      <svg class="spinner" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          class="spinner-bg"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          class="spinner-fg"
        />
      </svg>
    {/if}
    <slot />
  </a>
{:else}
  <button
    class={`btn ${variant} ${position}`}
    style={`border-radius: ${computedBorderRadius}; ${computedBorderStyle} ${sizeStyles[size]}; width: ${fullWidth ? "100%" : "auto"};`}
    {disabled}
    aria-disabled={disabled ? "true" : "false"}
    on:click={handleClick}
  >
    {#if loading}
      <svg class="spinner" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          class="spinner-bg"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          class="spinner-fg"
        />
      </svg>
    {/if}
    <slot />
  </button>
{/if}

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
      border-color var(--transition-fast);
    font-weight: 500;
    line-height: 1;
    border-radius: 0;
    color: var(--gray-50);
    user-select: none;
    border: none;
  }

  .btn:disabled,
  .btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.4;
    pointer-events: none;
  }

  /* Primary */
  .primary {
    background-color: var(--gray-100);
    color: var(--gray-950);
  }
  .primary:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-300);
  }
  .primary:active:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-400);
    color: var(--gray-950);
  }

  /* Secondary */
  .secondary {
    background-color: var(--gray-700);
    color: var(--gray-0);
  }
  .secondary:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-700);
    color: var(--gray-50);
  }
  .secondary:active:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-800);
    color: var(--gray-0);
  }

  /* Outline */
  .outline {
    background-color: var(--gray-800);
    color: var(--gray-200);
    outline: none;
  }
  .outline:hover:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-700);
    color: var(--gray-0);
  }
  .outline:active:not(:disabled):not([aria-disabled="true"]) {
    background-color: var(--gray-800);
    color: var(--gray-100);
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
  }
  .spinner-bg {
    opacity: 0.2;
    fill: none;
  }
  .spinner-fg {
    opacity: 0.8;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>