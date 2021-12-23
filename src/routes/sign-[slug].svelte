<script lang="ts">
	import Input from '../lib/Input.svelte';
	import Button from '../lib/Button.svelte';
	import { authed, user } from '../stores';
	import { gql } from '$lib/gql';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Toast from '$lib/Toast.svelte';

	$: signIn = $page.params.slug === 'in';
	$: signUp = $page.params.slug === 'up';

	console.log('on sign-' + $page.params.slug);

	let selected = [0, 0];
	let carousel = [
		{
			title: 'Upload your own recipes.',
			description: 'Upload your own recipes and share them with the world.'
		},
		{
			title: 'Save your favorite recipes.',
			description: 'Save the best recipes so you can easily find them (even offline!).'
		},
		{
			title: 'Follow your favourite chefs.',
			description: 'Follow your favourite chefs and get notified when they upload new recipes.'
		}
	];

	let ready = false;
	onMount(() => {
		ready = true;
	});

	$: console.log(changed);

	if ($authed) {
		goto('/');
	}

	let changed = false;
	let login = {
		email: '',
		password: '',
		submit: () => {
			if (!login.email?.length || !login.password?.length) return;
			gql(
				{
					query: `
					mutation login($email: String!, $password: String!) {
						login(email: $email, password: $password) {
							success
						}
					}
					`,
					variables: {
						email: login.email,
						password: login.password
					}
				},
				(data, errors) => {
					console.log(data, errors);
					if (data?.login?.success) {
						authed.set(true);
						// wait 125ms to redirect.
						setTimeout(() => {
							goto('/');
						}, 125);
					} else {
						error = errors?.[0] ?? null;
						changed = true;
					}
				}
			);
		}
	};

	let register = {
		name: '',
		username: '',
		email: '',
		password: '',
		submit: () => {
			if (!register.email?.length || !register.password?.length || !register.username?.length)
				return;
			gql(
				{
					query: `
					mutation addUser($email: String!, $user: UserInput!) {
						addUser(email: $email, user: $user) {
							success
						}
					}
					`,
					variables: {
						email: register.email,
						user: {
							name: register.name,
							username: register.username,
							password: register.password
						}
					}
				},
				(data, errors) => {
					console.log(data, errors);
					if (data?.addUser?.success) {
						// wait 125ms to redirect.
						setTimeout(() => {
							user.set({ ...$user, email: register.email });
							goto('/verify-email');
						}, 125);
					} else {
						error = errors?.[0] ?? null;
						changed = true;
					}
				}
			);
		}
	};

	let error: string | null = null;
	let toast = undefined;
	$: console.log(error, $authed);
</script>

<svelte:head>
	<title>Home - Appetized</title>
</svelte:head>

