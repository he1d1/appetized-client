<script context="module">
	export async function load({ session }) {
		if (!session?.user) {
			return {
				error: 'You are not logged in. Sign in below to post recipes.',
				status: 401
			};
		}
		return {
			status: 200,
			props: {
				user: session.user
			}
		};
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { currentRoute } from '../store';
	import Card from '$lib/Card.svelte';
	import Input from '$lib/Input.svelte';
	import Button from '$lib/Button.svelte';
	import TextArea from '$lib/TextArea.svelte';
	import Next from 'svelte-material-icons/ArrowRight.svelte';
	import Back from 'svelte-material-icons/ArrowLeft.svelte';
	import Party from 'svelte-material-icons/PartyPopper.svelte';
	import { goto } from '$app/navigation';
	import Image from '$lib/Image.svelte';

	onMount(() => {
		$currentRoute = {
			name: 'Create',
			buttons: [],
			route: '/create'
		};

		reader = new FileReader();
	});

	export let user;
	let name, description, base64, reader, category, cuisine;

	let step = 0;

	async function createRecipe() {
		return await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				query: `
                    mutation CreateRecipe ($name: String! $description: String $cuisine: String $category: String $image: ImageInput) {
                      createRecipe(
                        recipe: {
                          name: $name
                          description: $description
                          cuisine: $cuisine
                          category: $category
                        },
                        image: $image
                      ) {
                        ... on Recipe {
                          name
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
					name,
					description,
					cuisine,
					category,
					image: base64 ? { base64 } : undefined
				}
			})
		})
			.then((res) => res.json())
			.then((res) => goto(`recipe/${res.data.createRecipe.id}`));
	}

	let imageValue;
</script>

<Card neutral>
	<div class="flex flex-col gap-4">
		<div class="flex items-center">
			<h1 class="flex-1">
				<!--Title and description-->
				{#if step === 0}Whats Cooking?{/if}
				<!--Category and cuisine-->
				{#if step === 1}When and Where?{/if}
				<!--Image-->
				{#if step === 2}Upload an image!{/if}
			</h1>
			{#if step !== 3}<p>Step <sup>{step + 1}</sup>/<sub>3</sub></p>{/if}
		</div>
		{#if step === 0}
			<Input
				required
				id="name"
				label="Recipe Name"
				type="text"
				bind:value={name}
				placeholder="My New Recipe"
			/>
			<TextArea
				id="description"
				label="Description"
				bind:value={description}
				placeholder="Describe your recipe..."
			/>
		{:else if step === 1}
			<Input
				id="category"
				label="Category"
				type="text"
				bind:value={category}
				placeholder="Breakfast, Dessert..."
			/>
			<Input
				id="cuisine"
				label="Cuisine"
				type="text"
				bind:value={cuisine}
				placeholder="Italian, Mexican..."
			/>
		{:else if step === 2}
			<Image bind:base64 bind:imageValue />
		{:else}
			<div class="flex flex-col items-center justify-center gap-2">
				<Party size="32" />
				<p class="text-center">Recipe Created!</p>
			</div>
		{/if}
		<div class="flex gap-2 justify-end">
			{#if step !== 3}
				{#if step > 0}
					<Button secondary on:click={() => step--}>
						<span class="leading-none flex items-center justify-center gap-1"
							>Back <Back size="16" /></span
						>
					</Button>
				{/if}
				{#if step !== 2}
					<Button primary on:click={() => step++} disabled={!name}>
						<span class="leading-none flex items-center justify-center gap-1"
							>Next <Next size="16" /></span
						>
					</Button>
				{:else}
					<Button
						primary
						on:click={() => {
							step++;
							createRecipe();
						}}
					>
						<span class="leading-none flex items-center justify-center gap-1">Submit</span>
					</Button>
				{/if}
			{/if}
		</div>
	</div>
</Card>
