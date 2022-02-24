<script>
import { currentRoute } from "../../store"
import {onMount} from "svelte";

onMount(() => {
    $currentRoute = {
        name: 'Followers',
        route: '/@[id]/followers',
        buttons: []
    }
})
</script>