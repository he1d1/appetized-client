<script>
    import {onMount} from "svelte";

    export let id, label, type, value

    let changeType

    onMount(() => {
        changeType = () => { if (label) document.getElementById(id).setAttribute("type", type); }
    })
</script>

<label for={id} class="flex flex-col gap-2 items-start w-full">
    {label}
    <div class="bg-surface dark:bg-surfaceDark w-full">
        <slot name="before"></slot>
        <input class="w-full" {id} bind:value/>
        <slot name="after"></slot>
    </div>
</label>

<style lang="postcss">
    input {
        @apply bg-transparent p-2 px-3 border-[1px] border-outline dark:border-outlineDark rounded-lg;
    }
</style>