<script lang="ts">
  export let className = "";
</script>

<div class={`relative overflow-hidden ${className}`}>
  <slot />
</div>
