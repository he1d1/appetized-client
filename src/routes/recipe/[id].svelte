<script context="module">
    export async function load({fetch, params}) {
        const res = await fetch(`http://localhost:4000`,
            {
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
            }
        );
        const json = await res.json();

        if (json?.errors) {
            return {
                status: 500,
                error: json.errors[0].message
            }
        }
        if (json.data.recipe?.code) {
            return {
                error: json.data.recipe.message,
                status: json.data.recipe.code
            }
        }
        return {props: {recipe: json.data?.recipe}};
    }
</script>

<script>
    import {page} from "$app/stores";
    import {onMount} from "svelte";
    import {currentRoute} from "../../store";
    import User from "$lib/User.svelte";
    import Card from "$lib/Card.svelte";

    export let recipe;

    onMount(() => {
        currentRoute.set({
            route: $page.url.pathname,
            name: recipe?.name,
            buttons: []
        });
    })

    $: console.log(recipe)
</script>

<article class="flex flex-col gap-4">
    {#if recipe?.image?.url}
        <img class="rounded-lg my-2 max-h-[50vh] object-cover" src={recipe.image.url} alt={recipe.name}/>
    {/if}

    <User user={recipe?.author}/>

    {#if recipe?.description}
        <p>
            {recipe.description}
        </p>
    {/if}

    <h2>Ingredients</h2>

    <ul>
    {#each recipe?.ingredients as ingredient}
        <li class="flex items-center before:content-['•'] ml-2 before:-ml-2 before:mr-2">
            {ingredient.quantity} of {ingredient.name}
        </li>
    {/each}
    </ul>

    <h2>Steps</h2>

    {#each recipe?.steps as step, i}
            <Card neutral>
                <h3>{i+1}. {step?.name}</h3>
                <p>{step.content}</p>
            </Card>
    {/each}
</article>
