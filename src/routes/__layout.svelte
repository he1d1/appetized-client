<script context="module">
	export const load = async ({ page }) => ({
		props: {
			path: page.path
		}
	});
</script>

<script>
	import { onMount } from 'svelte';
	import { dark, settings, prefersDark, authed, user, fab } from '../stores';
	import Home from 'svelte-material-icons/Home.svelte';
	import Search from 'svelte-material-icons/Magnify.svelte';
	import Profile from 'svelte-material-icons/AccountCircle.svelte';
	import Login from 'svelte-material-icons/Login.svelte';
	import Saved from 'svelte-material-icons/Bookmark.svelte';
	import Add from 'svelte-material-icons/Plus.svelte';
	import Pencil from 'svelte-material-icons/Pencil.svelte';
	import Cog from 'svelte-material-icons/Settings.svelte';
	import FloatingActionButton from '../lib/FloatingActionButton.svelte';
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { gql } from '$lib/gql';

	export let path;

	$: console.log(path);

	let settingsStore = null;

	const myProfile = true;

	const pages = [
		{ route: '/', icon: Home, label: 'Home', fab: Search, auth: null },
		{ route: '/new', icon: Add, label: 'Create', fab: null, auth: true },
		{
			route: '/saved',
			icon: Saved,
			label: 'Saved',
			fab: null,
			auth: true
		},
		{
			route: '/profile',
			icon: Profile,
			label: 'Profile',
			fab: myProfile ? Cog : null,
			auth: true
		},
		{
			route: '/sign-in',
			icon: Login,
			label: 'Sign In',
			fab: null,
			auth: false
		},
		{
			route: '/sign-up',
			icon: Profile,
			label: 'Register',
			fab: null,
			auth: false
		},
		{
			route: '/settings',
			icon: Cog,
			label: 'Settings',
			fab: null,
			auth: false
		}
	];

	$: currentPage = pages[pages.map((p) => p.route).indexOf($page.path)];

	onMount(async () => {
		if (!$authed) {
			let auth;
			await gql(
				{
					query: '{authed}'
				},
				(data) => {
					auth = data.authed;
					console.log(data);
				}
			);
			authed.set(auth);
		}

		const storage = JSON.parse(localStorage.getItem('settings') ?? '{}');
		settings.set(storage);

		settings.subscribe((value) => {
			settingsStore = value;
			$dark =
				settingsStore.dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
			localStorage.setItem('settings', JSON.stringify(settingsStore));
		});

		prefersDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			prefersDark.set(e.matches);
			$dark = settingsStore.dark ?? e.matches ?? false;
		});

		if ($authed) {
			await gql(
				{
					query: '{getUser{id}}'
				},
				(data) => user.set({ ...$user, ...data?.getUser })
			);
		}
	});
</script>

