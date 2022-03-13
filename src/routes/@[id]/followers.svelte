<script context="module">
    export async function load({session, fetch, params}) {
        if (!session?.user) {
            return {
                status: 401,
                error: "Login to access great features like the feed!"
            }
        }

        const response = await fetch('http://localhost:4000', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query Feed($id: String) {
                      users(
                       where: {
                            following: {
                              some: {
                                id: { equals: $id }
                              }
                            }
                          }
                        sort: {
                          createdAt: DESC
                        }
                      ) {
                        id
                        name
                        username
                      profilePicture {
                        url
                      }
                      }
                    }
			`,
                variables: {
                    id: params.id === "me" ? session.user.id : params.id
                }
            })
        }).then((response) => response.json());

        if (response.errors) {
            return {
                error: response.errors[0].message,
                status: response.status
            };
        }


        return {
            props: {
                user: session.user,
                users: response.data.users
            }
        }
    }
</script>

<script>
    import {onMount} from "svelte";
    import { currentRoute } from "../../store"
    import Card from "$lib/Card.svelte";
    import {prefetch} from "$app/navigation";

    export let user, users;

    onMount(() => {
        $currentRoute = {
            name: 'Followers',
            route: '/@[id]/followers',
            buttons: $currentRoute?.buttons
        }
    })

</script>

{#if users?.length}
    <div class="flex flex-col gap-4 divide-y-[1px] divide-outline dark:divide-outlineDark">
        {#each users as user}
        <a on:mouseenter|once={() => prefetch(`/@${user.id}}`)} href={`/@${user.id}`}>
                    <h2>{user.name ?? "@" + user.username}</h2>
            </a>
        {/each}
    </div>
{/if}

<style>
    a {
        --tw-bg-opacity: 0.05;
    }
</style>