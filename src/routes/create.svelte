<script context="module">
    export async function load({session}) {
        if (!session.user.id) {
            return {
                error: "You are not logged in. Sign in below to post recipes.",
                status: 401
            }
        }
        return {
            status: 200,
            props: {
                user: session.user
            }
        }
    }
</script>

<script>
    import {onMount} from "svelte";
    import {currentRoute} from "../store";

    onMount(() => {
        $currentRoute = {
            name: "Create",
            buttons: [],
            route: "/create"
        }
    })

    export let user;
</script>