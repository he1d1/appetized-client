<script>
    import Button from "$lib/Button.svelte";
    import Input from "$lib/Input.svelte";
    import {goto, invalidate} from "$app/navigation";
    import {authed, currentRoute} from "../store"
    import {onMount} from "svelte";

    let email, password;

    onMount(() => {
        $currentRoute = {
            buttons: [],
            route: "/sign-in",
            name: "Sign In",
        }
    })
</script>

<div class="flex flex-col gap-4">
    <Input id="email" label="Email or Username" type="email" bind:value={email}/>
    <Input id="password" label="Password" type="password" bind:value={password}/>
    <Button primary on:click={async () => {
        await fetch("http://localhost:4000", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    mutation loginUser($usernameOrEmail: String!, $password: String!) {
                        loginUser(usernameOrEmail: $usernameOrEmail, password: $password) {
                            ... on User {
                                id
                            }
                            ... on Error {
                                code
                                message
                            }
                        }
                    }
                `,
                variables: {
                    usernameOrEmail: email,
                    password: password,
                }
            })
        }).then(res => res.json()).then((res) => {
            if (res.data.loginUser.code) {
                alert(res.data.loginUser.message);
            } else {
                $authed = true;
                invalidate("");
                goto("/");
            }
        });
       }}>Sign in
    </Button>
</div>