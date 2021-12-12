<script>
	import { config, user } from '../stores';
	import { page } from '$app/stores';

	const verificationCode = $page.query.get('code');
	let verified = null;
	if (verificationCode) {
		fetch($config.SERVER_URL + '/verify/' + verificationCode).then((res) => {
			verified = res.ok;
		});
	}
</script>

{#if $user?.email}We have sent an email to <span>{$user.email}</span> with a link to verify your email
	address.
{:else if verified}
	Email address verified. <a href="/sign-in" sveltekit:prefetch>Login</a>
{:else if verified === false}
	<p>Account verification failed.</p>
{:else}
	Verifying your email address...
{/if}

<style>
	span {
		color: var(--primary);
	}
	p {
		color: var(--error);
	}
</style>
