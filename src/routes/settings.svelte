<script context="module">
    export async function load({session}) {
        if (!session?.user) {
            return {
                status: 200,
                props: {
                    profile: null,
                }
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
    import Image from "$lib/Image.svelte"
    import {onMount} from "svelte";
    import {currentRoute, modal} from "../store";
    import IconButton from "$lib/IconButton.svelte";
    import Pencil from "svelte-material-icons/Pencil.svelte"
    import Button from "$lib/Button.svelte";
    import {goto} from "$app/navigation";
    import {session} from "$app/stores";

    export let profile;

    let base64, bindComponent;

    $: bindComponent = $modal?.bindComponent
    $: base64 = bindComponent?.base64

    $: if ($modal?.actions) {
        if ($modal.actions.find(i => i.label === "Save")) $modal.actions.find(i => i.label === "Save").disabled = !base64
    }

    function profilePictureModal() {
        $modal = {
            title: 'Edit Profile Picture',
            component: Image,
            actions: [
                {
                    label: 'Cancel',
                    buttonType: 'secondary',
                    click: () => {
                        $modal = undefined
                    }
                },
                {
                    label: 'Save',
                    disabled: base64 !== undefined,
                    buttonType: 'primary',
                    click: async () => {
                        await fetch("http://localhost:4000",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                    query: `
                                        mutation EditUser($base64: String!) {
                                            editUser(image: {base64: $base64}) {
                                                ... on User {
                                                    id
                                                    profilePicture {
                                                        url
                                                    }
                                                }
                                                ... on Error {
                                                    code
                                                    message
                                                }
                                            }
                                        }
                                    `,
                                    variables: {
                                        base64: base64
                                    }
                                })
                            }).then(
                                res => res.json()
                        ).then(
                            () => $modal = undefined
                        )
                    }
                }
            ]
        }
    }

    function deleteModal() {
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
                        <IconButton on:click={() => profilePictureModal()}>
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
            <Button danger on:click={() => deleteModal()}>Delete Account</Button>
        </div>
    </Card>
</div>

