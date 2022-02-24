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
        if (json.data.recipe?.code) {
            return {
                error: json.data.recipe.message,
                status: json.data.recipe.code
            }
        }
        return { props: { recipe: json.data?.recipe } };
    }
</script>

<script>
    import {page} from "$app/stores";
    import {onMount} from "svelte";
    import {currentRoute} from "../../store";

    export let recipe;

    onMount(() => {
        currentRoute.set({
            route: $page.url.pathname,
            name: recipe?.name,
            buttons: []
        });
    })
</script>

{$page.params.id}
{recipe?.name}