<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let variant: "primary" | "secondary" | "outline" = "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  export let onClick: (event: MouseEvent) => void = () => {};

  const base =
    "inline-flex items-center justify-center font-medium rounded-xl select-none " +
    "focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 " +
    "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-700",
    secondary:
      "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-300",
    outline:
      "border border-neutral-300 text-neutral-900 hover:bg-neutral-100 focus:ring-neutral-400",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  function getClasses(): string {
    const v = variants[variant] || variants.primary;
    const s = sizes[size] || sizes.md;
    const w = fullWidth ? "w-full" : "";
    return [base, v, s, w].filter(Boolean).join(" ");
  }

  function handleClick(e: MouseEvent) {
    if (typeof onClick === "function") {
      try {
        onClick(e);
      } catch (err) {
        console.error(err);
      }
    }
  }
</script>

<button
  {type}
  class={getClasses()}
  disabled={disabled}
  aria-disabled={disabled ? "true" : "false"}
  on:click={handleClick}
  {...$$restProps}
>
  <slot />
</button>
