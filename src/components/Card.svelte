<script>
	export let elevated;
	export let filled;
	export let outlined;
</script>

<div class:elevated class:filled class:outlined>
	<slot />
</div>

<style>
	div {
		border-radius: 12px;
		padding: 16px;
		overflow: hidden;
		position: relative;
		transition: opacity 150ms ease-in-out;
	}

	div::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		transition: opacity 150ms ease-in-out;
		opacity: 0;
	}

	.elevated {
		background: var(--surface);
		box-shadow: var(--medium-shadow);
		color: var(--on-surface);
	}
	.filled {
		background: var(--surface-variant);
		box-shadow: var(--small-shadow);
		color: var(--on-surface-variant);
	}
	.outlined {
		background: var(--surface);
		box-shadow: var(--small-shadow);
		outline: 1px solid var(--outline);
		outline-offset: -1px;
		color: var(--on-surface);
	}
</style>