<main class:dark={$dark}>
	<!--	<div class="navigation-drawer container">-->
	<!--		<p class="navigation-drawer headline">Appetized</p>-->
	<!--		<nav class="navigation-drawer">-->
	<!--			{#each pages.filter((page) => page.icon) as page}-->
	<!--				{#if page.auth ?? auth === auth}<button-->
	<!--						class:selected={currentPage?.route === page.route}-->
	<!--						class="navigation-drawer"-->
	<!--						on:hover={() => prefetch(page.route)}-->
	<!--						on:click={() => goto(page.route)}-->
	<!--					>-->
	<!--						<span class="navigation-drawer icon">-->
	<!--							<svelte:component this={page.icon} size="24" /></span-->
	<!--						>-->
	<!--						<small>{page.label}</small>-->
	<!--					</button>-->
	<!--				{/if}-->
	<!--			{/each}-->
	<!--		</nav>-->
	<!--	</div>-->
	<div class="navigation-rail container" in:fly={{ x: -100 }}>
		<div class="navigation-rail fab container" class:displayed={currentPage?.fab}>
			{#if currentPage?.fab}
				<div
					in:fly={{ x: -50, duration: 100 }}
					out:fly={{ x: -50, duration: 10 }}
					on:click={() => $fab()}
				>
					{#key currentPage?.fab}
						<FloatingActionButton class="navigation-rail fab" label={currentPage?.label}>
							<div in:fade>
								<svelte:component this={currentPage?.fab} size="24" />
							</div>
						</FloatingActionButton>
					{/key}
				</div>
			{/if}
		</div>
		<div class="navigation-rail item container">
			{#key $authed}
				<nav
					class="navigation-rail"
					in:fly={{ x: -50, duration: 75, delay: 150 }}
					out:fly={{ x: -50, duration: 75 }}
				>
					{#each pages.filter((page) => page.icon) as page}
						{#if page.auth === $authed || page.auth === null}
							<button
								class="navigation-rail item"
								on:hover={() => prefetch(page.route)}
								on:click={() => goto(page.route)}
							>
								<span
									class="navigation-rail icon"
									class:selected={currentPage?.route === page.route}
								>
									<svelte:component this={page.icon} size="24" /></span
								>
								<small>{page.label}</small>
							</button>
						{/if}
					{/each}
				</nav>
			{/key}
		</div>
	</div>
	{#key path}
		<div
			class="page container"
			in:fly={{ y: -15, duration: 50, delay: 50 }}
			out:fly={{ y: 15, duration: 50 }}
		>
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
			color: var(--on-surface-variant);
		}

		hr {
			background: var(--on-surface-variant);
			height: 1px;
			border: 0;
			margin-bottom: 1rem;
		}

		a {
			color: var(--primary);
			text-decoration: none;
		}
	</style>
</svelte:head>

<style>
	main {
		background: var(--background);
		min-height: calc(100vh - 32px);
		transition: background 0.3s ease;
		display: flex;
		padding: 16px;
		gap: 16px;
		height: auto;
	}

	.page.container {
		width: calc(100% - 128px);
		position: absolute;
		left: 112px;
	}

	.navigation-rail.container {
		width: 80px;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: calc(100vh - 32px);
		gap: 24px;
	}

	nav.navigation-rail {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.navigation-rail.item.container {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	button.navigation-rail {
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

	.navigation-rail.icon {
		width: 24px;
		height: 24px;
		padding: 4px;
		border-radius: 50%;
		transition: width 100ms ease-in-out, border-radius 100ms ease-in-out,
			background 100ms ease-in-out;
	}

	.navigation-rail.icon:hover {
		background: var(--secondary-container);
	}

	.navigation-rail.icon.selected {
		background: var(--secondary-container);
		width: 56px;
		border-radius: 25%/50%;
	}

	.navigation-rail.fab.container {
		height: 56px;
		transition: height 50ms ease-in-out;
	}

	.navigation-rail.fab.container:not(.fab-active) {
		height: 0;
	}

	/*.navigation-drawer.container {*/
	/*	display: flex;*/
	/*	flex-direction: column;*/
	/*	width: 360px;*/
	/*	padding-right: 28px;*/
	/*}*/

	/*.navigation-drawer.headline {*/
	/*	color: var(--on-surface-variant);*/
	/*}*/

	/*nav.navigation-drawer {*/
	/*	display: flex;*/
	/*	flex-direction: column;*/
	/*}*/

	/*button.navigation-drawer {*/
	/*	height: 56px;*/
	/*	width: 100%;*/
	/*	display: flex;*/
	/*	align-items: center;*/
	/*	outline: none;*/
	/*	background: transparent;*/
	/*	border: none;*/
	/*	color: var(--on-background);*/
	/*	justify-content: start;*/
	/*	gap: 16px;*/
	/*	padding: 12px 12px 12px 16px;*/
	/*	border-radius: 28px;*/
	/*	transition: background 100ms ease-in-out;*/
	/*}*/
	/*button.navigation-drawer.selected {*/
	/*	background: var(--secondary-container);*/
	/*}*/
</style>