<script>
	import { onMount } from 'svelte';
	import { fab, user } from '../stores';
	import { goto } from '$app/navigation';
	import { gql } from '$lib/gql';

	let promise = null;
	fab.set(() => goto('/settings'));

	onMount(async () => {
		let missing = [];
		if (typeof $user.name === 'undefined') {
			missing.push('name');
		}
		if (typeof $user.username === 'undefined') {
			missing.push('username');
		}

		if (typeof $user.profilePicture.url === 'undefined') {
			missing.push('profilePicture{url, alt}');
		}

		if (!missing.length) return; // no missing fields

		promise = await gql(
			{
				query: `{getUser{${JSON.stringify(missing).replace(/([["\]])/g, '')}}}`
			},
			(data) => {
				user.set({ ...$user, ...data?.getUser });
				console.log($user);
			}
		);
	});
</script>

<img src={$user?.profilePicture?.url} alt={$user?.profilePicture?.alt} />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
	}
</style>
