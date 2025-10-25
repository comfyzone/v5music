<script lang="ts">
  import { socket, type UserData, type Member } from "../socket.svelte";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/Avatar";
  import { ButtonGroup } from "$lib/components/Button";
  import { Button } from "$lib/components/ui/button/index.js";
  import Slider from "$lib/components/ui/slider/slider.svelte";
  import {
    LogOut,
    Play,
    SkipBack,
    SkipForward,
    User,
    Shuffle,
    List,
  } from "lucide-svelte";
  import { getCookie } from "../utils.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { getAvatarUrl } from "../utils.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";

  const logoutUrl = "/api/discord/logout";
  const trackLength = 180;

  let user: UserData | undefined;
  let trayOpen = false;
  let trayRef: HTMLDivElement;

  let progress = 0;

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  $: elapsed = formatTime((progress / 100) * trackLength);
  $: remaining = formatTime(trackLength - (progress / 100) * trackLength);

  let itemListOpen = false;
  let itemListRef: HTMLDivElement;

  let placeholderUsers: Member[] = [];

  socket.on("voiceChannelUpdate", (voiceChannel) => {
    placeholderUsers = voiceChannel.members;
  });

  socket.on("userData", (userData) => (user = userData));

  function toggleTray() {
    trayOpen = !trayOpen;
  }

  function toggleItemList() {
    itemListOpen = !itemListOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    if (trayRef && !trayRef.contains(event.target as Node)) trayOpen = false;
    if (itemListRef && !itemListRef.contains(event.target as Node))
      itemListOpen = false;
  }

  onMount(() => {
    const sessionId = getCookie("sessionId");
    if (!sessionId) window.location.href = "/login";

    document.addEventListener("click", handleClickOutside);

    const interval = setInterval(() => {
      progress += Math.random() * 0.5;
      if (progress > 100) progress = 0;
    }, 200);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      clearInterval(interval);
    };
  });
</script>

<div
  class="absolute top-4 right-4 z-50 flex items-center gap-3"
  id="topRightContainer"
  bind:this={itemListRef}
>
  <div class="w-64">
    <Input
      type="text"
      placeholder="Enter song link"
      class="bg-[#111111] border-[#333333] text-[#f5f5f5] placeholder-[#777777] focus-visible:border-[#555555] focus-visible:ring-[#555555]"
    />
  </div>

  <Button
    variant="outline"
    onclick={toggleItemList}
    class="px-4 py-2 rounded-lg font-semibold text-sm text-[#f5f5f5] border-[#555555] bg-transparent hover:bg-[#333333] hover:text-white transition-colors"
    aria-expanded={itemListOpen}
    aria-controls="listeners-list"
  >
    Listeners
  </Button>

  {#if itemListOpen}
    <div
      id="listeners-list"
      class="absolute top-full right-0 mt-2 w-52 rounded-lg shadow-lg overflow-hidden flex flex-col bg-[#111111] border border-[#333333] gap-y-1.5 py-2"
    >
      {#each placeholderUsers as u (u.user.id)}
        <Button
          variant="ghost"
          size="default"
          class="justify-start w-full px-3 py-2 rounded-none transition-colors text-[#f5f5f5] hover:bg-[#333333] hover:text-white bg-transparent border-none"
          onclick={() => {}}
        >
          <div class="flex items-center gap-3">
            <Avatar className="w-8 h-8 shrink-0 rounded-full">
              <AvatarImage
                src={getAvatarUrl(u.user, 32) || "/default-avatar.png"}
                alt={u.user.username}
                on:error={(e) => {
                  const img = e.target as HTMLImageElement | null;
                  if (img) img.src = "/default-avatar.png";
                }}
              />
              <AvatarFallback>{u.user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div class="flex items-center gap-2 truncate">
              <span class="truncate">{u.user.username}</span>
              {#if u.user.bot}
                <Badge
                  variant="secondary"
                  class="px-1.5! py-0.5! bg-[#5865f2] text-white text-[10px] rounded-[8px]"
                >
                  APP
                </Badge>
              {/if}
            </div>
          </div>
        </Button>
      {/each}
    </div>
  {/if}
</div>

<div
  class="fixed bottom-4 left-4 right-4 bg-[#0a0a0a] border border-white/10 backdrop-blur-md rounded-xl p-4 text-white grid grid-cols-[1fr_2fr_1fr] items-center shadow-xl gap-4"
>
  <div class="flex items-center justify-start h-full">
    <div class="flex items-center space-x-3 p-2">
      <div class="w-12 h-12 bg-[#525252] rounded shrink-0"></div>
      <div class="flex flex-col justify-center">
        <div class="w-28 h-4 bg-[#262626] rounded mb-1"></div>
        <div class="w-20 h-3 bg-[#262626] rounded"></div>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-center space-y-2">
    <ButtonGroup class="flex items-center justify-center space-x-6">
      <Button
        variant="ghost"
        size="lg"
        class="transition-transform hover:scale-110 hover:bg-[#5865F2] hover:text-white"
        onclick={() => {}}
      >
        <SkipBack size={28} />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        class="transition-transform hover:scale-110 hover:bg-[#5865F2] hover:text-white"
        onclick={() => {}}
      >
        <Play size={64} />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        class="transition-transform hover:scale-110 hover:bg-[#5865F2] hover:text-white"
        onclick={() => {}}
      >
        <SkipForward size={28} />
      </Button>
    </ButtonGroup>

    
    <div class="flex flex-col items-center space-y-2 w-full max-w-md mt-2">
      <div class="flex justify-between text-xs text-[#b9bbbe] w-full mb-1">
        <span>{elapsed}</span>
        <span>{remaining} / {formatTime(trackLength)}</span>
      </div>

      <Slider
        type="single"
        bind:value={progress}
        min={0}
        max={100}
        step={0.1}
        class="w-full"
      />
    </div>
  </div>

  <div class="flex items-center justify-end space-x-3">
    <Button
      variant="ghost"
      size="default"
      class="p-2 transition-transform hover:scale-110 hover:bg-[#5865F2] hover:text-white"
      onclick={() => {}}
    >
      <Shuffle size={20} />
    </Button>

    <Button
      variant="ghost"
      size="default"
      class="p-2 transition-transform hover:scale-110 hover:bg-[#5865F2] hover:text-white"
      onclick={() => {}}
    >
      <List size={20} />
    </Button>

    {#if user}
      <div class="relative" bind:this={trayRef}>
        <Button
          variant="ghost"
          size="icon"
          class="w-12 h-12 rounded-full overflow-hidden border border-[#525252] hover:border-[#a3a3a3] transition-colors p-0"
          onclick={toggleTray}
        >
          <Avatar className="w-full h-full rounded-full">
            <AvatarImage src={user.avatarURL} alt={user.username} />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </Button>

        {#if trayOpen}
          <div
            class="absolute bottom-full right-0 mb-2 w-52 bg-[#111111] rounded-lg shadow-lg p-2 z-50"
            transition:fly={{ y: 5, duration: 200, opacity: 0 }}
          >
            <div class="flex flex-col">
              <Button
                variant="ghost"
                href="#"
                class="flex justify-between items-center px-3 py-2 hover:bg-[#525252] rounded transition-colors text-sm"
              >
                <span>Profile</span>
                <User size={16} />
              </Button>

              <Button
                variant="ghost"
                href={logoutUrl}
                class="flex justify-between items-center px-3 py-2 hover:bg-[#525252] rounded transition-colors text-sm"
              >
                <span>Logout</span>
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
