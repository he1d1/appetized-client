<script lang="ts">
	import { onMount } from 'svelte';
	import { dark, settings, Settings, prefersDark } from '../stores';
	import Menu from 'svelte-material-icons/Menu.svelte';
	import Home from 'svelte-material-icons/Home.svelte';
	import Search from 'svelte-material-icons/Magnify.svelte';
	import Profile from 'svelte-material-icons/AccountCircle.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Cog from 'svelte-material-icons/Settings.svelte';
	import FloatingActionButton from '../components/FloatingActionButton.svelte';
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	let settingsStore = null;

	const hamburger = false;
	const myProfile = true;

	const pages = [
		{ route: '/', icon: Home, label: 'Home', fab: Search, auth: null },
		{
			route: '/profile',
			icon: Profile,
			label: 'Profile',
			fab: myProfile ? Pencil : null,
			auth: true
		},
		{
			route: '/settings',
			icon: Cog,
			label: 'Settings',
			fab: null,
			auth: true
		}
	];

	$: currentPage = pages[pages.map((p) => p.route).indexOf($page.path)];

	onMount(() => {
		const storage = JSON.parse(localStorage.getItem('settings') ?? '{}') as Settings;
		settings.set(storage);
		console.log('local storage', JSON.parse(localStorage.getItem('settings') ?? '{}') as Settings);

		settings.subscribe((value) => {
			settingsStore = value;
			$dark =
				settingsStore.dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
			localStorage.setItem('settings', JSON.stringify(settingsStore));
			console.log(
				'local storage',
				JSON.parse(localStorage.getItem('settings') ?? '{}') as Settings
			);
		});

		prefersDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
		console.log('prefers dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			prefersDark.set(e.matches);
			$dark = settingsStore.dark ?? e.matches ?? false;
		});
		console.log(
			settingsStore.dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches ?? false
		);
	});
</script>

