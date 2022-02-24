<script>
    import {onMount} from "svelte";

    export let id, label, type, value, placeholder

    let changeType

    onMount(() => {
        changeType = (type) => { if (label) document.getElementById(id).setAttribute("type", type); }
    })

    $: if(changeType) changeType(type)
</script>

<label for={id} class="flex flex-col gap-2 items-start w-full overflow-hidden">
    {label}
    <div class="bg-surface dark:bg-surfaceDark w-full overflow-hidden rounded-lg">
        <slot name="before"></slot>
        <textarea class="w-full h-full" {id} bind:value rows="4" {placeholder}></textarea>
        <slot name="after"></slot>
    </div>
</label>

<style lang="postcss">
    textarea {
        @apply bg-transparent p-2 px-3 border-[1px] border-outline dark:border-outlineDark rounded-lg;
    }
</style>