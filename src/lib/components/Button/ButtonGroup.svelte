<script lang="ts">
    import { setContext } from "svelte";

    type ButtonPosition = "first" | "middle" | "last" | "single";
    type GroupMember = {
        id: number;
        updatePosition: (pos: ButtonPosition, vertical: boolean, radius: string) => void;
    };

    export let rounded = "12px";
    export let vertical = false;

    let members: GroupMember[] = [];
    let idCounter = 0;

    function recomputePositions() {
        const totalButtons = members.length;
        
        members.forEach((member, index) => {
            let position: ButtonPosition = "single";
            
            if (totalButtons === 1) {
                position = "single";
            } else if (index === 0) {
                position = "first";
            } else if (index === totalButtons - 1) {
                position = "last";
            } else {
                position = "middle";
            }
            
            member.updatePosition(position, vertical, rounded);
        });
    }

    function register(updateFunction: GroupMember["updatePosition"]) {
        const id = ++idCounter;
        members.push({ id, updatePosition: updateFunction });
        recomputePositions();
    
        return () => {
            members = members.filter((member) => member.id !== id);
            recomputePositions();
        };
    }

    $: {
        recomputePositions();
    }

    setContext("button-group", { register });
</script>

<div
    class="button-group"
    class:vertical
    class:horizontal={!vertical}
    {...$$restProps}
>
    <slot />
</div>

<style>
    .button-group {
        display: inline-flex;
        gap: 0;
    }

    .button-group.horizontal {
        flex-direction: row;
        align-items: stretch;
    }

    .button-group.vertical {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
    }

    .button-group :global(button),
    .button-group :global(a) {
        margin: 0;
    }

    .button-group.horizontal :global(button),
    .button-group.horizontal :global(a) {
        flex: 1;
    }

    .button-group.vertical :global(button),
    .button-group.vertical :global(a) {
        width: 100%;
    }
</style>