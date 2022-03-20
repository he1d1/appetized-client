<svelte:options accessors />

<script lang="ts">
	import Image from '$lib/Image.svelte';
	import Input from '$lib/Input.svelte';
	import TextArea from '$lib/TextArea.svelte';
	import { createEventDispatcher } from 'svelte';

	export let base64,
		imageValue,
		name,
		content,
		page = 1;

	const dispatch = createEventDispatcher();
	$: dispatch('change', { base64, name, content, page });
</script>

<p class="-mt-4 ml-auto">Step <sup>{page}</sup>/<sub>2</sub></p>

{#if page === 1}
	<Input id="newName" label="Name" placeholder="Preheat Oven" type="text" bind:value={name} />

	<TextArea
		id="newContent"
		label="Content"
		placeholder="Preheat the oven to 350 degrees."
		type="text"
		bind:value={content}
	/>
{:else}
	<Image bind:base64 bind:imageValue />
{/if}
