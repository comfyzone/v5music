<script lang="ts">
    import { BadButton } from "$lib/components/Button";
    import { LogIn, MailPlus, ChevronRight } from "lucide-svelte";
    import { onMount } from "svelte";
    import { getCookie } from "../utils.svelte";

    const loginUrl = "/api/discord/login";
    const inviteUrl =
        "https://discord.com/oauth2/authorize?client_id=1220019991563206737";

    let aboutOpen = false;
    let contentEl: HTMLDivElement | null = null;
    let maxHeight = "0px";
    let opacity = 0;

    function toggleAbout() {
        aboutOpen = !aboutOpen;
        if (aboutOpen) {
            requestAnimationFrame(() => {
                if (contentEl) {
                    maxHeight = `${contentEl.scrollHeight}px`;
                    opacity = 1;
                    setTimeout(() => {
                        if (aboutOpen) maxHeight = "none";
                    }, 320);
                } else {
                    maxHeight = "1000px";
                    opacity = 1;
                }
            });
        } else {
            if (contentEl) {
                maxHeight = `${contentEl.scrollHeight}px`;
                opacity = 1;
                contentEl.offsetHeight;
                requestAnimationFrame(() => {
                    maxHeight = "0px";
                    opacity = 0;
                });
            } else {
                maxHeight = "0px";
                opacity = 0;
            }
        }
    }

    function onKeyToggle(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleAbout();
        }
    }

    onMount(() => {
        maxHeight = "0px";
        opacity = 0;
        let sessionId = getCookie("sessionId");
        console.log(sessionId);
        if (sessionId) {
            document.location = "/dashboard";
        }
    });
</script>

<div
    class="min-h-screen flex items-center justify-center bg-black text-white px-4 py-10"
>
    <div
        class="w-full max-w-sm bg-neutral-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl text-center space-y-6 static"
    >
        <div class="space-y-2">
            <h1 class="text-2xl font-semibold">Welcome</h1>
            <p class="text-sm text-white/50">
                Sign in using your Discord account
            </p>
        </div>

        <div class="flex gap-2 w-full">
            <BadButton
                href={loginUrl}
                variant="primary"
                size="lg"
                class="h-[52px] flex-1 flex items-center justify-center gap-2 bg-[#7289da] border border-[#7c99ff] hover:bg-[#809fff] hover:border-[#809fff] hover:shadow-[0_0_10px_rgba(114,137,218,0.4)] transition-all duration-200 p-4 rounded-lg"
                aria-label="Login with Discord"
            >
                <LogIn size={18} /> Login with Discord
            </BadButton>

            <div class="relative group">
                <a
                    href={inviteUrl}
                    class="w-[52px] h-[52px] flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-green-500/60 hover:border-green-400/60 transition-colors"
                    aria-label="Invite Bot"
                >
                    <MailPlus size={20} />
                </a>

                <div
                    class="w-40 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-black text-white text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50"
                >
                    Invite the Music Bot to your server
                    <div
                        class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 -mt-1"
                    ></div>
                </div>
            </div>
        </div>

        <div class="w-full mt-4 text-left static">
            <div class="accordion-group">
                <button
                    type="button"
                    class="cursor-pointer w-full flex items-center justify-between px-4 py-3 bg-white/3 border border-white/6 hover:bg-white/4 transition-colors duration-200 select-none outline-none focus:outline-none focus-visible:outline-none active:outline-none {aboutOpen
                        ? 'rounded-t-lg border-b-0'
                        : 'rounded-lg'}"
                    tabindex="-1"
                    aria-expanded={aboutOpen}
                    aria-controls="about-lorem"
                    on:click={toggleAbout}
                    on:keydown={onKeyToggle}
                >
                    <span class="text-sm font-medium text-white"
                        >Learn about Music Bot</span
                    >
                    <ChevronRight
                        class="w-4 h-4 text-white/70 transition-transform duration-200 {aboutOpen
                            ? '-rotate-90'
                            : ''}"
                    />
                </button>

                <div
                    id="about-lorem"
                    role="region"
                    aria-labelledby="about-lorem"
                    class="overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(.2,.9,.2,1)] {aboutOpen
                        ? 'rounded-b-lg border-t-0'
                        : 'rounded-b-lg'}"
                    bind:this={contentEl}
                    style={`max-height: ${maxHeight}; opacity: ${opacity};`}
                >
                    <div
                        class="px-4 py-3 bg-white/4 border border-white/6 border-t-0 text-sm text-white/70"
                    >
                        <p class="mb-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer nec odio. Praesent libero. Sed cursus
                            ante dapibus diam. Sed nisi.
                        </p>
                        <p>
                            Fusce nec tellus sed augue semper porta. Mauris
                            massa. Vestibulum lacinia arcu eget nulla. Curabitur
                            sodales ligula in libero.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .static {
        position: static !important;
    }
    .accordion-group {
        position: relative;
    }
    .accordion-group > * {
        transition: border-radius 0.2s ease;
    }
    .rotate-90 {
        transform: rotate(90deg);
    }
</style>
