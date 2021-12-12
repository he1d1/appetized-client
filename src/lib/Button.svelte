<script>
	import { dark } from '../stores';

	export let primary = false;
	export let secondary = false;
	export let tertiary = false;
	export let outlined = false;
	export let disabled = false;
	export let text = false;
	export let wide = undefined;
</script>

<button
	class:primary
	class:secondary
	class:tertiary
	class:outlined
	class:text
	class:disabled
	class:wide
	class:dark={$dark}
	on:click
	tabindex={disabled ? 1 : 0}
>
	<span>
		<slot />
	</span>
</button>

<style>
	button {
		border-radius: 4px;
		cursor: pointer;
		padding: 12px 20px;
		outline: none;
		width: fit-content;
		/* Text */
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.0031em;
		line-height: 20px;
		text-transform: uppercase;
		transition: background-color 100ms ease-in-out, box-shadow 100ms ease-in-out,
			border 100ms ease-in-out;
		border: 0;
		overflow: hidden;
		position: relative;
	}

	button::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		transition: opacity 100ms ease-in-out, border 100ms ease-in-out;
		opacity: 0;
	}

	.wide {
		width: 100%;
	}

	.primary {
		background: var(--surface);
		color: var(--primary);
		box-shadow: var(--small-shadow);
	}

	.primary.disabled {
		background: transparent;
		cursor: default;
	}

	.primary.disabled > span {
		color: var(--on-surface);
		opacity: 0.38;
	}

	.primary.disabled::after {
		background: var(--on-surface);
		opacity: 0.12;
	}

	.primary:hover {
		box-shadow: var(--medium-shadow);
	}

	.primary:hover:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.08;
	}

	.primary:focus-visible:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.12;
	}

	.primary:active {
		box-shadow: var(--small-shadow);
	}

	.primary:active:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.16;
	}

	.secondary {
		background: var(--primary);
		color: var(--on-primary);
		box-shadow: none;
	}

	.secondary.disabled {
		background: transparent;
		cursor: default;
	}

	.secondary.disabled > span {
		color: var(--on-surface);
		opacity: 0.38;
	}

	.secondary.disabled::after {
		background: var(--on-surface);
		opacity: 0.12;
	}

	.secondary:hover {
		box-shadow: var(--small-shadow);
	}

	.secondary:hover:not(.disabled)::after {
		background: var(--primary-container);
		opacity: 0.08;
	}

	.secondary:focus-visible:not(.disabled)::after {
		background: var(--primary-container);
		opacity: 0.12;
	}

	.secondary:active {
		box-shadow: none;
	}

	.secondary:active:not(.disabled)::after {
		background: var(--primary-container);
		opacity: 0.16;
	}

	.tertiary {
		background: var(--secondary-container);
		color: var(--on-secondary-container);
		box-shadow: none;
	}

	.tertiary.disabled {
		background: transparent;
		cursor: default;
	}

	.tertiary.disabled > span {
		color: var(--on-surface);
		opacity: 0.38;
	}

	.tertiary.disabled::after {
		background: var(--on-surface);
		opacity: 0.12;
	}

	.tertiary:hover {
		box-shadow: var(--small-shadow);
	}

	.tertiary:hover:not(.disabled)::after {
		background: var(--on-secondary-container);
		opacity: 0.08;
	}

	.tertiary:focus-visible:not(.disabled)::after {
		background: var(--on-secondary-container);
		opacity: 0.12;
	}

	.tertiary:active {
		box-shadow: none;
	}

	.tertiary:active:not(.disabled)::after {
		background: var(--on-secondary-container);
		opacity: 0.16;
	}

	.outlined {
		background: transparent;
		color: var(--primary);
		outline: 1px solid var(--outline);
		outline-offset: -1px;
		transition: border-color 100ms ease-in-out;
	}

	.outlined.disabled {
		background: transparent;
		cursor: pointer;
		outline: 1px solid transparent;
	}
	.outlined.disabled::after {
		opacity: 0.12;
		outline: 1px solid var(--on-surface);
		outline-offset: -1px;
		border-radius: 4px;
	}

	.outlined.disabled > span {
		color: var(--on-surface);
		opacity: 0.38;
	}

	.outlined:hover {
		box-shadow: var(--small-shadow);
	}

	.outlined:hover:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.08;
	}

	.outlined:focus-visible:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.12;
	}

	.outlined:active:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.16;
	}

	.text {
		background: transparent;
		color: var(--primary);
		box-shadow: none;
	}

	.text.disabled {
		color: var(--on-surface);
		opacity: 0.38;
	}

	.text:hover:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.08;
	}

	.text:focus-visible:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.12;
	}

	.text:active:not(.disabled)::after {
		background: var(--primary);
		opacity: 0.16;
	}

	.disabled,
	.disabled:hover,
	.disabled:active {
		box-shadow: none;
		cursor: default;
	}
</style>
