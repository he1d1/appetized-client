<script context="module">
	export async function load({ fetch, params }) {
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
                                        name
                                        quantity
                                    }
                                    steps {
										position
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

		json.data?.recipe?.steps.sort((a, b) => a.position - b.position);

		return { props: { recipe: json.data?.recipe } };
	}
</script>

<script>
	import { page, session } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentRoute } from '../../../store';
	import User from '$lib/User.svelte';
	import Card from '$lib/Card.svelte';
	import Saved from 'svelte-material-icons/Bookmark.svelte';
	import NotSaved from 'svelte-material-icons/BookmarkOutline.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import { goto } from '$app/navigation';

	export let recipe;

	async function saveRecipe() {
		const res = await fetch(`http://localhost:4000`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
                    mutation ($id: ID!) {
                        saveRecipe(id: $id) {
                            ... on Recipe {
                                id
                            }
                            ... on Error {
                                code
                                message
                            }
                        }
                    }
                `,
				variables: {
					id: recipe.id
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

		$currentRoute.buttons[0].component = Saved;
		$currentRoute.buttons[0].click = unsaveRecipe;

		$session?.user?.savedRecipes?.push(recipe.id);
		$session.user.savedRecipes = $session?.user?.savedRecipes
	}

	async function unsaveRecipe() {
		const res = await fetch(`http://localhost:4000`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
                    mutation ($id: ID!) {
                        unsaveRecipe(id: $id) {
                            ... on Recipe {
                                id
                            }
                            ... on Error {
                                code
                                message
                            }
                        }
                    }
                `,
				variables: {
					id: recipe.id
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

		// @ts-ignore
		$currentRoute.buttons[0].component = NotSaved;
		$currentRoute.buttons[0].click = saveRecipe;

		$session?.user?.savedRecipes?.filter(id => id !== recipe.id);
		$session.user.savedRecipes = $session?.user?.savedRecipes;
	}

	onMount(() => {
		$currentRoute = {
			route: $page.url.pathname,
			name: recipe?.name,
			buttons: [
				// @ts-ignore
				$session?.user?.savedRecipes?.map((recipe) => recipe.id).includes(recipe.id)
					? {
							component: Saved,
							click: () => unsaveRecipe()
					  }
					: {
							component: NotSaved,
							click: () => saveRecipe()
					  }
			]
		};
		if ($session?.user.id === recipe?.author?.id) {
			$currentRoute.buttons.push({
				// @ts-ignore
				component: Pencil,
				click: () => goto(`/recipe/${recipe.id}/edit`)
			});
		}
		console.log($currentRoute);
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

	<User user={recipe?.author} />

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
			{#each recipe?.ingredients as ingredient}
				<li class="flex items-center before:content-['•'] ml-2 before:-ml-2 before:mr-2">
					{ingredient.quantity}
					{#if isNaN(parseInt(ingredient.quantity))}of{/if}
					{ingredient.name}
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
				<h3>{i + 1}. {step?.name ?? ''}</h3>
				<p>{step.content}</p>
			</Card>
		{/each}
	{/if}
</article>
