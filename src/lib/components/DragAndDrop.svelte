<script lang="ts">
    import { playResource, queueSongIds } from "../../routes/api";

    function dropHandler(ev: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.stopPropagation();
        ev.preventDefault();
        if (!ev.dataTransfer) return;
        console.log("SPOTIFY DROP");

        var songUrls = ev.dataTransfer
            .getData("text/plain")
            .split("\n")
            .filter((s) => s.startsWith("https://open.spotify.com/track/"));
        if (songUrls.length == 0) return;

        if (songUrls.length == 1) {
            playResource(songUrls[0]);
            return;
        }

        queueSongIds(songUrls.map((s) => s.split("/").at(-1) || ""));
    }

    function dragOverHandler(ev: DragEvent) {
        console.log("SPOTIFY DRAG OVER");
        ev.preventDefault();
    }

</script>

<svelte:document ondragover={dragOverHandler} ondrop={dropHandler} />