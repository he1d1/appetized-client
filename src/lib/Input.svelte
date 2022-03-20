<script>
	import { createEventDispatcher, onMount } from 'svelte';

	export let id,
		label,
		type,
		value,
		placeholder,
		accept = undefined,
		required = false;

	let element,
		firstUpdate = true;

	const dispatch = createEventDispatcher();
	$: change(value);

	function change(value) {
		if (firstUpdate) {
			firstUpdate = false;
			return;
		}
		dispatch('change', { value, target: element });
	}
	onMount(() => {
		element.setAttribute('type', type);
	});
</script>

<label for={id} class="flex flex-col gap-2 items-start w-full">
	<span
		>{label}
		{#if required}<span class="text-error dark:text-errorDark">*</span>{/if}</span
	>
	<div
		class="bg-surface dark:bg-surfaceDark w-full rounded-lg border-[1px] border-outline dark:border-outlineDark"
	>
		<slot name="before" />
		<input
			class="w-full focus:outline-none bg-transparent p-2 px-3"
			{id}
			{placeholder}
			bind:value
			{accept}
			bind:this={element}
			on:blur
		/>
		<slot name="after" />
	</div>
</label>
