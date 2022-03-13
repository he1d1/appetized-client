<script>
    import {onMount} from "svelte";

    export let id, label, type, value, placeholder, accept, required = false

    let changeType

    onMount(() => {
        changeType = (type) => { if (label) document.getElementById(id).setAttribute("type", type); }
    })

    $: if(changeType) changeType(type)
</script>

<label for={id} class="flex flex-col gap-2 items-start w-full" on:change>
    <span>{label}
        {#if required}<span class="text-error dark:text-errorDark">*</span>{/if}</span>
    <div class="bg-surface dark:bg-surfaceDark w-full rounded-lg border-[1px] border-outline dark:border-outlineDark">
        <slot name="before"></slot>
        <input class="w-full focus:outline-none bg-transparent p-2 px-3" {id} {placeholder} bind:value {accept}/>
        <slot name="after"></slot>
    </div>
</label>