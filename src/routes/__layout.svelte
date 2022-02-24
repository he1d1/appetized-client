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
    import Search from "svelte-material-icons/Magnify.svelte"
    import More from "svelte-material-icons/DotsVertical.svelte"
    import {goto, prefetch} from "$app/navigation";
    import {fly} from "svelte/transition";
    import IconButton from "$lib/IconButton.svelte";
    import {navigating, page} from "$app/stores";
    import {onMount} from "svelte";
    import {authed, currentRoute} from "../store";
    import Logo from "$lib/Logo.svelte";

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

</script>

<svelte:head>
    {#if $currentRoute?.name}
        {#key $currentRoute}
            <title>{$currentRoute.name}</title>
        {/key}
    {/if}
</svelte:head>

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
                        <h1 class="leading-none italic font-black">{$currentRoute?.name}</h1>
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
        <main in:fly={{ y: 50, duration: 150, delay: 150 }}
              out:fly={{ y:-50, duration: 150 }}
              class="flex-1 overflow-scroll px-4">
            <slot/>
        </main>
        <nav class="flex gap-2 h-20 bg-surface dark:bg-surfaceDark relative after:absolute after:inset-0 after:content-[' '] after:bg-surfaceVariant dark:after:bg-surfaceVariantDark">
            {#each routes as route, i}
                <button on:click={() => {if (route.route !== url.pathname) goto(route.route)}} on:hover|once={() => {if (route.route !== url.pathname) prefetch(route.route)}} class={`overflow-hidden transition-opacity block z-10 cursor-pointer text-onSurfaceVariant dark:text-onSurfaceVariantDark flex flex-col items-center justify-center gap-1 w-full pt-3 pb-4 relative after:absolute after:inset-0 after:bg-surfaceVariant after:dark:bg-surfaceVariantDark after:opacity-0 after:hover:opacity-[8%] after:focus-visible:opacity-[12%] after:active:opacity-[12%] focus:outline-0 focus:outline-none focus:border-0 ${url.pathname === route.route && "after:bg-surface after:dark:bg-surfaceDark"}`}>
                    <div class={`p-1 bg-opacity-0 transition-all rounded-[1rem] ${(url.pathname.substring(0, url.pathname.indexOf("/", 2)) === route.route || url.pathname === route.route) && "bg-secondaryContainer dark:bg-secondaryContainerDark text-onSecondaryContainer dark:text-onSecondaryContainerDark px-5 bg-opacity-100"}`}>
                        <i class="w-6 h-6 relative">
                            <svelte:component this={route.icon} size="24"/>
                        </i></div>
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

<style>
    nav:after {
        --tw-bg-opacity: 10%;
    }
</style>