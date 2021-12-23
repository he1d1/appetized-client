<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let value,
		placeholder = '',
		label = '',
		inline = false,
		error: string | null = null,
		required = false,
		changed = false,
		type = 'text';

	let input: HTMLInputElement;

	// Bypasses error check for dynamically setting value of type.
	$: input?.setAttribute('type', type);
</script>

<label
	id={label.toLowerCase() + '-label'}
	for={label.toLowerCase()}
	class:inline
	class:error={changed && error}
	on:focusout={() => (changed = true)}
>
	<span
		>{label}
		{#if required}<span class="red">*</span>{/if}
	</span>
	<span class="container">
		<slot />
		<input
			bind:this={input}
			aria-labelledby={label.toLowerCase() + '-label'}
			aria-required={required}
			aria-invalid={(error ?? '').length > 0}
			aria-errormessage={label.toLowerCase() + '-error'}
			class:error={changed && error}
			id={label.toLowerCase()}
			bind:value
			on:keypress
			{...$$props}
			{placeholder}
		/>
	</span>

	{#if changed && error}<small
			id={label.toLowerCase() + '-error'}
			class="red"
			in:fly={{ y: -10 }}
			out:fade>{error ?? ''}</small
		>{/if}
</label>

<style>
	* {
		transition: color 200ms ease-in-out;
	}
	.container {
		border: 1px solid var(--outline);
		border-radius: 9999rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: border 200ms ease-in-out;
		padding-left: 1rem;
	}
	label {
		display: flex;
		margin-bottom: 0.5rem;
		gap: 0.5rem;
		flex-direction: column;
	}
	label.inline {
		flex-direction: row;
	}
	input {
		background: transparent;
		color: var(--on-surface);
		padding: 0.75rem 0.75rem 0.75rem 0;
		border: none;
	}
	.error {
		color: var(--error);
	}
	input.error {
		border: 1px solid var(--error);
	}
	.red {
		color: var(--error);
	}

	input:focus {
		outline: none;
		border: none;
	}
	.container:focus,
	.container:focus-within {
		outline: none;
		border: 1px solid var(--primary);
	}
	input:focus.error {
		border: 1px solid var(--error-container);
	}
</style>
