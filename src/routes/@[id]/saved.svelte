<script>
    import { currentRoute } from "../../store"
    import {onMount} from "svelte";

    onMount(() => {
        $currentRoute = {
            name: 'Saved',
            route: '/@[id]/saved',
            buttons: $currentRoute?.buttons
        }
    })
</script>

HAI