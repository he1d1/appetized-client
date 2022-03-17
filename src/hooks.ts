import { authed as authedStore, connected as connectedStore } from './store';
import type { RequestEvent } from '@sveltejs/kit/types/private';

export async function getSession(event: RequestEvent) {
	// If the user does not have a refresh token it is not possible for them to be authenticated
	const hasRefreshToken: boolean = event.request.headers.get('cookie')?.includes('refreshToken');

	if (!hasRefreshToken) {
		authedStore.set(false);
		// Returns empty session due to the user not being authenticated
		return {};
	}

	// If the user has a refresh token, they may be authenticated
	// Requesting the user from the server will ensure that the user is still valid

	const response:
		| { data: { user: { id: string } | { code: number; message: string } } }
		| {
				// Apollo server error
				errors: {
					extensions: {
						code: number;
						exception: { message: string };
					};
				}[];
		  } = await fetch('http://localhost:4000', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Cookie: event.request.headers.get('cookie')
		},
		body: JSON.stringify({
			query: `
				query User {
				  user {
					... on User {
					  id
					  name
					  username
					  profilePicture {
						url
					  }
				        recipesCount
				        followerCount
				        followingCount
						savedRecipes {
						id
					}
					}
					... on Error {
					  code 
					  message
					}
				  }
				}
			`
		})
	}).then((response) => response.json());

	console.log(response);

	if ('errors' in response) {
		// If Apollo server returns an error, there is a problem with the server or the client
		// The user is not authenticated
		// The user's connection is not valid
		authedStore.set(false);
		connectedStore.set(false);
		return {};
	}

	// If the custom error type is returned, the user is not authenticated
	if ('code' in response.data.user) {
		authedStore.set(false);
		return {};
	}

	// If the user is authenticated, set the authedStore to true
	// The user is connected
	authedStore.set(true);
	connectedStore.set(true);

	return {
		user: {
			...response.data.user
		}
	};
}

export async function externalFetch(request: Request) {
	const response = await fetch(request);

	if (response.status === 500) {
		connectedStore.set(false);
	}

	return response;
}
