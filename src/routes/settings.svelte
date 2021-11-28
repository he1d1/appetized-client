<script>
	import Card from '../components/Card.svelte';
	import { settings, prefersDark } from '../stores';
</script>

<Card elevated>
	<div id="theme">
		<h3>Theme</h3>
		<hr />
		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={null} />
			System Default ({$prefersDark ? 'Dark' : 'Light'})
		</label>

		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={true} />
			Dark Mode
		</label>

		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={false} />
			Light Mode
		</label>
	</div>
</Card>

<style>
	#theme {
		color: var(--on-surface);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
</style>
