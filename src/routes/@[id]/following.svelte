<script>
    import { currentRoute } from "../../store"
    import {onMount} from "svelte";

    onMount(() => {
        $currentRoute = {
            name: 'Following',
            route: '/@[id]/following',
            buttons: []
        }
    })
</script>