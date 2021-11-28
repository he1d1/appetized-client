import { writable } from 'svelte/store';

// Settings Object
export interface Settings {
	dark?: boolean;
}

// Object containing the user's preferences.
export const settings = writable({
	// Dark being set to null means that the browser's default is used.
	dark: null
} as Settings);

export const prefersDark = writable(false);
export const dark = writable(true);
