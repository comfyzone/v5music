<script lang="ts">
    import { page } from "$app/state";
</script>

<div class="h-screen w-screen flex justify-center items-center bg-[#000]">
    <img class="h-[60%]" src="https://http.cat/{page.status}" alt="{page.status.toString()}"> <!-- border-[rgba(220,220,220,0.2)] border-[1px] rounded-md shadow-[0px_0px_10px_5px_#999] -->
</div>

<!-- ! DO NOT REMOVE -->
<!-- ? This code below is for demonstration -->
<!-- <script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import Ercode404Page from "$lib/components/ercode_404_page.svelte";

    let page_content: any;

    onMount(() => {
     switch(page.status) {
            case 404:
                page_content = Ercode404Page
            break;
        default:
            break;
        }
        
    });
</script>

<svelte:component this={page_content} /> -->
