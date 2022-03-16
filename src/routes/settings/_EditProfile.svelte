<svelte:options accessors/>

<script>
    import Input from "$lib/Input.svelte";
    export let name, username;
</script>

<Input id="name" bind:value={name} label="Name"/>
<Input id="username" bind:value={username} label="Username"/>
