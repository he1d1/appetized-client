import { config } from '../stores';

let url;

config.subscribe((value) => {
	url = value.SERVER_URL;
});

type gqlCallback = (data: any, errors: any | undefined) => void;
type gqlFetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export const gql = async (body: any, callback?: gqlCallback, fetch?: gqlFetch): Promise<void> => {
	fetch = fetch ?? window.fetch;
	await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: JSON.stringify({ query: body.query, variables: JSON.stringify(body.variables) })
	})
		.then((res) => res.json())
		.then((res) => callback(res.data, res.errors));
};
