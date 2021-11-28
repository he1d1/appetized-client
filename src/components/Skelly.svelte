<script>
	import { dark } from '../stores';
</script>

<div class:dark={$dark} />

<style>
	div {
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			to left,
			var(--on-surface),
			var(--on-surface-variant) 12.5%,
			var(--on-surface) 25%,
			var(--on-surface) 50%
		);
		background-size: 200% 200%;
		animation: skelly 1s linear infinite;
	}

	div.dark {
		background: repeating-linear-gradient(
			to left,
			var(--surface),
			var(--surface-variant) 12.5%,
			var(--surface) 25%,
			var(--surface) 50%
		);
		background-size: 200% 200%;
		animation: skelly 1s linear infinite;
	}

	@keyframes skelly {
		0%,
		100% {
			background-position: 100%;
		}
		100% {
			background-position: 0;
		}
	}
</style>
