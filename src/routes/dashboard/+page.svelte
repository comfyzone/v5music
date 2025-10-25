<script lang="ts">
  import { socket, type UserData, type Member } from "../socket.svelte";
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/Avatar";
  import { ButtonGroup, Button } from "$lib/components/Button";
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

  const logoutUrl = "/api/discord/logout";

  let user: UserData | undefined;
  let trayOpen = false;
  let trayRef: HTMLDivElement;
  let progress = 0;

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
  class="absolute top-4 right-4 z-50"
  id="topRightContainer"
  bind:this={itemListRef}
>
  <button
    class="px-4 py-2 border border-[#555555] text-[#f5f5f5] bg-transparent rounded-lg font-semibold text-sm hover:bg-[#333333] transition-colors"
    onclick={toggleItemList}
  >
    Listeners
  </button>

  {#if itemListOpen}
    <div class="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden flex flex-col bg-[#111111] border border-[#333333]">
      {#each placeholderUsers as u, i}
        <button
          class="flex items-center gap-3 justify-start px-3 py-2 rounded-md transition-colors text-[#f5f5f5] hover:bg-[#333333] mt-1 first:mt-0 bg-transparent border-none"
        >
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
          <span class="truncate">{u.user.username}</span>
        </button>
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
        variant="secondary"
        size="lg"
        class="transition-transform hover:scale-110"
      >
        <SkipBack size={28} />
      </Button>
      <Button
        variant="primary"
        size="lg"
        class="transition-transform hover:scale-110"
      >
        <Play size={32} />
      </Button>
      <Button
        variant="secondary"
        size="lg"
        class="transition-transform hover:scale-110"
      >
        <SkipForward size={28} />
      </Button>
    </ButtonGroup>

    <div class="w-full max-w-md h-1 bg-[#262626] rounded overflow-hidden mt-2">
      <div
        class="h-1 bg-[#7289da] rounded transition-all duration-150"
        style={`width: ${progress}%`}
      ></div>
    </div>
  </div>

  <div class="flex items-center justify-end space-x-3">
    <Button
      variant="secondary"
      size="md"
      class="p-2 transition-transform hover:scale-110"
    >
      <Shuffle size={20} />
    </Button>
    <Button
      variant="secondary"
      size="md"
      class="p-2 transition-transform hover:scale-110"
    >
      <List size={20} />
    </Button>

    {#if user}
      <div class="relative" bind:this={trayRef}>
        <button
          class="w-12 h-12 rounded-full overflow-hidden border border-[#525252] hover:border-[#a3a3a3] transition-colors"
          onclick={toggleTray}
        >
          <Avatar className="w-full h-full rounded-full">
            <AvatarImage src={user.avatarURL} alt={user.username} />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </button>

        {#if trayOpen}
          <div
            class="absolute bottom-full right-0 mb-2 w-52 bg-[#111111] rounded-lg shadow-lg p-2 z-50"
            transition:fly={{ y: 5, duration: 200, opacity: 0 }}
          >
            <div class="flex flex-col">
              <a
                href="#"
                class="flex justify-between items-center px-3 py-2 hover:bg-[#525252] rounded transition-colors text-sm"
              >
                <span>Profile</span>
                <User size={16} />
              </a>
              <a
                href={logoutUrl}
                class="flex justify-between items-center px-3 py-2 hover:bg-[#525252] rounded transition-colors text-sm"
              >
                <span>Logout</span>
                <LogOut size={16} />
              </a>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
