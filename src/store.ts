import { Writable, writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

export const authed: Writable<boolean | null> = writable(null);
export const connected: Writable<boolean | null> = writable(null);
export const currentRoute: Writable<{
	name?: string;
	route: string;
	buttons: SvelteComponent[];
} | null> = writable(null);
export const modal: Writable<{
	closable: boolean;
	title: string;
	danger: boolean;
	actions: { buttonType: string; label: string; click: () => Promise<void> }[];
	content?: string;
	component?: SvelteComponent;
}> = writable(undefined);
