<script context="module">
    export async function load({fetch, params}) {
        const res = await fetch(`http://localhost:4000`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                query: `
                        query ($id: ID!) {
                            recipe(id: $id) {
                                ... on Recipe {
                                    id
                                    name
                                    description
                                    createdAt
                                    category
                                    cuisine
                                    image {
                                        url
                                    }
                                    author {
                                        id
                                        name
                                        username
                                        profilePicture {
                                            url
                                        }
                                    }
                                    ingredients {
                                        id
                                        name
                                        quantity
                                    }
                                    steps {
                                        name
                                        content
                                        image {
                                            url
                                        }
                                    }
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
        });
        const json = await res.json();

        if (json?.errors) {
            return {
                status: 500,
                error: json.errors[0].message
            };
        }
        if (json.data.recipe?.code) {
            return {
                error: json.data.recipe.message,
                status: json.data.recipe.code
            };
        }

        // add "changed" property to each ingredient
        json.data.recipe.ingredients.forEach(ingredient => {
            ingredient.changed = false;
        });

        return {props: {recipe: json.data?.recipe}};
    }
</script>

<script>
    import {page, session} from '$app/stores';
    import {onMount} from 'svelte';
    import {currentRoute} from '../../../store';
    import User from '$lib/User.svelte';
    import Card from '$lib/Card.svelte';
    import Saved from 'svelte-material-icons/Bookmark.svelte';
    import Pencil from 'svelte-material-icons/Pencil.svelte';
    import Delete from 'svelte-material-icons/Delete.svelte';
    import {goto} from '$app/navigation';
    import IconButton from "$lib/IconButton.svelte";
    import Input from "$lib/Input.svelte";

    export let recipe;

    onMount(() => {
        $currentRoute = {
            route: $page.url.pathname,
            name: recipe?.name,
            buttons: [
                {
                    component: Delete,
                    click: async () => {
                        await fetch("http://localhost:4000", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                query: `
                                    mutation deleteRecipe($id: ID!) {
                                        deleteRecipe(id: $id)
                                    }
                                `,
                                variables: {
                                    id: recipe.id
                                }
                            })
                        })
                    },
                }
            ]
        };
    });

    $: console.log(recipe);
</script>

<article class="flex flex-col gap-4">
    {#if recipe?.image?.url}
        <img
                class="rounded-lg my-2 max-h-[50vh] object-cover"
                src={recipe.image.url}
                alt={recipe.name}
        />
    {/if}

    {#if recipe?.description}
        <p>
            {recipe.description}
        </p>
    {/if}

    <h2>Ingredients</h2>

    {#if !recipe?.ingredients?.length}
        <p>No ingredients</p>
    {:else}
        <ul>
            {#each recipe?.ingredients.map(ingredient => {const temp = ingredient
            temp.changed = false;
            return temp
            }) as ingredient}
                <li class="flex items-end gap-2">
                    <Input id={ingredient.id + " quantity"} bind:value={ingredient.quantity} placeholder="500g" label="Quantity"/>
                    <div class="mt-auto mb-2">
                        {#if isNaN(parseInt(ingredient.quantity, 10))}of{/if}
                    </div>
                    <Input id={ingredient.id + " name"} bind:value={ingredient.name} placeholder="Flour" label="Name"  on:change={() => ingredient.changed = true}/>
                    <div class="my-1">
                        {#if !ingredient.changed}
                        <IconButton on:click={() => console.log("Delete")}>
                            <Delete size="24"/>
                        </IconButton>
                            {:else}
                        <IconButton on:click={() => console.log("Save")}>
                            <Saved size="24"/>
                        </IconButton>
                        {/if}
                    </div>
                </li>
            {/each}
        </ul>
    {/if}

    <h2>Steps</h2>

    {#if !recipe?.steps?.length}
        <p>No steps</p>
    {:else}
        {#each recipe?.steps as step, i}
            <Card neutral>
                <h3>{i + 1}. {step?.name}</h3>
                <p>{step.content}</p>
            </Card>
        {/each}
    {/if}
</article>
