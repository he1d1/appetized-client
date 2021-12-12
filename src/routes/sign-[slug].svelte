<script lang="ts">
	import Input from '../lib/Input.svelte';
	import Button from '../lib/Button.svelte';
	import { authed, user } from '../stores';
	import { gql } from '$lib/gql';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const signIn = $page.params.slug === 'in';
	const signUp = $page.params.slug === 'up';

	console.log('on sign-' + $page.params.slug);

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
			if (!register.email?.length || !register.password?.length) return;
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
	$: console.log(error, $authed);
</script>

<svelte:head>
	<title>Home - Appetized</title>
</svelte:head>

<div class="container">
	<div class="form">
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
					error={login.password?.length < 1 ? 'Password is required' : error?.extensions?.password}
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
					New to Appetized?&nbsp;<a sveltekit:prefetch href="/sign-up"
						>Create&nbsp;an&nbsp;account</a
					>
				</p>
				{#if error?.message}<span class="error" transition:fade
						>{error?.message}&nbsp;
						{#if error?.message === 'Incorrect email or password.'}<a
								sveltekit:prefetch
								href="/account-recovery">Forgot&nbsp;Password?</a
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
				Already have an account?&nbsp;<a sveltekit:prefetch href="/sign-in">Log&nbsp;back&nbsp;in</a
				>
			</div>
		{/if}
	</div>
	{#if ready}<div class="carousel" in:fade>
			<h2>This is a placeholder... 👀</h2>
			<p>There will be a carousel here!</p>
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
		width: 50%;
		height: min-content;
	}
	.carousel {
		background-color: var(--primary-container);
		color: var(--on-primary-container);
		margin: -1rem -1rem -1rem 1rem;
		min-height: 100vh;
		height: auto;
		width: 50%;
	}
	.flex {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.container {
		display: flex;
		align-items: center;
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
