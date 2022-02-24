<script context="module">
    export async function load({session, fetch}) {
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
                      recipes(
                        where: {
                          author: {
                            followers: {
                              every: { id: { equals: $id } }
                            }
                          }
                        }
                        sort: {
                          createdAt: DESC
                        }
                      ) {
                        id
                        name
                        description
                        author {
                          id
                          name
                          username
                          profilePicture {
                            url
                          }
                        }
                      }
                    }
			`,
                variables: {
                    id: session.user.id
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
                recipes: response.data.recipes
            }
        }
    }
</script>

<script>
    import {onMount} from "svelte";
    import { currentRoute } from "../store"
    import Card from "$lib/Card.svelte";

    export let user, recipes;

    onMount(() => {
        $currentRoute = {
            name: 'Home',
            route: '/',
            buttons: []
        }
    })

</script>

{#if recipes?.length}
    <div class="flex flex-col gap-4">
        {#each recipes as recipe}
            <a sveltekit:prefetch href={`/recipe/${recipe.id}`}>
                <Card neutral>
                    <h2>{recipe.name}</h2>
                    {#if recipe?.description}<p>{recipe.description}</p>{/if}
                    <a href={`/@${recipe.author.id}`} class="text-primary dark:text-primaryDark">{recipe.author.name ?? "@" + recipe.author.username}</a>
                </Card>
            </a>
        {/each}
    </div>
{/if}

<style>
    a {
        --tw-bg-opacity: 0.05;
    }
</style>