<script lang="ts">
  import { onMount } from "svelte";
  import { goto, preloadData } from "$app/navigation";
  import { getCookie } from "./utils.svelte";
  let progress: number = 0;
  const start: number = performance.now();
  const minLoadingTime = 500

  onMount(async () => {
    const sessionId: string | undefined = getCookie("sessionId");
    const duration: number = 3000;
    
    

    console.log("test");

    let preloading = [preloadData("/"), preloadData("/dashboard"), preloadData("/login")];

    let index = 1
    for (const preload of preloading) {
      await preload;
      progress = (100 / preloading.length) * index;
      console.log(progress);
      index++
    }
    
    let loadTime = performance.now() - start
    console.log(`Took ${loadTime}ms`)

    let sleepTime = Math.max(minLoadingTime - loadTime, 0)
    console.log(`Sleeping for ${sleepTime}ms`)
    await new Promise(r => setTimeout(r, sleepTime));

    if (sessionId) {
      goto(`/dashboard`, { replaceState: true }) 
    } else {
      goto(`/login`, { replaceState: true }) 
    }

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
    <img src="/loading.webp" alt="" style="width: 100%" />
    <!-- <h3 class="text-3xl font-bold mb-6 tracking-wide">Loading Dashboard</h3> -->

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
    animation:
      pulse 1.2s infinite ease-in-out,
      progress 0.5s forwards;
  }

  @keyframes progress {
    99% {
      background-color: #9747ff; /* Keep the original color */
    }
    100% {
      background-color: #14ae5c; /* Turn green at the end */
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
