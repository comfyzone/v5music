<script lang="ts">
    import { onMount } from "svelte";
    import { getAvatarUrl } from "../../routes/utils.svelte";
    import Avatar from "./Avatar/Avatar.svelte";
    import AvatarFallback from "./Avatar/AvatarFallback.svelte";
    import AvatarImage from "./Avatar/AvatarImage.svelte";
    import Button from "./ui/button/button.svelte";

    let { listeners } = $props();
    let itemListOpen = $state(false);
    let itemListRef: HTMLDivElement | undefined;

    function handleClickOutside(event: MouseEvent) {
        if (!itemListRef?.contains(event.target as Node)) {
            itemListOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });
</script>

<div class="relative shrink-0 listener-container" bind:this={itemListRef}>
    <Button
        variant="outline"
        size="sm"
        class="px-3 py-1 h-9 text-xs border-[#555555] text-[#f5f5f5] lg:hover:bg-[#333333]"
        onclick={() => (itemListOpen = !itemListOpen)}
    >
        Listeners
    </Button>

    <div
        class="listener-menu absolute top-full right-0 mt-1 w-48 max-h-60 overflow-y-auto rounded-lg bg-[#111111] border border-[#333333] py-1 z-50"
        class:visible={itemListOpen}
    >
        {#each listeners as u (u.user.id)}
            <div class="flex items-center gap-2 px-3 py-2 hover:bg-[#333333]">
                <Avatar className="w-6 h-6">
                    <AvatarImage
                        src={getAvatarUrl(u.user)}
                        alt={u.user.username}
                    />
                    <AvatarFallback
                        >{u.user.username.slice(0, 2)}</AvatarFallback
                    >
                </Avatar>
                <span class="text-sm truncate">{u.user.username}</span>
            </div>
        {/each}
    </div>
</div>

<style>
    .listener-container {
        position: relative;
    }

    .listener-menu {
        display: none;
        pointer-events: auto;
    }

    .listener-container:hover .listener-menu {
        display: block;
    }

    .listener-menu.visible {
        display: block;
    }
</style>