<div class="sign-in container">
	{#key $page.params.slug}
		<div
			class="form"
			in:fly={{ y: -15, duration: 50, delay: 50 }}
			out:fly={{ y: 15, duration: 50 }}
		>
			{#if signIn}<h1>Log In</h1>
				<small>Get back to cooking!</small>
				<br />
				<div>
					<Input
						label="Email or username"
						bind:value={login.email}
						placeholder="john@example.com"
						required
						error={login.email?.length < 1
							? 'Email or username is required'
							: error?.extensions?.email}
						type="email"
						{changed}
					/>
					<Input
						label="Password"
						required
						bind:value={login.password}
						type="password"
						on:keypress={({ charCode }) => {
							if (charCode === 13) login.submit();
						}}
						error={login.password?.length < 1
							? 'Password is required'
							: error?.extensions?.password}
						{changed}
					/>
				</div>
				<Button
					primary
					wide
					disabled={changed && (!login.email?.length || !login.password?.length)}
					on:click={() => login.submit()}
					>Sign In
				</Button>
				<div class="flex">
					<p>
						New to Appetized?&nbsp;<a
							sveltekit:prefetch
							on:click={() => goto('/sign-up', { replaceState: true })}
							>Create&nbsp;an&nbsp;account</a
						>
					</p>
					{#if error?.message}<span class="error" transition:fade
							>{error?.message}&nbsp;
							{#if error?.message === 'Incorrect email or password.'}<a
									sveltekit:prefetch
									on:click={() => goto('/sign-up', { replaceState: true, noscroll: true })}
									>Forgot&nbsp;Password?</a
								>{/if}</span
						>{/if}
				</div>
			{:else if signUp}
				<h1>Sign Up</h1>
				<small>Lets get you started!</small>
				<br />
				<div>
					<Input
						label="Name"
						bind:value={register.name}
						placeholder="John Smith"
						error={error?.extensions?.name}
						type="name"
						{changed}
					/>
					<Input
						label="Username"
						bind:value={register.username}
						placeholder="FooBar"
						required
						error={register.username?.length < 1
							? 'Username is required'
							: error?.extensions?.username}
						type="name"
						{changed}
					/>
					<Input
						label="Email"
						bind:value={register.email}
						placeholder="john@example.com"
						required
						error={register.email?.length < 1 ? 'Email is required' : error?.extensions?.email}
						type="email"
						{changed}
					/>
					<Input
						label="Password"
						required
						bind:value={register.password}
						type="password"
						on:keypress={({ charCode }) => {
							if (charCode === 13) register.submit();
						}}
						error={register.password?.length < 1
							? 'Password is required'
							: error?.extensions?.password}
						{changed}
					/>
				</div>
				<Button
					primary
					wide
					disabled={changed && (!register.email?.length || !register.password?.length)}
					on:click={() => register.submit()}
					>Sign In
				</Button>
				<div class="flex">
					{#if error?.message}<span class="error" transition:fade>{error?.message}</span>{/if}
					Already have an account?&nbsp;<a sveltekit:prefetch href="/sign-in"
						>Log&nbsp;back&nbsp;in</a
					>
				</div>
			{/if}
		</div>
	{/key}
	{#if ready}<div class="carousel container" in:fade>
			<div class="carousel item container">
				{#key selected}
					<div
						in:fly={{ x: Math.sign(selected[1] - selected[0]) * -50, delay: 250 }}
						out:fly={{ x: Math.sign(selected[1] - selected[0]) * 50, duration: 250 }}
						class="carousel item inner"
					>
						<h4>{carousel[selected[1]].title}</h4>
						<p>{carousel[selected[1]].description}</p>
					</div>
				{/key}
			</div>
			<div class="carousel page-select">
				{#each carousel as _, i}<span
						class:selected={i === selected[1]}
						on:click={() => {
							if (i === selected[1]) return;
							selected.shift();
							selected.push(i);
							selected = selected;
						}}>&zwnj;</span
					>{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: transparent;
		color: var(--on-background);
		height: min-content;
		flex: 1 1 0;
	}
	.carousel.container {
		padding: 1rem;
		background-color: var(--primary-container);
		height: calc(100vh - 2rem);
		width: 40vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--on-primary-container);
	}

	.carousel.item.container {
		flex: 1 1 0;
		background: transparent;
	}
	.carousel.item.inner {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		position: absolute;
	}

	.carousel.page-select {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.carousel.page-select > span {
		background: var(--on-primary-container);
		height: 0.5rem;
		width: 0.5rem;
		display: block;
		border-radius: 50%;
		opacity: 50%;
		transition: width 100ms, height 100ms, opacity 200ms;
		padding: 0.5rem;
		background-clip: content-box;
	}

	.carousel.page-select > span.selected {
		opacity: 75%;
		height: 0.75rem;
		width: 0.75rem;
	}

	.flex {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.container.sign-in {
		height: calc(100vh - 4rem);
		padding: 1rem 0 1rem 1rem;
		display: flex;
		align-items: center;
		margin-right: -1rem;
		gap: 2rem;
	}

	.error {
		color: var(--error);
		float: right;
		margin-left: auto;
	}

	.error > a {
		color: var(--on-error-container);
	}

	@media (max-height: 750px) or (max-width: 1000px) {
		.carousel {
			display: none;
		}
		.form {
			width: 100%;
		}
	}
</style>
