<script context="module">
    export async function load({session, params, fetch}) {
        let profile = null, errors = null;
        if (params.id !== 'me') {
            errors = await fetch('http://localhost:4000', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                            query Profile($id: ID!) {
                                user(id: $id) {
                                    ... on User {
                                        id
                                        name
                                        username
                                        profilePicture {
                                            id
                                            url
                                        }
                                        recipesCount
                                        followerCount
                                        followingCount
                                    }
                                    ... on Error {
                                        code
                                        message
                                    }
                                }
                            }
                        `,
                    variables: {
                        id: params.id
                    }
                })

            }).then(res => res.json()).then(res => {
                if (res?.errors) {
                    return {
                        status: 500,
                        error: res.errors[0].message
                    }
                }
                if (res.data.user?.message) {
                    return {
                        status: res.data.user.code,
                        error: res.data.user.message
                    }
                }
                profile = res.data.user
            })

        }

        if (errors) {
            return {
                status: errors.status,
                error: errors.error
            }
        }

        return {
            props: {
                user: session.user,
                profile: profile ?? session.user,
            },
            stuff: {
                profile: profile ?? session.user,
            }
        }
    }
</script>

<script lang="ts">
    import {page} from '$app/stores'
    import Card from "$lib/Card.svelte";
    import {onMount} from "svelte";
    import {currentRoute} from "../../store";

    export let user, profile, promise
    console.log(profile)
    </script>

<section class="mt-24">
    {#if profile}
        <Card neutral>
            <div class="flex flex-col items-center mb-4">
                <img
                        src={profile?.profilePicture?.url ?? "https://images.unsplash.com/photo-1622348512579-73da9531493a"}
                        alt="Profile picture"
                        class="rounded-full w-32 h-32 mx-auto object-cover -translate-y-2/3 absolute"/>
                <h1 class="mt-16">{profile.name ?? "@" + profile.username}</h1>
                {#if profile.name}<h2>@{profile.username}</h2>{/if}
            </div>
            <div class="inline-flex select-none cursor-pointer gap-1 w-full bg overflow-x-scroll">
                <a href={`/@${$page.params.id}`}
                   class="tab"
                   sveltekit:prefetch
                   class:selected={$page.url.pathname === `/@${$page.params.id}`}
                   on:click={(event) => event.target.scrollIntoView({behavior: "smooth", inline: "nearest"})}
                >
                    Recipes&nbsp;({profile.recipesCount})
                </a>
                <a href={`/@${$page.params.id}/followers`}
                   class="tab"
                   sveltekit:prefetch
                   class:selected={$page.url.pathname.endsWith('/followers')}
                   on:click={(event) => event.target.scrollIntoView({behavior: "smooth", inline: "nearest"})}
                >
                    Followers&nbsp;({profile.followerCount})
                </a>
                <a href="{`/@${$page.params.id}/following`}"
                   class="tab"
                   sveltekit:prefetch
                   class:selected={$page.url.pathname.endsWith('/following')}
                   on:click={(event) => event.target.scrollIntoView({behavior: "smooth", inline: "nearest"})}
                >
                    Following&nbsp;({profile.followingCount})
                </a>
                <a href="{`/@${$page.params.id}/saved`}"
                   class="tab"
                   sveltekit:prefetch
                   class:selected={$page.url.pathname.endsWith('/saved')}
                   on:click={(event) => event.target.scrollIntoView({behavior: "smooth", inline: "nearest"})}
                >
                    Saved
                </a>
            </div>
        </Card>
    {/if}
</section>

<section>
    <slot/>
</section>

<style lang="postcss">
    .tab {
        @apply w-full text-center px-6 py-3 transition-colors duration-200 ease-in-out rounded-md relative z-10;
        @apply before:absolute before:inset-0 before:bg-transparent before:transition-colors before:opacity-25 before:z-0 before:rounded-md;
    }

    .tab:hover {
        @apply before:bg-surface dark:before:bg-surfaceDark;
    }

    .tab:focus-visible {
        @apply before:bg-surfaceVariant dark:before:bg-surfaceVariantDark;
        @apply outline-none focus:outline-none;
    }

    .tab.selected {
        @apply bg-secondaryContainer dark:bg-secondaryContainerDark text-onSecondaryContainer dark:text-onSecondaryContainerDark;
    }
</style>