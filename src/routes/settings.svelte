<script context="module">
    export async function load({session}) {
        if (!session?.user) {
            return {
                error: "You are not logged in. Sign in below to post recipes.",
                status: 401
            }
        }
        return {
            status: 200,
            props: {
                profile: session.user
            }
        }
    }
</script>

<script>
    import Card from "$lib/Card.svelte"
    import {onMount} from "svelte";
    import {currentRoute, modal} from "../store";
    import IconButton from "$lib/IconButton.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte"
    import Button from "$lib/Button.svelte";

    onMount(() => {
        $currentRoute = {
            name: "Settings",
            buttons: [],
            route: "/settings"
        }
    })

    function openModal() {
        $modal = {
            title: 'Are you sure?',
            content: 'This will delete your account and all your recipes.',
            closable: false,
            danger: true,
            actions: [
                {
                    label: 'Cancel',
                    click: async () => {
                        $modal = undefined
                    },
                    buttonType: 'text'
                },
                {
                    label: 'Delete',
                    click: async () => {
                        await fetch("https://localhost:4000",
                            {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    query: `
                                        mutation {
                                            deleteUser
                                        }
                                    `
                                })
                            }
                        )
                        $modal = undefined
                    },
                    buttonType: 'danger'
                }
            ]
        }
    }

    export let profile;
</script>

<div class="flex flex-col gap-4">
    <Card neutral>
        <div class="flex flex-col gap-4">
            <div class="flex">
                <div class="relative w-20 h-20"><img
                        alt="Profile"
                        class="rounded-[1.875rem] w-20 h-20 object-cover"
                        src={profile?.profilePicture?.url ?? "https://images.unsplash.com/photo-1622348512579-73da9531493a"}/>
                    <div class="left-16 p-1 pt-0.5 -bottom-7 bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark w-6 h-6 rounded-full absolute -translate-y-full">
                        <IconButton on:click={() => console.log("Test")}>
                            <Pencil/>
                        </IconButton>
                    </div>
                </div>
                <div class="flex-1 items-end justify-center flex flex-col"><h1>
                    {profile?.name ?? "@" + profile.username}
                </h1>
                    <p>@{profile?.name ? profile.username : ""}</p>
                </div>
            </div>
            <Button secondary>Edit Profile</Button>
        </div>
    </Card>

    <Card neutral>
        <div class="flex flex-col gap-2"><h1>Danger Zone</h1>
            <p>This is a dangerous area. You can delete your account and all of your recipes.</p>
            <Button danger on:click={() => openModal()}>Delete Account</Button>
        </div>
    </Card>
</div>

