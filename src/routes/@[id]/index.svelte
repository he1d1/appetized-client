<script>
    import { currentRoute } from "../../store"
    import {onMount} from "svelte";

    onMount(() => {
        $currentRoute = {
            name: 'Recipes',
            route: '/@[id]/',
            buttons: []
        }
    })
</script>