<script context="module">
	export async function load({ session, fetch }) {
		if (!session?.user) {
			return {
				status: 401,
				error: 'Login to access great features like the feed!'
			};
		}

		const response = await fetch('http://localhost:4000', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `
                    query Feed($id: String) {
                      recipes(
                        take: 10
                        where: {
                      author: {
                          followers: {
                            some: {
                              id: {equals: $id}
                            }
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
                        createdAt
                        cuisine
                        category
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
		};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { currentRoute } from '../store';
	import Card from '$lib/Card.svelte';

	export let user, recipes;

	let observer;
	onMount(() => {
		$currentRoute = {
			name: 'Home',
			route: '/',
			buttons: []
		};

		let loading = false;

		observer = new IntersectionObserver(async (entries) => {
			if (entries[0].isIntersecting) {
				observer.unobserve(elements[elements.length - 3]);
				await fetch('http://localhost:4000', {
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query: `
                            query Feed($id: String $from: ID) {
                              recipes(
                                take: 1
                                from: $from
                                skip: 1
                                where: {
                                author: {
                          followers: {
                            some: {
                              id: {equals: $id}
                            }
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
                        createdAt
                        cuisine
                        category
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
							id: user.id,
							from: recipes[recipes.length - 1].id
						}
					})
				})
					.then((response) => response.json())
					.then((response) => {
						if (response.errors) {
							return {
								error: response.errors[0].message,
								status: response.status
							};
						}

						if (response.data.recipes.length > 0) {
							recipes.push(response.data.recipes[0]);
							recipes = recipes;
						}
					});
			}
		});
	});

	let elements = [];

	$: if (elements.length > 2) observer?.observe(elements[elements.length - 3]);
</script>

{#if recipes?.length}
	<div class="flex flex-col gap-4">
		{#each recipes as recipe, i}
			<a class="recipe" sveltekit:prefetch href={`/recipe/${recipe.id}`} bind:this={elements[i]}>
				<Card neutral>
					<h2>{recipe.name}</h2>
					{#if recipe?.description}<p>{recipe.description}</p>{/if}
					<small
						>{new Date(parseInt(recipe.createdAt)).toLocaleDateString()}
						&middot; {recipe?.category ?? ''}
						{#if recipe?.category && recipe?.cuisine}&middot;{/if}{recipe?.cuisine ?? ''}</small
					>
					<br />
					<a href={`/@${recipe.author.id}`} class="text-primary dark:text-primaryDark"
						>by {recipe.author.name ?? '@' + recipe.author.username}</a
					>
				</Card>
			</a>
		{/each}
		<div class="my-4">
			<h1 class="text-center">That's all</h1>
			<p class="text-center">Follow more people to see more recipes.</p>
		</div>
	</div>
{:else}
	<h1 class="text-center">Nothing to see here</h1>
	<p class="text-center">Start following people to have them show up in the feed.</p>
{/if}

<style>
	a {
		--tw-bg-opacity: 0.05;
		text-overflow: ellipsis;
	}
</style>
