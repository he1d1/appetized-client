<script>
	import { currentRoute } from '../store';
	import { onMount } from 'svelte';
	import Card from '$lib/Card.svelte';
	import Input from '$lib/Input.svelte';
	import Image from '$lib/Image.svelte';
	import Button from '$lib/Button.svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		$currentRoute = {
			name: 'Sign Up',
			buttons: [],
			route: '/sign-up'
		};
	});

	let email = '',
		password = '',
		passwordConfirm = '',
		name = '',
		username = '',
		base64,
		imageValue;
	let step = 0;

	$: emailValid = email.indexOf('@') !== -1;

	$: passwordLongEnough = password?.length >= 8;
	$: passwordNotTooLong = passwordConfirm?.length <= 100;
	$: passwordsMatch = password === passwordConfirm;

	$: usernameLongEnough = name?.length >= 2;
	$: usernameNotTooLong = name?.length <= 20;
	$: usernameValidChars = username.match(/^[a-z0-9\-]+$/);
	$: usernameNotSurrounded = username.match(/^[a-z0-9][a-z0-9-]+[a-z0-9]$/);

	let changed = {
		email: false,
		password: false,
		passwordConfirm: false,
		username: false
	};

	let error = '';

	async function signUp() {
		const res = await fetch('http://localhost:4000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `
                    mutation CreateUser($name: String, $username: String!, $email: String!, $password: String!, $image: ImageInput) {
                        createUser(user: {
                            name: $name,
                            username: $username,
                            email: $email,
                            password: $password,
                        },
                        image: $image
                        ) {
                            ... on User {
                                id
                            }
                            ... on Error {
                                code
                                message
                            }
                        }        
                    }
                `,
				variables: {
					name,
					username,
					email,
					password,
					image: base64
						? {
								base64
						  }
						: undefined
				}
			})
		});

		const json = await res.json();

		if (json?.errors) {
			throw new Error(json.errors[0].message);
		}

		if (json.data.createUser?.code) {
			error = json.data.createUser.message;
			return;
		}

		goto('/sign-in');
	}
</script>

<Card neutral>
	<div class="flex mb-2">
		<h1 class="flex-1">
			{#if step == 0}Login Details
			{:else if step == 1}Profile Details
			{:else if step == 2}Profile Picture
			{/if}
		</h1>
		<p>Step <sup>{step + 1}</sup>/<sub>3</sub></p>
	</div>
	<div class="flex flex-col gap-2">
		{#if step == 0}
			<Input
				required
				id="email"
				label="Email"
				type="email"
				bind:value={email}
				placeholder="Email"
				on:blur={() => {
					changed.email = true;
				}}
			/>
			{#if !emailValid && changed.email}
				<p class="text-error dark:text-errorDark">Please enter a valid email address</p>
			{/if}
			<Input
				required
				id="password"
				label="Password"
				type="password"
				bind:value={password}
				placeholder="Password"
				on:blur={() => {
					changed.password = true;
				}}
			/>
			{#if !passwordLongEnough && changed.password}
				<p class="text-error dark:text-errorDark">Password must be at least 8 characters</p>
			{:else if !passwordNotTooLong}
				<p class="text-error dark:text-errorDark">Password must be less than 100 characters</p>
			{/if}
			<Input
				required
				id="passwordConfirm"
				label="Confirm Password"
				type="password"
				bind:value={passwordConfirm}
				placeholder="Confirm Password"
				on:blur={() => {
					changed.passwordConfirm = true;
				}}
			/>
			{#if !passwordsMatch && changed.passwordConfirm}
				<p class="text-error dark:text-errorDark">Passwords do not match</p>
			{/if}

			<Button
				primary
				on:click={() => step++}
				disabled={!emailValid || !passwordLongEnough || !passwordNotTooLong || !passwordsMatch}
				>Next</Button
			>
		{:else if step == 1}
			<Input id="name" label="Name" type="text" placeholder="Name" bind:value={name} />
			<Input
				required
				id="username"
				label="Username"
				type="text"
				placeholder="Username"
				bind:value={username}
			/>
			{#if !usernameLongEnough && changed.username}
				<p class="text-error dark:text-errorDark">Username must be at least 2 characters</p>
			{:else if !usernameNotTooLong}
				<p class="text-error dark:text-errorDark">Username must be less than 20 characters</p>
			{:else if !usernameValidChars && username.length > 2}
				<p class="text-error dark:text-errorDark">
					Username must only contain letters, numbers and dashes
				</p>
			{:else if !usernameNotSurrounded && username.length > 2}
				<p class="text-error dark:text-errorDark">Username must not start or end with a dash</p>
			{/if}
			<Button secondary on:click={() => step--}>Back</Button>
			<Button
				primary
				on:click={() => {
					step++;
				}}
				disabled={!usernameLongEnough ||
					!usernameNotTooLong ||
					!usernameValidChars ||
					!usernameNotSurrounded}>Next</Button
			>
		{:else if step == 2}
			<Image bind:base64 bind:imageValue />
			<p class="text-error dark:text-errorDark">{error}</p>
			<Button secondary on:click={() => step--}>Back</Button>
			<Button primary={!!base64} secondary={!base64} on:click={() => signUp()}
				>{#if base64}Create{:else}Skip{/if}</Button
			>
		{/if}
	</div>
</Card>
