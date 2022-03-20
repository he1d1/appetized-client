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
                                        id
                                        name
                                        quantity
                                    }
                                    steps {
										position
										id
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

		// add "changed" property to each ingredient and step
		json.data.recipe.ingredients.forEach((ingredient) => {
			ingredient.changed = false;
		});

		// Sort steps by position
		json.data?.recipe?.steps.sort((a, b) => a.position - b.position);

		return { props: { recipe: json.data?.recipe } };
	}
</script>

<script>
	import { page, session } from '$app/stores';
	import { onMount } from 'svelte';
	import { bindComponent, currentRoute, modal } from '../../../store';
	import Image from '$lib/Image.svelte';
	import Card from '$lib/Card.svelte';
	import Save from 'svelte-material-icons/Floppy.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Delete from 'svelte-material-icons/Delete.svelte';
	import { goto } from '$app/navigation';
	import IconButton from '$lib/IconButton.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import Ingredient from 'svelte-material-icons/FoodApple.svelte';
	import Step from 'svelte-material-icons/FormatListNumbered.svelte';
	import Expand from 'svelte-material-icons/ChevronDown.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import { fly } from 'svelte/transition';
	import TextArea from '$lib/TextArea.svelte';
	import _Step from './_Step.svelte';
	import ArrowUp from 'svelte-material-icons/ArrowUp.svelte';
	import ArrowDown from 'svelte-material-icons/ArrowDown.svelte';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quadInOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	export let recipe;

	$: $bindComponent?.$on('change', (data) => {
		base64 = data.detail?.base64;
		name = data.detail?.name;
		content = data.detail?.content;
		stepPage = data.detail?.page;
	});

	let base64,
		name,
		content,
		stepPage = 1;

	$: if ($modal?.title.match(/Change \w+ Image/)) {
		// change button to disabled if base64 is false
		$modal.actions[1].disabled = !base64;
	}

	$: if ($modal?.title === 'Create Step') {
		// change button to disabled if content is false
		$modal.actions[1].disabled = !content && stepPage === 1;
	}

	onMount(() => {
		$currentRoute = {
			route: $page.url.pathname,
			name: recipe?.name,
			buttons: [
				{
					// @ts-ignore
					component: Delete,
					click: async () => {
						await fetch('http://localhost:4000', {
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
						});

						goto('/');
					}
				}
			]
		};
	});

	async function createIngredient() {
		ingredientsOpen = true;

		const res = await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
					mutation createIngredient($recipe: ID!, $name: String! $quantity: String!) {
						createIngredient(recipe: $recipe, ingredient: { name: $name, quantity: $quantity }) {
							... on Ingredient {
								id
								name
								quantity
							}
							... on Error {
								code
								message
							}
						}
					}
				`,
				variables: {
					recipe: recipe.id,
					name: '',
					quantity: ''
				}
			})
		});

		const json = await res.json();

		recipe.ingredients.push(json.data.createIngredient);
		recipe.ingredients = recipe.ingredients;
	}

	async function updateIngredient(ingredient) {
		await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
					mutation EditIngredient($id: ID!, $name: String!, $quantity: String!) {
						editIngredient(id: $id, ingredient: { name: $name, quantity: $quantity }) {
							... on Ingredient {
								id
								name
								quantity
							}
							... on Error {
								code
								message
							}
						}
					}
				`,
				variables: {
					id: ingredient.id,
					name: ingredient.name,
					quantity: ingredient.quantity
				}
			})
		});
	}

	async function deleteIngredient(ingredient) {
		await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
					mutation DeleteIngredient($id: ID!) {
						deleteIngredient(id: $id)
					}
				`,
				variables: {
					id: ingredient.id
				}
			})
		});

		recipe.ingredients = recipe.ingredients.filter((undeleted) => undeleted.id !== ingredient.id);
		recipe.ingredients = recipe.ingredients;
	}

	let menuOpen = false;
	let detailsOpen = false;
	let ingredientsOpen = false;
	let stepsOpen = false;

	async function editDetails() {
		await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
					mutation EditRecipe($id: ID!, $recipe: EditRecipeInput!) {
						editRecipe(
							id: $id
							recipe: $recipe
						) {
							... on Error {
							code
							message
							}
							... on Recipe {
							description
							}
						}
					}
                                `,
				variables: {
					id: recipe.id,
					recipe: {
						description: recipe.description,
						name: recipe.name,
						cuisine: recipe.cuisine,
						category: recipe.category
					}
				}
			})
		});

		$currentRoute.name = recipe.name;
	}

	async function recipeImageModal() {
		$modal = {
			closable: true,
			title: 'Change Recipe Image',
			content: 'Upload a new image for this recipe.',
			// @ts-ignore
			component: Image,
			actions: [
				{
					label: 'Cancel',
					buttonType: 'secondary',
					click: async () => {
						$modal = undefined;
					}
				},
				{
					label: 'Save',
					disabled: !!base64,
					buttonType: 'primary',
					click: async () => {
						await fetch('http://localhost:4000', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							credentials: 'include',
							body: JSON.stringify({
								query: `
										mutation EditRecipe($id: ID!, $base64: String!) {
											editRecipe(
												id: $id
												image: { base64: $base64 }
											) {
												... on Error {
													code
													message
												}
												... on Recipe {
													id
												}
											}
										}
                                    `,
								variables: {
									id: recipe.id,
									base64: base64
								}
							})
						}).then(async () => {
							$modal = undefined;
							recipe.image.url = base64;
						});
					}
				}
			]
		};
	}

	function stepImageModal(step) {
		$modal = {
			closable: true,
			title: 'Change Step Image',
			content: 'Upload a new image for this step.',
			// @ts-ignore
			component: Image,
			actions: [
				{
					buttonType: 'secondary',
					label: 'Cancel',
					click: async () => {
						$modal = undefined;
					}
				},
				{
					buttonType: 'primary',
					label: 'Save',
					disabled: !!base64,
					click: async () => {
						await fetch('http://localhost:4000', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							credentials: 'include',
							body: JSON.stringify({
								query: `
										mutation EditStep($id: ID!, $base64: String!) {
											editStep(
												id: $id
												image: { base64: $base64 }
											) {
												... on Error {
													code
													message
												}
												... on Step {
													id
												}
											}
										}
									`,
								variables: {
									id: step.id,
									base64: base64
								}
							})
						});
						$modal = undefined;

						step.image = { url: base64 };
					}
				}
			]
		};
	}

	async function createStep() {
		stepsOpen = true;
		stepPage = 1;

		$modal = {
			title: 'Create Step',
			content: '',
			// @ts-ignore
			component: _Step,
			closable: true,
			actions: [
				{
					label: 'Back',
					buttonType: 'secondary',
					click: async () => {
						$modal = undefined;
					}
				},
				{
					disabled: !content || stepPage === 2,
					label: stepPage === 1 ? 'Next' : 'Create',
					buttonType: 'primary',
					click: async () => {
						if (stepPage === 1) {
							$bindComponent.page = 2;
						} else {
							const res = await fetch('http://localhost:4000', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								credentials: 'include',
								body: JSON.stringify({
									query: `
									mutation createStep($recipe: ID!, $name: String, $content: String!, $image: ImageInput) {
										createStep(recipe: $recipe, step: { name: $name, content: $content }, image: $image) {
											... on Step {
												id
												name
												content
												position
												image {
													url
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
										recipe: recipe.id,
										name,
										content,
										image: base64
											? {
													base64
											  }
											: undefined
									}
								})
							});

							const json = await res.json();

							recipe.steps.push(json.data.createStep);
							recipe.steps = recipe.steps;

							$modal = undefined;
						}
					}
				}
			]
		};
	}

	async function deleteStep(step) {
		const res = await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
						mutation DeleteStep($id: ID!) {
							deleteStep(id: $id) 
						}
					`,
				variables: {
					id: step.id
				}
			})
		});

		recipe.steps = recipe.steps.filter((s) => s.id !== step.id);
	}

	async function moveStep(step, upOrDown) {
		const position = step.position + (upOrDown === 'up' ? -1 : 1);

		// Update the position of the step in the GUI
		if (upOrDown === 'up') {
			// cancel if can't move up (position 1)
			if (step.position === 1) {
				return;
			}

			// swap in array
			const temp = recipe.steps[step.position - 2];
			recipe.steps[step.position - 2] = step;
			recipe.steps[step.position - 1] = temp;

			recipe.steps.map((s, index) => {
				s.position = index + 1;
			});
		} else {
			// cancel if can't move down (position last)
			if (step.position === recipe.steps.length) {
				return;
			}

			// swap in array
			const temp = recipe.steps[step.position];
			recipe.steps[step.position] = recipe.steps[step.position - 1];
			recipe.steps[step.position - 1] = temp;

			recipe.steps.map((s, index) => {
				s.position = index + 1;
			});
		}

		// Update position server-side
		await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
						mutation EditStep($id: ID!, $position: Int!) {
							editStep(id: $id, position: $position) {
								... on Step {
									id
									position
								}
								... on Error {
									code
									message
								}
							}
						}
					`,
				variables: {
					id: step.id,
					position: position
				}
			})
		});
	}

	async function saveStep(step) {
		await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
					mutation EditStep($id: ID!, $name: String, $content: String!) {
						editStep(id: $id, step: { name: $name, content: $content }) {
							... on Step {
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
					id: step.id,
					name: step.name,
					content: step.content
				}
			})
		});
	}
</script>

<div
	class="absolute bottom-24 right-4 flex flex-col gap-4 items-center"
	on:blur={() => (menuOpen = false)}
>
	{#if menuOpen}
		<button
			transition:fly={{ y: 100, duration: 500 }}
			class="shadow-md z-30 p-2 w-10 rounded-xl bg-primary dark:bg-primaryDark text-onPrimary
			dark:text-onPrimaryDark"
			on:click={() => {
				if (!menuOpen) return;
				menuOpen = !menuOpen;
				createIngredient();
			}}
		>
			<Ingredient size="24" />
		</button>
		<button
			transition:fly={{ y: 75, duration: 375 }}
			class="shadow-md z-30 p-2 w-10 rounded-xl bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark"
			on:click={() => {
				if (!menuOpen) return;
				menuOpen = !menuOpen;
				createStep();
			}}
		>
			<Step size="24" />
		</button>
	{/if}
	<button
		on:click={() => (menuOpen = !menuOpen)}
		class="shadow-lg z-40 p-4 rounded-2xl bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark"
	>
		<div class="transition-transform duration-200" class:rotate-45={menuOpen}>
			<Plus size="24" />
		</div>
	</button>
</div>

<div class="flex flex-col gap-4">
	{#if recipe?.image?.url}
		<div class="relative">
			<div class="p-1">
				<img
					class="rounded-lg max-h-[50vh] object-cover"
					src={recipe.image.url}
					alt={recipe.name}
				/>
			</div>
			<div
				class="p-1 pt-0.5 bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark w-6 h-6 rounded-full absolute right-0 bottom-0"
			>
				<IconButton on:click={() => recipeImageModal()}>
					<Pencil />
				</IconButton>
			</div>
		</div>
	{:else}
		<Button primary on:click={() => recipeImageModal()}>Add Image</Button>
	{/if}

	<div
		class="w-full flex pb-1 border-b-[1px] border-outline dark:border-outlineDark"
		on:click={() => (detailsOpen = !detailsOpen)}
	>
		<h2 class="flex-1">Details</h2>
		<IconButton>
			<div class:-rotate-180={detailsOpen} class="transition-transform duration-200">
				<Expand size="24" />
			</div>
		</IconButton>
	</div>

	{#if detailsOpen}
		<div
			class="mb-4 flex flex-col gap-4"
			transition:fly={{
				duration: 500,
				y: -10
			}}
		>
			<Input
				type="text"
				bind:value={recipe.name}
				id="name"
				label="Name"
				placeholder="Steamed Hams"
				on:input={(e) => {
					// @ts-ignore
					recipe.name = e.target.value;
				}}
			/>

			<Input
				type="text"
				bind:value={recipe.cuisine}
				id="cuisine"
				label="Cuisine"
				placeholder="American"
				on:input={(e) => {
					// @ts-ignore
					recipe.cuisine = e.target.value;
				}}
			/>

			<Input
				type="text"
				bind:value={recipe.category}
				id="category"
				label="Category"
				placeholder="Main Course/ Breakfast"
				on:input={(e) => {
					// @ts-ignore
					recipe.category = e.target.value;
				}}
			/>

			<TextArea
				bind:value={recipe.description}
				type="text"
				id="description"
				label="Description"
				placeholder="Skinner discovers his roast has been burnt and decides to order fast food from Krusty Burger and pass it off as his own cooking."
			/>

			<Button primary on:click={() => editDetails()}>Save Details</Button>
		</div>
	{/if}

	<div
		class="w-full flex pb-1 border-b-[1px] border-outline dark:border-outlineDark"
		on:click={() => (ingredientsOpen = !ingredientsOpen)}
	>
		<h2 class="flex-1">Ingredients</h2>
		<IconButton>
			<div class:-rotate-180={ingredientsOpen} class="transition-transform duration-200">
				<Expand size="24" />
			</div>
		</IconButton>
	</div>

	{#if ingredientsOpen}
		<div
			class="mb-4"
			transition:fly={{
				duration: 500,
				y: -10
			}}
		>
			{#if !recipe?.ingredients?.length}
				<p>No ingredients</p>
			{:else}
				<ul>
					{#each recipe?.ingredients as ingredient}
						<li class="flex items-end gap-2 mb-4 last:mb-0">
							<Input
								id={ingredient.id + ' quantity'}
								bind:value={ingredient.quantity}
								placeholder="A pinch"
								label="Quantity"
								on:change={() => {
									ingredient.changed = true;
								}}
								type="text"
							/>
							<div class="mt-auto mb-2">
								{#if isNaN(parseInt(ingredient.quantity, 10))}of{/if}
							</div>
							<Input
								id={ingredient.id + ' name'}
								bind:value={ingredient.name}
								placeholder="Salt"
								label="Name"
								on:change={() => {
									ingredient.changed = true;
								}}
								type="text"
							/>
							<div class="mt-auto -mb-1">
								<IconButton on:click={() => deleteIngredient(ingredient)}>
									<Delete size="24" on:click={() => deleteIngredient(ingredient)} />
								</IconButton>
								{#if ingredient.changed}
									<div class="h-6">
										<IconButton
											on:click={() => {
												updateIngredient(ingredient);
												ingredient.changed = false;
											}}
										>
											<Save size="24" />
										</IconButton>
									</div>
								{:else}
									<div class="text-surfaceVariant dark:text-surfaceVariantDark">
										<Save size="24" />
									</div>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	<div
		class="w-full flex pb-1 border-b-[1px] border-outline dark:border-outlineDark"
		on:click={() => (stepsOpen = !stepsOpen)}
	>
		<h2 class="flex-1">Steps</h2>
		<IconButton>
			<div class:-rotate-180={stepsOpen} class="transition-transform duration-200">
				<Expand size="24" />
			</div>
		</IconButton>
	</div>

	{#if stepsOpen}
		<div
			class="mb-[4.75rem] flex flex-col gap-4"
			transition:fly={{
				duration: 500,
				y: -10
			}}
		>
			{#if !recipe?.steps?.length}
				<p>No steps</p>
			{:else}
				{#each recipe?.steps as step, i (step.id)}
					<div
						in:receive={{ key: step.id }}
						out:send={{ key: step.id }}
						animate:flip={{ duration: 200 }}
					>
						<Card neutral>
							<h3 class="pb-2">{step.position}. {step?.name ?? ''}</h3>
							{#if step?.image?.url}
								<div class="relative">
									<div>
										<img
											class="rounded-lg max-h-[50vh] object-cover"
											src={step.image.url}
											alt={step.content}
										/>
									</div>
									<div
										class="p-1 pt-0.5 bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark w-6 h-6 rounded-full absolute -right-1 -bottom-1"
									>
										<IconButton on:click={() => stepImageModal(step)}>
											<Pencil />
										</IconButton>
									</div>
								</div>
							{:else}
								<Button primary on:click={() => stepImageModal(step)}>Add Image</Button>
							{/if}

							<div class="flex mt-4 gap-4">
								<div class="flex flex-col flex-1 gap-4">
									<Input
										id={step.id + ' name'}
										bind:value={step.name}
										placeholder="Step Name"
										label="Name"
										on:change={() => {
											step.changed = true;
										}}
										type="text"
									/>
									<TextArea
										id={step.id + ' content'}
										bind:value={step.content}
										placeholder="Step 1"
										label="Content"
										on:change={() => {
											step.changed = true;
										}}
										type="text"
									/>
								</div>
								<div class="flex flex-col items-center justify-center gap-2">
									<IconButton on:click={() => deleteStep(step)}>
										<Delete size="24" />
									</IconButton>
									{#if step.position !== 1}
										<IconButton on:click={() => moveStep(step, 'up')}>
											<ArrowUp size="24" />
										</IconButton>
									{:else}
										<div class="text-surfaceVariant dark:text-surfaceVariantDark">
											<ArrowUp size="24" />
										</div>
									{/if}
									{#if step.position !== recipe?.steps?.length}
										<IconButton on:click={() => moveStep(step, 'down')}>
											<ArrowDown size="24" />
										</IconButton>
									{:else}
										<div class="text-surfaceVariant dark:text-surfaceVariantDark">
											<ArrowDown size="24" />
										</div>
									{/if}
									{#if step.changed}
										<IconButton
											on:click={() => {
												saveStep(step);
												step.changed = false;
											}}
										>
											<Save size="24" />
										</IconButton>
									{:else}
										<div class="text-surfaceVariant dark:text-surfaceVariantDark">
											<Save size="24" />
										</div>
									{/if}
								</div>
							</div>
						</Card>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
