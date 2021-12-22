<script>
	import Card from '../lib/Card.svelte';
	import { settings, prefersDark, authed, user } from '../stores';
	import Button from '$lib/Button.svelte';
	import { gql } from '$lib/gql';
	import { goto, prefetch } from '$app/navigation';
	import { onMount } from 'svelte';
	import Skelly from '$lib/Skelly.svelte';

	let logoutError = null;

	let promise = null;
	onMount(async () => {
		let missing = [];
		if (typeof $user.name === 'undefined') {
			missing.push('name');
		}
		if (typeof $user.username === 'undefined') {
			missing.push('username');
		}

		if (typeof $user?.profilePicture?.url === 'undefined') {
			missing.push('profilePicture{url, alt}');
		}

		if (!missing.length) return; // no missing fields

		promise = await gql(
			{
				query: `{getUser{${JSON.stringify(missing).replace(/([["\]])/g, '')}}}`
			},
			(data) => {
				console.log(data);
				user.set({ ...$user, ...data?.getUser });
				console.log($user);
			}
		);
	});
</script>

<Card outlined>
	{#if $authed}
		<div class="profile-pic">
			&zwnj;<img src={$user?.profilePicture?.url} alt={$user?.profilePicture?.alt} />
		</div>

		{#if typeof $user.name === 'undefined'}
			<Skelly />
		{:else if $user.name !== ''}
			<div>
				<h2>{$user.name}</h2>
				<small>@{$user.username}</small>
			</div>
		{:else}
			<h2>{$user.username}</h2>
		{/if}
		<Button
			outlined
			on:click={() =>
				gql(
					{
						query: `mutation{logout{success}}`
					},
					(data, errors) => {
						if (data?.logout?.success) {
							authed.set(false);
						} else logoutError = errors?.[0]?.message;
					}
				)}>Logout</Button
		> <span class="error">{logoutError ?? ''}</span>
	{:else}
		<div class="login container">
			<span>You are not logged in.</span>
			<Button secondary on:mouseenter={() => prefetch('/sign-in')} on:click={() => goto('/sign-in')}
				>Login
			</Button>
			<Button primary on:mouseenter={() => prefetch('/sign-up')} on:click={() => goto('/sign-up')}
				>Sign Up
			</Button>
		</div>
	{/if}
</Card>

<Card elevated>
	<div id="theme">
		<h3>Theme</h3>
		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={null} />
			System Default ({$prefersDark ? 'Dark' : 'Light'})
		</label>

		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={true} />
			Dark Mode
		</label>

		<label>
			<input type="radio" bind:group={$settings.dark} name="appearance" value={false} />
			Light Mode
		</label>
	</div>
</Card>

<style>
	.login.container {
		display: flex;
		justify-content: end;
		align-items: center;
		height: 100%;
		gap: 1rem;
	}
	.login.container > span {
		flex: 1 1 0;
	}
	.profile-pic {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background-color: #eee;
		overflow: hidden;
	}
	.profile-pic > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	#theme {
		color: var(--on-surface);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.error {
		color: var(--error);
	}

	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
</style>
