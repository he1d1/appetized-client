import { writable } from 'svelte/store';
// Reads config from ../config.json

// Settings Object
export interface Settings {
	dark?: boolean;
}

export const config = writable({
	SERVER_URL: 'http://localhost:4000'
});

// Object containing the user's preferences.
export const settings = writable({
	// Dark being set to null means that the browser's default is used.
	dark: null
} as Settings);

export const prefersDark = writable(false);
export const dark = writable(true);

export const authed = writable(false);
export const user = writable({
	id: undefined,
	name: undefined,
	username: undefined,
	joinDate: undefined,
	editDate: undefined,
	profilePicture: undefined,
	uploadedRecipes: undefined,
	following: undefined,
	followers: undefined,
	savedRecipes: undefined
});
export const fab = writable(function () {
	console.log('fab');
});
