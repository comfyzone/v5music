<script lang="ts">
  export let src = "";
  export let alt = "";
  export let className = "object-cover w-full h-full";
</script>

<img {src} {alt} class={className} />
