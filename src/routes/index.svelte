<script>
	import { user } from '../stores';
	import { onMount } from 'svelte';
	import { gql } from '$lib/gql';
	import '../lib/date.extensions';
	import Outline from 'svelte-material-icons/BookmarkOutline.svelte';
	import Filled from 'svelte-material-icons/Bookmark.svelte';

	onMount(async () => {
		await gql(
			{
				query: `
		      {
            feed(take: 7) {
              id
              name
              description
              uploadDate
              author {
               id
               name
               profilePicture {
                url
                alt
               }
              }
            }
          }
        `
			},
			(data) => {
				data.feed.forEach((value) => {
					if (!$user?.feed.map((recipe) => recipe.id).includes(value.id)) {
						$user.feed.push(value);
						value.gradient = createGradient();
					}
				});
				$user = $user;
			}
		);

		await gql(
			{
				query: `
			{getUser{savedRecipes}}
			`
			},
			(data) => {
				data?.getUser?.savedRecipes?.forEach((value) => {
					if (!$user?.savedRecipes?.includes(value)) {
						$user.savedRecipes.push(value);
					}
				});
			}
		);

		const target = document.querySelector('section:last-child');

		const infiniteScroll = (target) => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							gql(
								{
									query: `
							      {
					            feed(take: 3 cursor: "${$user?.feed[$user.feed.length - 1].id}" skip: true) {
					              id
					              name
					              description
					              uploadDate
					              author {
					                id
					                name
					                profilePicture {
					                  url
					                  alt
					                }
					              }
					            }
					          }
					        `
								},
								(data) => {
									data.feed.forEach((value) => {
										if (!$user?.feed.includes(value)) {
											$user.feed.push(value);
											$user = $user;
											value.gradient = createGradient();
										}
									});
								}
							);
						}
					});
				},
				{ threshold: [0.01], rootMargin: '0px' }
			);

			observer.observe(target);
		};
		infiniteScroll(target);
	});

	const p = [
		[176, 197, 255],
		[0, 43, 118],
		[0, 63, 164],
		[217, 226, 255]
	];
	const s = [
		[255, 172, 229],
		[94, 0, 79],
		[126, 28, 106],
		[255, 215, 240]
	];
	const t = [
		[255, 183, 123],
		[78, 38, 0],
		[111, 57, 0],
		[255, 220, 193]
	];

	function createGradient() {
		const float = Math.random();
		const random = Array.from(float.toString());
		let color = random[2] <= 3 ? p : random[2] <= 7 ? s : t;
		const angle = 360 * float;
		const c1 = color[Math.floor(float * 4)].map((c) => c * (1 + random[2] / 75));
		const c2 = color[Math.floor(4 - float * 4)].map((c) => c * (1 + random[3] / 75));
		return `background: linear-gradient(${angle}deg, rgb(${c1.join(', ')}), rgb(${c2.join(', ')}))`;
	}

	let width;

	const save = async (id) => {
		await gql(
			{
				query: `mutation($id: ID!) {saveRecipe(id: $id)}`,
				variables: { id }
			},
			(data, errors) => {
				if (errors) console.error(errors);
				if (data) {
					$user.savedRecipes.push(id);
					$user = $user;
				}
			}
		);
	};
	const unsave = async (id) => {
		await gql(
			{
				query: `mutation($id: ID!) {unsaveRecipe(id: $id)}`,
				variables: { id }
			},
			(data, errors) => {
				if (errors) console.error(errors);
				if (data) {
					$user.savedRecipes.splice($user.savedRecipes.indexOf(data), 1);
					$user = $user;
				}
			}
		);
	};
</script>

<svelte:window bind:innerWidth={width} />

<section>
	<h1>Home</h1>
	{#each $user?.feed as { id, name, description, uploadDate, image, gradient, author, username }, i}
		<div
			class:recipe={i !== 0 || width <= 900}
			class:featured={i === 0 && width > 900}
			class="container"
		>
			<div
				class="image-container"
				class:recipe={i !== 0 || width <= 900}
				class:featured={i === 0 && width > 900}
			>
				<div class="image-placeholder" style={gradient}>&zwnj;</div>
			</div>
			<div
				class="text-wrapper"
				class:recipe={i !== 0 || width <= 900}
				class:featured={i === 0 && width > 900}
			>
				<div
					class="text-container"
					class:recipe={i !== 0 || width <= 900}
					class:featured={i === 0 && width > 900}
				>
					<h2 class:recipe={i !== 0 || width <= 900} class:featured={i === 0 && width > 900}>
						{name}
					</h2>
					<small>{description}</small>
					<div class="info-container">
						<img src={author?.profilePicture?.url} alt={author?.profilePicture?.url} />
						<small
							><a href={`/@${author?.id}`}>By {author?.name}</a> &#183; {new Date(
								parseInt(uploadDate)
							).prettify()}</small
						>
					</div>
				</div>
				{#if $user.savedRecipes.includes(id)}
					<button
						on:click={() => {
							unsave(id);
						}}
					>
						<Filled size="32" />
					</button>
				{:else}
					<button
						on:click={() => {
							save(id);
						}}
					>
						<Outline size="32" />
					</button>
				{/if}
			</div>
		</div>
	{/each}
	<div class="reached-bottom">
		<h3>That's all.</h3>
		<small>You have seen all the recipes by people you follow.</small>
	</div>
</section>

<style>
	section {
		gap: 2rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		padding: 0 8rem;
	}

	.container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.featured.container {
		gap: 2rem;
		grid-column: span 3;
		flex-direction: row;
	}

	.recipe.image-container {
		height: 15rem;
	}

	.featured.image-container {
		height: 25rem;
		width: 66%;
	}

	.image-container > * {
		width: 100%;
		height: 100%;
		border-radius: 1rem;
	}

	.text-wrapper {
		align-items: center;
		width: 100%;
		display: flex;
		flex: 1 1 0;
	}

	.recipe.text-wrapper {
		align-items: start;
	}

	.text-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 0.5rem;
	}

	.recipe.text-container {
		height: 100%;
	}

	.info-container:first-child {
		order: 1;
	}

	.info-container {
		display: flex;
		gap: 0.5rem;
		line-height: 1.75;
	}

	.info-container > img {
		border-radius: 50%;
		height: 24px;
	}

	.text-container > small {
		flex: 1 0 auto;
		line-height: 1.5;
		max-height: 4rem;
		overflow: hidden;
		height: fit-content;
		display: block; /* or inline-block */
		text-overflow: ellipsis;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		width: fit-content;
	}

	button {
		color: var(--on-secondary-container);
		background: transparent;
		padding: 0 0.5rem;
		border: hidden;
		cursor: pointer;
		height: min-content;
	}

	h2 {
		margin: 0;
	}

	.reached-bottom {
		grid-column: span 3 / span 3;
		justify-self: center;
		text-align: center;
	}

	@media only screen and (max-width: 1500px) {
		section {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.featured.container {
			grid-column: span 2;
		}

		.reached-bottom {
			grid-column: span 2;
		}

		.featured.image-container {
			width: calc(50% - 1rem);
		}
	}

	@media only screen and (max-width: 1250px) {
		section {
			padding: 0 2rem;
		}
	}

	@media only screen and (max-width: 900px) {
		section {
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}

		.featured.container {
			grid-column: span 1;
		}

		.reached-bottom {
			grid-column: span 1;
		}
	}

	@media only screen and (max-width: 600px) {
		section {
			padding: 0 1rem;
		}
	}
</style>
