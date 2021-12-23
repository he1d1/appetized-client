<script lang="ts">
	import { onMount } from 'svelte';
	import { dark, settings, prefersDark, authed, user, fab } from '../stores';
	import Home from 'svelte-material-icons/Home.svelte';
	import Profile from 'svelte-material-icons/AccountCircle.svelte';
	import Login from 'svelte-material-icons/Login.svelte';
	import Saved from 'svelte-material-icons/Bookmark.svelte';
	import Add from 'svelte-material-icons/Plus.svelte';
	import Cog from 'svelte-material-icons/Settings.svelte';
	import FloatingActionButton from '../lib/FloatingActionButton.svelte';
	import { page } from '$app/stores';
	import { goto, prefetch } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { gql } from '$lib/gql';
	import Toast from '$lib/Toast.svelte';

	let settingsStore = null;

	const myProfile = true;

	const pages = [
		{ route: '/', icon: Home, label: 'Home', fab: null, auth: null },
		{ route: '/new', icon: Add, label: 'Create', fab: null, auth: true },
		{
			route: '/saved',
			icon: Saved,
			label: 'Saved',
			fab: null,
			auth: true
		},
		{
			route: '/@me',
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

	let currentPage;
	$: currentPage = pages[pages.map((p) => p.route).indexOf($page.path)];

	onMount(async () => {
		if (!$authed) {
			let auth;
			const test = async (retrying) => {
				toast.button.text = retrying ? 'Retrying...' : toast.button.text;
				await gql(
					{
						query: '{authed}'
					},
					(data) => {
						auth = data.authed;
					}
				).catch((err) => {
					toast.text = err.message;
					toast.button.text = 'Retry';
					toast.button.fun = test;
				});
			};
			await test(false);

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

	let toast = {
		text: null,
		button: {
			text: null,
			fun: null
		}
	};

	let width, height;

	let aspectRatio;
	$: aspectRatio = width / height;

	function getPathWithoutSlugs(path) {
		for (let param in $page.params) {
			// eslint-disable-next-line no-prototype-builtins
			if ($page.params.hasOwnProperty(param)) {
				path = path.replace($page.params[param], `[${param}]`);
			}
		}
		return path;
	}

	$: console.log(getPathWithoutSlugs($page.path));
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<main class:dark={$dark}>
	{#if toast.text}
		<Toast error>
			<p slot="text">{toast.text}</p>
			<p slot="button" on:click={() => toast.button.fun()}>{toast.button.text}</p>
		</Toast>
	{/if}
	{#if aspectRatio > 1.6 && width > 1600}
		<div class="navigation-drawer container" in:fly={{ x: -100 }}>
			<p class="navigation-drawer headline">Appetized</p>
			<nav class="navigation-drawer">
				{#each pages.filter((page) => page.icon) as page}
					{#if page.auth === $authed || page.auth === null}
						<button
							class:selected={currentPage?.route === page.route}
							class="navigation-drawer"
							on:hover={() => prefetch(page.route)}
							on:click={() => goto(page.route, { replaceState: false })}
						>
							<span class="navigation-drawer icon">
								<svelte:component this={page.icon} size="24" /></span
							>
							<small>{page.label}</small>
						</button>
					{/if}
				{/each}
			</nav>
		</div>
		{#if currentPage?.fab}
			<div
				class="navigation-drawer fab-container"
				in:fly={{ x: -50, duration: 100 }}
				out:fly={{ x: -50, duration: 10 }}
				on:click={() => $fab()}
			>
				{#key currentPage?.fab}
					<FloatingActionButton class="navigation-drawer fab" label={currentPage?.label}>
						<div in:fade>
							<svelte:component this={currentPage?.fab} size="24" />
						</div>
					</FloatingActionButton>
				{/key}
			</div>
		{/if}
	{:else}
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
									on:click={() => goto(page.route, { replaceState: false })}
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
	{/if}
	{#key getPathWithoutSlugs($page.path)}
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
	<title>{currentPage?.label ? currentPage?.label + ' - Appetized' : 'Appetized'}</title>
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
		h5,
		h6 {
			color: var(--on-primary-container);
			font-weight: bold;
			line-height: 130%;
			text-transform: capitalize;
		}

		h1 {
			font-size: 3rem;
			margin: 0.67em 0;
		}

		h2 {
			color: var(--on-secondary-container);
			font-size: 1.5rem;
			margin: 0.83em 0;
		}

		h3 {
			color: var(--on-tertiary-container);

			font-size: 1.1em;
			margin: 1em 0;
		}

		h4,
		h5,
		h6 {
			color: var(--on-background);
			font-size: 1rem;
			margin: 1.6em 0 1em 0;
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
		min-height: calc(100vh - 2rem);
		transition: background 0.3s ease;
		display: flex;
		padding: 16px;
		gap: 16px;
		height: auto;
	}

	.page.container {
		width: calc(100%);
		position: relative;
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
		position: fixed;
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

	.navigation-drawer.container {
		display: flex;
		flex-direction: column;
		width: 300px;
		min-width: 300px;
		padding-right: 28px;
	}

	.navigation-drawer.headline {
		color: var(--on-surface-variant);
	}

	nav.navigation-drawer {
		display: flex;
		flex-direction: column;
	}

	button.navigation-drawer {
		height: 56px;
		width: 100%;
		display: flex;
		align-items: center;
		outline: none;
		background: transparent;
		border: none;
		color: var(--on-background);
		justify-content: start;
		gap: 16px;
		padding: 12px 16px;
		border-radius: 28px;
		transition: background 100ms ease-in-out;
	}
	button.navigation-drawer.selected {
		background: var(--secondary-container);
	}

	.navigation-drawer.fab-container {
		bottom: 16px;
		right: 16px;
		position: fixed;
		z-index: 2;
	}
</style>
