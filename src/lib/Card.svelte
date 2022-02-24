<script>
    export let neutral = false;
</script>

<div class:neutral>
    <slot/>
</div>

<style lang="postcss">
    .neutral {
        @apply p-4 rounded-xl bg-onSurface dark:bg-onSurfaceDark bg-opacity-5 text-onSurfaceVariant dark:text-onSurfaceVariantDark shadow-md hover:shadow-lg active:shadow-sm transition-shadow;
        --tw-bg-opacity: 0.05;
    }
</style>