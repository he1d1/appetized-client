<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				status,
				message: error.message
			}
		};
	}
</script>

<script>
	import Button from '$lib/Button.svelte';
	import { goto, prefetch } from '$app/navigation';
	import { authed, currentRoute } from '../store';
	import { onMount } from 'svelte';
	import { page, session } from '$app/stores';

	export let status, message;

	const ascii = [
		'¯\\_(ツ)_/¯',
		'(╯°□°）╯︵ ┻━┻',
		'┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻',
		'ヽ(ಠ益ಠ)ﾉ',
		'┬─┬﻿ ノ( ゜-゜ノ)',
		'OwO',
		'UwU',
		'T_T',
		'( ͡° ͜ʖ ͡°)',
		'[o_0]',
		"<( -'.'- )>",
		'ಠ_ಠ',
		'ಠ‿ಠ'
	];

	onMount(() => {
		$currentRoute = {
			name: status.toString(),
			route: $page.url.pathname,
            buttons: []
		};
	});
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1 class="text-error dark:text-errorDark not-italic">
		{ascii[Math.floor(Math.random() * ascii.length)]}
	</h1>
	<p class="text-center">
		{message}
	</p>
	{#if status === 401 && !$session?.user}
		<div class="flex gap-4">
			<Button
				on:click={() => goto('/sign-in')}
				on:hover|once={() => prefetch('/sign-in')}
				secondary
			>
				Sign In
			</Button>
			<Button on:click={() => goto('/sign-up')} on:hover|once={() => prefetch('/sign-up')} primary>
				Sign Up
			</Button>
		</div>
	{/if}
</div>
