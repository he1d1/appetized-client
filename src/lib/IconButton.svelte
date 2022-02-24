<button class="icon-button" on:click>
    <slot size="24"></slot>
</button>

<style lang="postcss">
    button.icon-button {
        @apply relative before:absolute before:inset-0 before:content-[''] before:z-0;
        @apply before:bg-surfaceVariant before:dark:bg-surfaceVariantDark before:rounded-full before:transform before:scale-0 before:opacity-0;
        @apply hover:before:scale-100 before:transition-all duration-200 hover:before:opacity-50;
        @apply focus-visible:before:scale-125 focus-visible:before:opacity-75;
        @apply active:before:scale-125 active:before:opacity-75;
        @apply focus:outline-0 focus:outline-none focus:border-0;
    }


    :global(button.icon-button > svg) {
        @apply z-10 relative;
    }
</style>
