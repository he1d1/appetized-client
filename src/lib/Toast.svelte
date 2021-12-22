<script>
	import Button from '$lib/Button.svelte';

	export let duration = 3000;
	export let error = false;
	export let primary = false;
</script>

<div class="container" class:error class:primary>
	<div class="toast" class:error class:primary>
		<span>
			<slot name="text" />
		</span>
		<Button text>
			<slot name="button" />
		</Button>
	</div>
</div>

<style>
	.container {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		z-index: 9999;
	}
	.toast {
		gap: 1rem;
		padding: 0.5rem 1rem 0.5rem 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface-variant);
		border-radius: 1rem;
		color: var(--on-surface-variant);
	}
	span {
		flex: 1 1 0;
	}
	.toast.error {
		background: var(--error-container);
		color: var(--on-error-container);
	}
</style>
