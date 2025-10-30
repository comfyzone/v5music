<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    type UserData,
    type Member,
    type Track,
    type ClientToServerEvents,
    type ServerToClientEvents,
    AudioPlayerStatus,
  } from "../socket.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Slider } from "$lib/components/ui/slider";
  import { Spinner } from "$lib/components/ui/spinner";
  import {
    Play,
    SkipBack,
    SkipForward,
    Shuffle,
    List,
    ExternalLink,
    Pause,
  } from "lucide-svelte";
  import { getCookie } from "../utils.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { Input } from "$lib/components/ui/input";
  import { io, type Socket } from "socket.io-client";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import Listeners from "$lib/components/Listeners.svelte";
  import Player from "$lib/components/Player.svelte";
  import DragAndDrop from "$lib/components/DragAndDrop.svelte";

  let listeners: Member[] = [];

  let songLink = "";

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
    currentPlayerState = currentlyPlaying?.playerState;
  });

  let currentPlayerState: AudioPlayerStatus | undefined;
  socket.on("playerStateUpdate", (playerState) => {
    currentPlayerState = playerState;
  });

  onMount(() => {
    const sessionId = getCookie("sessionId");
    if (!sessionId) window.location.href = "/login";
  });

  function handleSongSubmit() {
    if (!songLink.trim()) return;
    console.log("Song link submitted:", songLink);
  }
</script>

<DragAndDrop />

<!-- bg -->
<div
  class="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000 ease-in-out select-none pointer-events-none"
>
  {#if currentlyPlaying?.images && currentlyPlaying.images.length > 0}
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      style="background-image: url('{currentlyPlaying.images[0]
        .url}'); filter: blur(40px) brightness(0.7); transform: scale(1.1);"
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
      {#if currentlyPlaying?.images && currentlyPlaying.images.length > 0}
        <img
          src={currentlyPlaying.images[0].url}
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

  <Player {socket} {currentlyPlaying} {currentPlayerState} {user} />
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