<main class:dark={$dark}>
	<div class="navigation-rail">
		<div class="hamburger-container" class:hamburger-active={hamburger}>
			{#if hamburger}
				<button class="icon burger">
					<Menu size="24" />
				</button>
			{/if}
		</div>
		<div class="fab-container" class:fab-active={currentPage?.fab}>
			{#if currentPage?.fab}
				<div in:fly={{ x: -50, duration: 100 }} out:fly={{ x: -50, duration: 10 }}>
					{#key currentPage?.fab}
						<FloatingActionButton class="fab" label={currentPage?.label}>
							<div in:fade>
								<svelte:component this={currentPage?.fab} size="24" />
							</div>
						</FloatingActionButton>
					{/key}
				</div>
			{/if}
		</div>
		<div class="nav-container">
			<nav>
				{#each pages.filter((page) => page.icon) as page}
					<button
						class="nav-item"
						on:hover={() => prefetch(page.route)}
						on:click={() => goto(page.route)}
					>
						<span class="nav icon" class:active={currentPage?.route === page.route}>
							<svelte:component this={page.icon} size="24" /></span
						>
						<small>{page.label}</small>
					</button>
				{/each}
			</nav>
		</div>
	</div>
	{#key currentPage?.route}
		<div class="container" in:fade={{ delay: 100 }}>
			<slot />
		</div>
	{/key}
</main>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');

		@media (prefers-reduced-motion: reduce) {
			* {
				animation-delay: 0ms !important;
				animation-duration: 1ms !important;
			}
		}

		main {
			/* Light Primary */
			--primary: #0055d6;
			--on-primary: #fff;
			--primary-container: #d9e2ff;
			--on-primary-container: #00184a;

			/* Light Secondary */
			--secondary: #9a3783;
			--on-secondary: #fff;
			--secondary-container: #ffd7f0;
			--on-secondary-container: #3a0031;

			/* Light Tertiary */
			--tertiary: #924c00;
			--on-tertiary: #fff;
			--tertiary-container: #ffdcc1;
			--on-tertiary-container: #2f1400;

			/* Light Error */
			--error: #ba1b1b;
			--on-error: #fff;
			--error-container: #ffdad4;
			--on-error-container: #410001;

			/* Light Background */
			--background: #fcfcfc;
			--on-background: #201a16;
			--surface: #fcfcfc;
			--on-surface: #201a16;

			/* Light Surface Variant */
			--surface-variant: #e2e2ec;
			--on-surface-variant: #44464e;

			--outline: #75767f;
			--shadow-color: 7, 17, 261;

			/* Shadows */
			--small-shadow: rgba(var(--shadow-color), 0.1) 0px 0px 16px;
			--medium-shadow: rgba(var(--shadow-color), 0.05) 0px 4px 16px,
				rgba(var(--shadow-color), 0.05) 0px 8px 32px;
			--large-shadow: rgba(var(--shadow-color), 0.1) 0px 4px 16px,
				rgba(var(--shadow-color), 0.05) 0px 8px 32px;
		}

		main.dark {
			/* Dark Primary */
			--primary: #b0c5ff;
			--on-primary: #002b76;
			--primary-container: #003fa4;
			--on-primary-container: #d9e2ff;

			/* Dark Secondary */
			--secondary: #fface5;
			--on-secondary: #5e004f;
			--secondary-container: #7e1c6a;
			--on-secondary-container: #ffd7f0;

			/* Dark Tertiary */
			--tertiary: #ffb77b;
			--on-tertiary: #4e2600;
			--tertiary-container: #6f3900;
			--on-tertiary-container: #ffdcc1;

			/* Dark Error */
			--error: #ffb4a9;
			--on-error: #680003;
			--error-container: #930006;
			--on-error-container: #ffdad4;

			/* Dark Background */
			--background: #201a16;
			--on-background: #ebe0d9;
			--surface: #201a16;
			--on-surface: #ebe0d9;

			/* Dark Surface Variant */
			--surface-variant: #44464e;
			--on-surface-variant: #c5c6d0;

			--outline: #8f909a;
			--shadow-color: 0, 0, 0;
		}

		* {
			font-family: 'Sora', sans-serif !important;
			margin: 0;
			padding: 0;
		}

		h1,
		h2,
		h3,
		h4,
		h5 {
			font-weight: bold;
			line-height: 130%;
			text-transform: capitalize;
		}

		h1 {
			font-size: 49px;
			letter-spacing: -0.05em;
		}

		h2 {
			font-size: 39px;
			letter-spacing: -0.025em;
		}

		h3 {
			font-size: 31px;
			letter-spacing: -0.0125em;
		}

		h4 {
			font-size: 25px;
			letter-spacing: -0.0063em;
		}

		h5 {
			font-size: 20px;
			letter-spacing: -0.0031em;
		}

		small {
			size: 12px;
			text-transform: capitalize;
		}

		hr {
			background: var(--on-surface-variant);
			height: 1px;
			border: 0;
			margin-bottom: 1rem;
		}
	</style>
</svelte:head>

<style>
	main {
		background: var(--background);
		min-height: 100%;
		transition: background 0.3s ease;
		display: flex;
		padding: 16px;
		gap: 16px;
	}

	.navigation-rail {
		width: 80px;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: calc(100vh - 32px);
		gap: 24px;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.nav-container {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.nav-item {
		height: 56px;
		width: 80px;
		display: flex;
		flex-direction: column;
		align-items: center;
		outline: none;
		background: transparent;
		border: none;
		color: var(--on-background);
		justify-content: center;
		gap: 4px;
	}

	.icon {
		width: 24px;
		height: 24px;
		padding: 4px;
		border-radius: 50%;
		transition: width 100ms ease-in-out, border-radius 100ms ease-in-out,
			background 100ms ease-in-out;
	}

	.nav.icon:hover {
		background: var(--secondary-container);
	}

	.burger {
		display: flex;
		width: 32px;
		height: 32px;
		color: var(--on-surface-variant);
		border: 0;
		background: transparent;
	}

	.burger.icon:hover {
		background: var(--surface-variant);
		cursor: pointer;
	}

	.nav.icon.active {
		background: var(--secondary-container);
		width: 56px;
		border-radius: 25%/50%;
	}

	.container {
		width: 100%;
	}

	.hamburger-container {
		height: 32px;
		transition: height 50ms ease-in-out;
	}

	.hamburger-container:not(.hamburger-active) {
		height: 0;
	}

	.fab-container {
		height: 56px;
		transition: height 50ms ease-in-out;
	}

	.fab-container:not(.fab-active) {
		height: 0;
	}

	@media (max-device-width: 600px) {
		main {
			flex-direction: column-reverse;
			padding: 0;
			height: 100vh;
			gap: 0;
		}

		.container {
			flex-grow: 1;
			flex-shrink: 1;
			width: calc(100vw - 1.5rem);
			padding: 0.75rem;
			overflow-x: visible;
			overflow-y: scroll;
		}

		.nav-container {
			align-items: center;
			width: 100%;
		}

		.nav-container > nav button {
			flex: 1 1 0;
		}

		.navigation-rail {
			position: relative;
			bottom: 0;
			margin: 0;
			background: var(--surface);
			box-shadow: var(--large-shadow);
			width: 100vw;
			flex: 0 1 auto;
			height: min-content;
			gap: 0;
			padding-bottom: 16px;
			padding-top: 12px;
		}
		.fab-container {
			position: absolute;
			bottom: 100px;
			right: 16px;
		}
		nav {
			flex-direction: row;
			width: 100%;
		}
	}
</style>
