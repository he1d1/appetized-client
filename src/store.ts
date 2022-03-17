import { Writable, writable } from 'svelte/store';
import type { SvelteComponent } from 'svelte';

export const authed: Writable<boolean | null> = writable(null);
export const connected: Writable<boolean | null> = writable(null);
export const currentRoute: Writable<{
	name?: string;
	route: string;
	buttons: {
		component?: SvelteComponent;
		click?: () => void;
		noIconButton?: boolean;
	}[];
} | null> = writable(null);
export const modal: Writable<{
	closable: boolean;
	title: string;
	danger: boolean;
	actions: { buttonType: string; disabled?: boolean; label: string; click: () => Promise<void> }[];
	content?: string;
	component?: SvelteComponent;
}> = writable(undefined);
export const bindComponent: Writable<SvelteComponent | null> = writable(null);
