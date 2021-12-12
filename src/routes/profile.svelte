<script>
	import { onMount } from 'svelte';
	import { fab, user } from '../stores';
	import { goto } from '$app/navigation';

	let text = 'nstaoheutoet uiod';

	onMount(() => {
		fab.set(() => goto('/settings#profile'));
	});
</script>

{text}
