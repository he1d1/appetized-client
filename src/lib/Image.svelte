<svelte:options accessors={true} />

<script>
	import Input from '$lib/Input.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import Button from './Button.svelte';
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
<Button
	text
	on:click={() => {
		imageValue = null;
		base64 = null;
	}}>Remove</Button
>
<Input
	id="image"
	label="Image"
	type="file"
	placeholder="Upload an image..."
	accept=".png, .jpg, .jpeg"
	bind:value={imageValue}
	on:change={(e) => {
		let image = e?.detail?.target?.files?.[0];
		if (image) reader.readAsDataURL(image);
		reader.onload = () => {
			base64 = reader.result;
			dispatch('change', { base64 });
		};
	}}
/>
