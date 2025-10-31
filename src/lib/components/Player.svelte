<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { pause, previous, skip } from "../../routes/api";
    import {
        type UserData,
        type Member,
        type Track,
        type ClientToServerEvents,
        type ServerToClientEvents,
        AudioPlayerStatus,
    } from "../../routes/socket.svelte";
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
    import { Skeleton } from "$lib/components/ui/skeleton";
    import UserMenu from "./UserMenu.svelte";
    import type { Socket } from "socket.io-client";

    let {
        socket,
        currentlyPlaying,
        currentPlayerState,
        user,
        currentQueue
    }: {
        socket: Socket<ClientToServerEvents, ServerToClientEvents>;
        currentlyPlaying: Track | undefined;
        currentPlayerState: AudioPlayerStatus | undefined;
        user: UserData | undefined;
        currentQueue: Track[] | undefined;
    } = $props();

    const dispatch = createEventDispatcher();

    let progress = $state(0);
    let currentPlaybackDuration = $state(0);
    let songStartTime = $state()

    $inspect(songStartTime)

    //$inspect(currentPlaybackDuration).with(console.log);


    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    }

    let progressInterval: NodeJS.Timeout;
    onMount(() => {
        progressInterval = setInterval(() => {
            if (currentPlayerState === "playing" && currentlyPlaying) {
                currentPlaybackDuration += 1000;
                progress = currentPlaybackDuration / currentlyPlaying.lengthMs * 100
                //console.log(currentPlaybackDuration);
                if (currentPlaybackDuration > currentlyPlaying.lengthMs) {
                    currentlyPlaying.playbackDuration =
                        currentlyPlaying.lengthMs;
                }
            }
        }, 1000);

        if (currentPlayerState === "playing" && currentlyPlaying) {
            songStartTime = new Date().valueOf();
        }

        return () => {
            clearInterval(progressInterval);
        };
    });

    let loading = $state({
        prev: false,
        play: false,
        next: false,
    });

    socket.on("update", (details) => {
        console.log("UPDATE!");
        loading.prev = false;
        loading.play = false;
        loading.next = false;
        currentPlaybackDuration = currentlyPlaying?.playbackDuration || 0
    });

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
</script>

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
                    {#if currentlyPlaying?.images && currentlyPlaying.images.length > 0}
                        <img
                            src={currentlyPlaying.images.at(-1)?.url}
                            alt={currentlyPlaying.title ||
                                currentlyPlaying.name ||
                                "Cover"}
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <Skeleton
                            class="w-full h-full rounded-xl lg:rounded-2xl"
                        />
                    {/if}
                </div>

                <div class="flex-1 min-w-0">
                    {#if currentlyPlaying}
                        <div
                            class="text-sm font-medium truncate text-white lg:text-base"
                        >
                            {currentlyPlaying.title ||
                                currentlyPlaying.name ||
                                "Missing Title"}
                        </div>
                        <div class="text-xs text-[#b9bbbe] truncate">
                            {#if currentlyPlaying?.artists}
                                {currentlyPlaying.artists
                                    .map((a) => a.name)
                                    .join(", ")}
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
                <!-- Media Controls -->
                <div class="flex items-center justify-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        class="p-2 lg:hover:bg-[#5865F2] lg:hover:text-white lg:hover:scale-110"
                        onclick={handlePrevClick}
                        disabled={!currentQueue || (currentlyPlaying && currentlyPlaying.queueIndex <= 0) || loading.prev}
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
                        disabled={!currentlyPlaying || loading.play ||
                            (currentPlayerState !== AudioPlayerStatus.Paused &&
                                currentPlayerState !==
                                    AudioPlayerStatus.Playing)}
                        aria-label="Play or pause"
                    >
                        {#if loading.play || currentPlayerState === AudioPlayerStatus.Buffering}
                            <Spinner class="w-5 h-5 lg:w-8 lg:h-8" />
                        {:else if currentPlayerState === AudioPlayerStatus.Playing}
                            <Pause size={20} class="lg:hidden" />
                            <Pause size={64} class="hidden lg:block" />
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
                        disabled={!currentQueue || (currentlyPlaying && currentlyPlaying.queueIndex >= currentQueue.length-1) || loading.next}
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

                <!-- Progress bar -->
                <div class="w-full px-2 lg:max-w-md lg:mt-2">
                    <div
                        class="flex justify-between text-xs text-[#b9bbbe] mb-1"
                    >
                        {#if currentlyPlaying?.lengthMs}
                            <span
                                >{formatTime(
                                    currentPlaybackDuration / 1000,
                                )}</span
                            >
                            <span class="lg:hidden"
                                >{formatTime(
                                    (currentlyPlaying.lengthMs -
                                        currentPlaybackDuration) /
                                        1000,
                                )}</span
                            >

                            <span class="hidden lg:inline"
                                >{formatTime(
                                    (currentlyPlaying.lengthMs -
                                        currentPlaybackDuration) /
                                        1000,
                                )} / {formatTime(
                                    currentlyPlaying.lengthMs / 1000,
                                )}</span
                            >
                        {/if}
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

        <!-- Right Side Menu (Shuffle, Queue, User) -->
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

<style>
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
</style>
