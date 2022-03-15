<script>
    export let primary = false;
    export let secondary = false;
    export let text = false;
    export let danger = false;
    export let disabled = false;
</script>

{#if !disabled}
<button class:primary class:secondary class:text class:disabled class:danger on:click on:hover>
    <slot></slot>
</button>
    {:else}
<button class:primary class:secondary class:text class:disabled class:danger>
    <slot></slot>
</button>
{/if}


<style lang="postcss">
    button {
        font-size: 1rem;
    }

    .primary {
        @apply bg-primary dark:bg-primaryDark;
        @apply text-onPrimary dark:text-onPrimaryDark;
        @apply px-4 py-3 rounded-full;
        @apply overflow-hidden relative after:transition-opacity after:absolute after:inset-0 after:bg-surfaceVariant after:dark:bg-surfaceVariantDark after:opacity-0 after:hover:opacity-[8%] after:focus-visible:opacity-[12%] after:active:opacity-[12%];
        @apply shadow hover:shadow-md active:shadow-sm transition-shadow focus:outline-0 focus:outline-none focus:border-0;;
    }
    .secondary {
        @apply relative before:absolute before:content-[''] before:bg-surfaceVariant dark:before:bg-surfaceVariantDark before:inset-0 before:w-full before:h-full before:-z-10 before:opacity-50;
        @apply text-primary dark:text-primaryDark;
        @apply px-4 py-3 rounded-full;
        @apply overflow-hidden relative after:transition-opacity after:absolute after:inset-0 after:bg-onPrimary after:dark:bg-onPrimaryDark after:opacity-0 after:hover:opacity-[8%] after:focus-visible:opacity-[12%] after:active:opacity-[12%];
        @apply shadow hover:shadow-md active:shadow-sm transition-shadow focus:outline-0 focus:outline-none focus:border-0;
    }
    .text {
        @apply overflow-hidden px-4 py-3 rounded-full focus:outline-0 focus:outline-none focus:border-0;
        @apply relative before:absolute before:content-[''] before:bg-surfaceVariant dark:before:bg-primaryContainer before:inset-0 before:w-full before:h-full before:-z-10 before:opacity-0 before:hover:opacity-10 before:transition-opacity;
        @apply before:active:opacity-25 before:focus-visible:opacity-25;
    }
    .danger {
        @apply bg-error dark:bg-errorDark;
        @apply text-onError dark:text-onErrorDark;
        @apply px-4 py-3 rounded-full;
        @apply overflow-hidden relative after:transition-opacity after:absolute after:inset-0 after:bg-surfaceVariant after:dark:bg-surfaceVariantDark after:opacity-0 after:hover:opacity-[8%] after:focus-visible:opacity-[12%] after:active:opacity-[12%];
        @apply shadow hover:shadow-md active:shadow-sm transition-shadow focus:outline-0 focus:outline-none focus:border-0;
    }

    .disabled {
        @apply cursor-not-allowed;
        @apply opacity-25;
    }
</style>