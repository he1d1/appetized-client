<script context="module" lang="ts">
    export async function load({url}) {
        return {props: {url}}
    }
</script>

<script lang="ts">
    import '../app.css';
    import Explore from "svelte-material-icons/Compass.svelte"
    import Plus from "svelte-material-icons/Plus.svelte"
    import Bookmark from "svelte-material-icons/Bookmark.svelte"
    import AccountCircle from "svelte-material-icons/AccountCircle.svelte"
    import Back from "svelte-material-icons/ArrowLeft.svelte"
    import {goto, prefetch} from "$app/navigation";
    import {fly, fade} from "svelte/transition";
    import IconButton from "$lib/IconButton.svelte";
    import {navigating} from "$app/stores";
    import {onMount} from "svelte";
    import {currentRoute, modal} from "../store";
    import Logo from "$lib/Logo.svelte";
    import Button from "$lib/Button.svelte";

    export let url;

    const routes = [
        {
            route: '/',
            name: 'Home',
            icon: Explore,
        },
        {
            route: '/create',
            name: 'Create',
            icon: Plus,
        },
        {
            route: '/saved',
            name: 'Saved',
            icon: Bookmark,
        },
        {
            route: '/@me',
            name: 'Profile',
            icon: AccountCircle,
        },
    ];

    // History of $navigating
    let previous = []

    async function previousAdd(navigating) {
        if (navigating) previous.unshift(navigating)
        previous = previous
    }

    $: previousAdd($navigating)

    let mounted = false;
    onMount(async () => {
        mounted = true;
    })

    let navPage = null;
</script>

<svelte:head>
    <title>{$currentRoute?.name ?? "Appetized"}</title>
</svelte:head>

{#if $modal}
    <div id="modal" transition:fade={{duration: 100}} class:danger={$modal?.danger} class="absolute inset-0 z-40" on:click={() => $modal = $modal?.closable ? undefined : $modal}>
        <div class="flex items-center justify-center h-full">
            <div class="bg-surface dark:bg-surfaceDark p-4 m-4 rounded-lg text-onSurface dark:text-onSurfaceDark flex flex-col gap-2">
                <h1>{$modal?.title}</h1>
                <p>{$modal?.content}</p>
                <hr>
                <div class="flex justify-end">
                    {#each $modal?.actions as action}
                        <Button
                            primary={action?.buttonType === "primary"}
                            secondary={action?.buttonType === "secondary"}
                            text={action?.buttonType === "text"}
                            danger={action?.buttonType === "danger"}
                            on:click={action?.click}
                        >
                            {action?.label}
                        </Button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}

{#if mounted}
    <div class="h-screen flex flex-col w-screen overflow-hidden">
        <header class="bg-surface dark:bg-surfaceDark text-onSurface dark:text-onSurfaceDark pt-5 pb-6 px-4 flex flex-col justify-end">
            <div class="flex flex-1 gap-6 justify-end items-start">
                <div class="flex-1 flex">
                    {#if previous.length > 1}
                        <IconButton on:click={async () => {
                        previous.pop();
                        await history.back();
                        previous.pop();
                        previous = previous;
                    }}>
                            <Back size="24"/>
                        </IconButton>
                    {:else if $currentRoute?.name}
                        <h1 class="leading-none italic font-black text-onSurface dark:text-onSurfaceDark">{$currentRoute?.name}</h1>
                    {/if}
                </div>
                {#each $currentRoute?.buttons ?? [] as button}
                    <IconButton on:click={() => button.click()}>
                        <svelte:component size="24" this={ button.component }/>
                    </IconButton>
                {/each}
            </div>
            {#if previous.length > 1}<h1 class="pt-5 leading-none italic font-black">{$currentRoute?.name}</h1>{/if}
        </header>
        {#key navPage}
        <main in:fade={{ duration: 150, delay: 150 }}
              out:fade={{ duration: 150 }}
              class="flex-1 overflow-scroll px-4 pb-4">
            <slot/>
        </main>
            {/key}
        <nav class="flex gap-2 h-20 bg-surface dark:bg-surfaceDark relative after:absolute after:inset-0 after:content-[' '] after:bg-surfaceVariant dark:after:bg-surfaceVariantDark">
            {#each routes as route, i}
                <button on:click={() => {if (route.route !== url.pathname) { goto(route.route); navPage = route.route}}} on:mouseenter|once={() => {if (route.route !== url.pathname) prefetch(route.route)}} class={`overflow-hidden transition-opacity block z-10 cursor-pointer text-onSurfaceVariant dark:text-onSurfaceVariantDark flex flex-col items-center justify-center gap-1 w-full pt-3 pb-4 relative after:absolute after:inset-0 after:bg-surfaceVariant after:dark:bg-surfaceVariantDark after:opacity-0 after:hover:opacity-[8%] after:focus-visible:opacity-[12%] after:active:opacity-[12%] focus:outline-0 focus:outline-none focus:border-0 ${url.pathname === route.route && "after:bg-surface after:dark:bg-surfaceDark"}`}>
                    <span class={`p-1 bg-opacity-0 transition-all rounded-[1rem] ${(url.pathname.substring(0, url.pathname.indexOf("/", 2)) === route.route || url.pathname === route.route) && "bg-secondaryContainer dark:bg-secondaryContainerDark text-onSecondaryContainer dark:text-onSecondaryContainerDark px-5 bg-opacity-100"}`}>
                        <i class="w-6 h-6 relative">
                            <svelte:component this={route.icon} size="24"/>
                        </i></span>
                    <small>{route.name}</small>
                </button>
            {/each}
        </nav>
    </div>
{:else}
    <main out:fly={{ y:-50, duration: 150 }}
          class="bg-primary dark:bg-primaryDark flex flex-col gap-4 items-center justify-center h-screen p-[25%]">
        <Logo loading={!mounted}/>
    </main>
{/if}

<style lang="postcss">
    nav:after {
        --tw-bg-opacity: 10%;
    }
    #modal.danger {
        @apply bg-error/25 dark:bg-errorDark/25
    }
    #modal:not(.danger) {
        @apply bg-primary/25 dark:bg-primaryDark/25
    }
</style>