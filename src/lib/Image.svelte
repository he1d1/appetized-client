<svelte:options accessors={true} />

<script>
	import Input from '$lib/Input.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	export let imageValue, base64;
	let reader;

	onMount(() => {
		reader = new FileReader();
	});

	const dispatch = createEventDispatcher();
</script>

<div
	class="w-full aspect-square bg-background dark:bg-backgroundDark border-[1px] border-outline dark:border-outlineDark overflow-hidden text-onBackground dark:text-onBackgroundDark flex items-center justify-center rounded-xl"
>
	{#if base64}<img
			alt="Preview"
			class="object-cover w-full h-full"
			src={base64}
		/>{:else}Preview{/if}
</div>
<a
	class="ml-auto"
	on:click={() => {
		imageValue = null;
		base64 = null;
	}}>Remove</a
>
<Input
	id="image"
	label="Image"
	type="file"
	placeholder="Upload an image..."
	accept=".png, .jpg, .jpeg"
	bind:value={imageValue}
	on:change={(e) => {
		let image = e.target.files[0];
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			base64 = e.target.result;
			dispatch('change', { base64: e.target.result });
		};
	}}
/>
