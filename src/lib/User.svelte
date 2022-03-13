<script lang="ts">
    export let user: { id: string, name?: string, username: string; profilePicture: { url?: string } }

    let url = user?.profilePicture?.url

</script>

<a href="{`/@${user.id}`}" sveltekit:prefetch class="flex gap-2">
        <img class="h-12 w-12 rounded-2xl object-cover" src={url} />
    <div><h2>{user?.name ?? "@" + user?.username}</h2>
        {#if user?.username}<small>@{user.username}</small>{/if}
    </div>
</a>
