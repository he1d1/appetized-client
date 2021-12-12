<script>
	import { fab, user } from '../stores';
	import { onMount } from 'svelte';

	onMount(() => {
		fab.set(() => {
			alert('Hello');
		});
	});
</script>

sanotheuaontu
{$user.name}
