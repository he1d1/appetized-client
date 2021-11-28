<script>
	import Input from '../components/Input.svelte';
	import Card from '../components/Card.svelte';

	let aoeu = 'password';
	let value = '';
	$: console.log(value);
</script>

<svelte:head>
	<title>Home - Appetized</title>
</svelte:head>

<Card elevated
	><Input
		bind:value={aoeu}
		placeholder="john.smith@example.com"
		label="Username"
		error={value.length > 2 ? null : 'Username must be at least 2 characters long'}
	/>
	<Input bind:value placeholder="********" label="Password" required type={aoeu} /></Card
>
