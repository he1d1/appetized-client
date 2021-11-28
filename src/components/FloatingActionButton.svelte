<script>
	// eslint-disable no-undef
	// linter hates $$props

	export let label;

	import { dark } from '../stores';
</script>

<button class:dark={$dark} {...$$props} aria-label={label}>
	<slot />
</button>

<style>
	button {
		padding: 16px;
		z-index: 2;
		background: var(--primary-container);
		border-radius: 25%;
		border: 0;
		color: var(--on-primary-container);
		cursor: pointer;
		height: 56px;
		outline: none;
		transition: background-color 250ms ease-in-out, box-shadow 100ms ease-in-out;
		width: 56px;
		box-shadow: var(--medium-shadow);
		position: relative;
		overflow: hidden;
	}

	button::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		transition: opacity 100ms ease-in-out;
		opacity: 0;
	}

	button:hover {
		box-shadow: var(--large-shadow);
	}

	button:hover::after {
		background: var(--primary);
		opacity: 0.08;
	}

	button:focus-visible::after {
		background: var(--primary);
		opacity: 0.12;
	}

	button:active {
		box-shadow: var(--medium-shadow);
	}

	button:active::after {
		background: var(--primary);
		opacity: 0.16;
	}
</style>
