<script lang="ts">
  import { onMount } from "svelte";
  import { preloadData } from "$app/navigation";
  import { getCookie } from "./utils.svelte";
  let progress: number = 0;

  onMount(async () => {
    const sessionId: string | undefined = getCookie("sessionId");
    const duration: number = 3000;
    const start: number = performance.now();

    console.log("test")

    let preloading = [
      preloadData("/dashboard"),
      preloadData("/login")
    ]

    for (const preload of preloading) {
      progress += 100/(preloading.length)*1
      console.log(progress)
      await preload
    }

    progress=100

    

    /* const animate = (time: number) => {
      const elapsed = time - start;

      let pct = (elapsed / duration) * 100;
      const stutter = Math.random() < 0.15 ? Math.random() * -2 : 0;
      pct += stutter;

      progress = Math.min(Math.max(pct, 0), 100);

      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        if (sessionId) {
          //window.location.href = "/dashboard";
        } else {
          //window.location.href = "/login";
        }
      }
    };

    requestAnimationFrame(animate); */
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-black px-4">
  <div
    class="w-full max-w-sm bg-neutral-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl text-center space-y-6"
  >
    <h3 class="text-3xl font-bold mb-6 tracking-wide">Loading Dashboard</h3>

    <div
      class="w-full max-w-md bg-white/10 rounded-full h-3 overflow-hidden shadow-inner"
    >
      <div
        class="h-3 rounded-full transition-all duration-30 animate-glow"
        style={`width: 0%; background: linear-gradient(90deg, #7289da, #99aaff); --progress: ${progress}%`}
      ></div>
    </div>

    <p class="text-sm text-white/50 mt-4">dustying off the records...</p>
  </div>
</div>

<style>
  h3 {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .animate-glow {
    box-shadow: 0 0 5px rgba(114, 137, 218, 0.5);
    animation: pulse 1.2s infinite ease-in-out, progress 10s forwards;
  }

  @keyframes progress {
  99% {
    background-color: #9747FF; /* Keep the original color */
  }
  100% {
    background-color: #14AE5C; /* Turn green at the end */
    width: var(--progress);
    /* width: 100%; */ /* Ensure the width reaches 100% */
  }
}

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 5px rgba(114, 137, 218, 0.5);
    }
    50% {
      box-shadow: 0 0 12px rgba(114, 137, 218, 0.8);
    }
  }
</style>
