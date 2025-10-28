<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    type UserData,
    type Member,
    type Track,
    type ClientToServerEvents,
    type ServerToClientEvents,
  } from "../socket.svelte";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/Avatar";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Slider } from "$lib/components/ui/slider";
  import { Spinner } from "$lib/components/ui/spinner";
  import {
    LogOut,
    Play,
    SkipBack,
    SkipForward,
    Shuffle,
    List,
    ExternalLink,
  } from "lucide-svelte";
  import { getCookie } from "../utils.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { getAvatarUrl } from "../utils.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { io, type Socket } from "socket.io-client";
  import { pause, previous, skip } from "../api";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import Listeners from "$lib/components/Listeners.svelte";
    import UserMenu from "$lib/components/UserMenu.svelte";

  const dispatch = createEventDispatcher();
  const logoutUrl = "/api/discord/logout";

  
  let listeners: Member[] = [];

  
  let songLink = "";

  let progress = 0;
  let currentPlaybackDuration = 0;
  let currentTrackLength = 0;

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  $: elapsed = formatTime(currentPlaybackDuration);
  $: remaining = formatTime(currentTrackLength - currentPlaybackDuration);
  $: totalTime = formatTime(currentTrackLength);

  const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io({
    transports: ["websocket"],
    path: "/api/socket.io",
  });

  socket.on("voiceChannelUpdate", (voiceChannel) => {
    listeners = voiceChannel.members;
  });

  let user: UserData | undefined;
  socket.on("userData", (userData) => {
    user = userData;
  });

  let currentlyPlaying: Track | undefined;
  socket.on("update", (details) => {
    currentlyPlaying = details;

    if (details) {
      currentTrackLength = Math.floor(details.lengthMs / 1000);
      currentPlaybackDuration = Math.floor(details.playbackDuration / 1000);

      progress =
        currentTrackLength > 0
          ? (currentPlaybackDuration / currentTrackLength) * 100
          : 0;
    } else {
      currentTrackLength = 0;
      currentPlaybackDuration = 0;
      progress = 0;
    }

    loading.prev = false;
    loading.play = false;
    loading.next = false;
  });

  let progressInterval: NodeJS.Timeout;
  onMount(() => {
    const sessionId = getCookie("sessionId");
    if (!sessionId) window.location.href = "/login";

    progressInterval = setInterval(() => {
      if (currentlyPlaying && currentlyPlaying.playerState === "playing") {
        currentPlaybackDuration += 1;
        if (currentPlaybackDuration > currentTrackLength) {
          currentPlaybackDuration = currentTrackLength;
        }

        if (currentTrackLength > 0) {
          progress = (currentPlaybackDuration / currentTrackLength) * 100;
        }
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
    };
  });

  let loading = {
    prev: false,
    play: false,
    next: false,
  };

  const MIN_SPINNER_MS = 300;

  function ensureMinSpinner(start: number) {
    const elapsed = Date.now() - start;
    if (elapsed < MIN_SPINNER_MS) {
      return new Promise((r) => setTimeout(r, MIN_SPINNER_MS - elapsed));
    }
    return Promise.resolve();
  }

  async function handlePrevClick() {
    if (loading.prev) return;
    loading.prev = true;
    const start = Date.now();
    try {
      await previous();
    } catch (err) {
      console.error("previous failed", err);
    } finally {
      await ensureMinSpinner(start);
      loading.prev = false;
    }
  }

  async function handlePlayClick() {
    if (loading.play) return;
    loading.play = true;
    const start = Date.now();
    try {
      await pause();
    } catch (err) {
      console.error("play/pause failed", err);
    } finally {
      await ensureMinSpinner(start);
      loading.play = false;
    }
  }

  async function handleNextClick() {
    if (loading.next) return;
    loading.next = true;
    const start = Date.now();
    try {
      await skip();
    } catch (err) {
      console.error("skip failed", err);
    } finally {
      await ensureMinSpinner(start);
      loading.next = false;
    }
  }

  function handleSongSubmit() {
    if (!songLink.trim()) return;
    console.log("Song link submitted:", songLink);
  }
</script>

<!-- bg -->
<div
  class="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000 ease-in-out select-none pointer-events-none"
>
  {#if currentlyPlaying?.largeImage}
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      style="background-image: url('{currentlyPlaying.largeImage}'); filter: blur(40px) brightness(0.7); transform: scale(1.1);"
      aria-hidden="true"
    ></div>
  {:else}
    <div
      class="absolute inset-0 bg-linear-to-br from-purple-900 via-gray-900 to-black"
      aria-hidden="true"
    ></div>
  {/if}
</div>

<div
  class="fixed inset-0 z-20 ui-shell pointer-events-none text-white"
  aria-hidden="false"
>
  <!-- input & listeners -->
  <div class="ui-top pointer-events-auto">
    <div
      class="absolute top-2 left-2 right-2 z-50 flex items-center justify-between gap-2"
      id="topRightContainer"
    >
      <div class="input-wrapper flex-1 min-w-0">
        <Input
          type="text"
          placeholder="Enter song link"
          bind:value={songLink}
          onkeydown={(e) => e.key === "Enter" && handleSongSubmit()}
          class="bg-[#111111] border-[#333333] text-[#f5f5f5] placeholder-[#777777] text-sm h-9 w-full lg:w-auto"
        />
      </div>

      <Listeners {listeners} />
    </div>
  </div>

  <div class="ui-center pointer-events-none">
    <div
      class="cover-box pointer-events-auto group"
      in:fly={{ y: 20, duration: 500 }}
      out:fly={{ y: -20, duration: 500 }}
      aria-hidden={currentlyPlaying ? "false" : "true"}
    >
      {#if currentlyPlaying?.largeImage}
        <img
          src={currentlyPlaying.largeImage}
          alt={currentlyPlaying.title || currentlyPlaying.name || "Album Cover"}
          class="w-full h-full object-cover rounded-4xl shadow-4xl shadow-black/50"
        />
      {:else}
        <Skeleton class="w-full h-full rounded-4xl" />
      {/if}

      {#if currentlyPlaying}
        <a
          href={currentlyPlaying.type === "youtubeVideo"
            ? `https://www.youtube.com/watch?v=${currentlyPlaying.id}`
            : currentlyPlaying.type === "spotifyTrack"
              ? `https://open.spotify.com/track/${currentlyPlaying.id}`
              : "#"}
          target="_blank"
          rel="noopener noreferrer"
          class="absolute inset-0 flex items-center justify-center pointer-events-auto"
          aria-label="Redirect To Song Link"
        >
          <div
            class="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/70 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"
            aria-hidden="true"
          ></div>

          <ExternalLink
            class="w-8 h-8 sm:w-12 sm:h-12 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse pointer-events-none"
            aria-hidden="true"
          />
        </a>
      {/if}
    </div>
  </div>

  <!-- player -->
  <div class="ui-bottom pointer-events-auto">
    <div
      class="w-full bg-[#0a0a0a] border-t border-white/10 backdrop-blur-md p-3 text-white shadow-xl mobile-player-grid"
      role="region"
      aria-label="Music player"
    >
      <div class="song-info-section lg:flex lg:items-center lg:justify-start">
        <div class="flex items-center space-x-3 w-full min-w-0 lg:pl-8">
          <div
            class="w-10 h-10 rounded-xl shrink-0 overflow-hidden bg-[#525252] lg:w-12 lg:h-12 lg:rounded-2xl"
          >
            {#if currentlyPlaying?.coverImage}
              <img
                src={currentlyPlaying.coverImage}
                alt={currentlyPlaying.title || currentlyPlaying.name || "Cover"}
                class="w-full h-full object-cover"
              />
            {:else}
              <Skeleton class="w-full h-full rounded-xl lg:rounded-2xl" />
            {/if}
          </div>

          <div class="flex-1 min-w-0">
            {#if currentlyPlaying}
              <div class="text-sm font-medium truncate text-white lg:text-base">
                {currentlyPlaying.title ||
                  currentlyPlaying.name ||
                  "Missing Title"}
              </div>
              <div class="text-xs text-[#b9bbbe] truncate">
                {#if currentlyPlaying?.artists}
                  {currentlyPlaying.artists.map((a) => a.name).join(", ")}
                {:else}
                  Missing Artist
                {/if}
              </div>
            {:else}
              <Skeleton class="h-3 w-32 rounded mb-1 lg:h-4" />
              <Skeleton class="h-2 w-24 rounded lg:h-3" />
            {/if}
          </div>
        </div>
      </div>

      <div class="controls-section">
        <div class="flex flex-col items-center space-y-2 w-full">
          <div class="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              class="p-2 lg:hover:bg-[#5865F2] lg:hover:text-white lg:hover:scale-110"
              onclick={handlePrevClick}
              disabled={loading.prev}
              aria-label="Previous track"
            >
              {#if loading.prev}
                <Spinner class="w-4 h-4 lg:w-8 lg:h-8" />
              {:else}
                <SkipBack size={18} class="lg:hidden" />
                <SkipBack size={28} class="hidden lg:block" />
              {/if}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              class="p-2 lg:hover:bg-[#5865F2] lg:hover:text-white lg:hover:scale-110"
              onclick={handlePlayClick}
              disabled={loading.play}
              aria-label="Play or pause"
            >
              {#if loading.play}
                <Spinner class="w-5 h-5 lg:w-8 lg:h-8" />
              {:else}
                <Play size={20} class="lg:hidden" />
                <Play size={64} class="hidden lg:block" />
              {/if}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              class="p-2 lg:hover:bg-[#5865F2] lg:hover:text-white lg:hover:scale-110"
              onclick={handleNextClick}
              disabled={loading.next}
              aria-label="Next track"
            >
              {#if loading.next}
                <Spinner class="w-4 h-4 lg:w-8 lg:h-8" />
              {:else}
                <SkipForward size={18} class="lg:hidden" />
                <SkipForward size={28} class="hidden lg:block" />
              {/if}
            </Button>
          </div>

          <div class="w-full px-2 lg:max-w-md lg:mt-2">
            <div class="flex justify-between text-xs text-[#b9bbbe] mb-1">
              <span>{elapsed}</span>
              <span class="lg:hidden">{remaining}</span>
              <span class="hidden lg:inline">{remaining} / {totalTime}</span>
            </div>
            <Slider
              type="single"
              bind:value={progress}
              min={0}
              max={100}
              step={0.1}
              class="w-full pointer-events-none"
              aria-label="Playback progress"
            />
          </div>
        </div>
      </div>

      <div class="avatar-section lg:flex lg:items-center lg:justify-end">
        <div class="flex items-center justify-end space-x-2 lg:pr-8">
          <Button
            variant="ghost"
            size="sm"
            class="p-1 lg:hover:bg-[#5865F2] lg:hover:text-white"
            onclick={() => dispatch("shuffle")}
            aria-label="Shuffle"
          >
            <Shuffle size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="p-1 lg:hover:bg-[#5865F2] lg:hover:text-white"
            onclick={() => dispatch("list")}
            aria-label="Open list"
          >
            <List size={16} />
          </Button>

          <UserMenu {user} />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .ui-shell {
    display: flex;
    flex-direction: column;
  }

  .ui-shell.pointer-events-none {
    pointer-events: none;
  }
  .ui-shell .pointer-events-auto {
    pointer-events: auto;
  }

  .ui-top {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 0.5rem;
    pointer-events: none;
  }

  .ui-center {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .cover-box {
    position: relative;
    border-radius: 1rem;
    overflow: hidden;
    width: clamp(6rem, 28vw, 24rem);
    height: auto;
    aspect-ratio: 1/1;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    pointer-events: auto;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;
  }

  .cover-box:active {
    transform: scale(0.995);
  }

  @media (min-width: 1024px) {
    .cover-box {
      width: clamp(10rem, 22vw, 28rem);
    }
  }

  .ui-bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: end;
    pointer-events: none;
  }

  .mobile-player-grid {
    pointer-events: auto;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .avatar-section {
    justify-content: end;
  }

  .song-info-section,
  .avatar-section,
  .controls-section {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }

  .song-info-section {
    overflow: auto;
  }

  @media (max-width: 1024px) {
    .controls-section {
      min-width: 100%;
      order: 1;
    }
    .avatar-section {
      flex-grow: 0;
    }
  }

  @media (min-width: 1024px) {
    .mobile-player-grid {
      border-radius: 1rem;
      margin: 1rem;
      border: 1px solid rgb(255 255 255 / 0.1);
      padding: 1rem;
      align-items: stretch;
      min-height: 80px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .transition-transform {
      animation: none !important;
      transition: none !important;
    }
  }

  .fixed.inset-0.-z-10 {
    z-index: -10;
  }
  .fixed.inset-0.z-20 {
    z-index: 20;
  }
</style>
