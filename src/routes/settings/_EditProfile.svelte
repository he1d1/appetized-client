<svelte:options accessors />

<script>
	import Input from '$lib/Input.svelte';
	import { createEventDispatcher } from 'svelte';
	export let name, username;

	const dispatch = createEventDispatcher();
	$: dispatch('change', {
		name,
		username
	});
</script>

<Input id="name" bind:value={name} label="Name" />
<Input id="username" bind:value={username} label="Username" />
