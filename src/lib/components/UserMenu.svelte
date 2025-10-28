<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/Avatar";
    import { LogOut } from "lucide-svelte";
    import { onMount } from "svelte";
    const logoutUrl = "/api/discord/logout";
    let { user } = $props();

    let avatarMenuRef: HTMLDivElement | undefined = $state();
    let avatarMenuOpen = $state(false);

    function handleClickOutside(event: MouseEvent) {
        if (!avatarMenuRef?.contains(event.target as Node)) {
            avatarMenuOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    });

</script>
{#if user}
    <div class="relative" bind:this={avatarMenuRef}>
        <Button
            variant="ghost"
            size="sm"
            class="w-8 h-8 rounded-full overflow-hidden p-0 border border-[#525252] lg:hover:bg-[#5865F2] lg:w-10 lg:h-10"
            onclick={() => (avatarMenuOpen = !avatarMenuOpen)}
            aria-label="User menu"
        >
            <Avatar className="w-full h-full rounded-full">
                <AvatarImage
                    className="w-full h-full object-cover"
                    src={user.avatarURL}
                    alt={user.username}
                />
                <AvatarFallback
                    >{(user.username || "ER")
                        .slice(0, 2)
                        .toUpperCase()}</AvatarFallback
                >
            </Avatar>
        </Button>

        {#if avatarMenuOpen}
            <Button
                onclick={() => (window.location.href = logoutUrl)}
                class="absolute -top-12 left-1/2 transform -translate-x-1/2 w-10 h-10 text-red-400 bg-[#111111] rounded-full flex items-center justify-center border border-[#333333] z-50"
                aria-label="Logout"
            >
                <LogOut size={16} />
            </Button>
        {/if}
    </div>
{/if}
