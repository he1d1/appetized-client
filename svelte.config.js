import preprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import dotenv from 'dotenv';
dotenv.config();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: process.env.ADAPTER === 'VERCEL' ? vercel() : node({ out: 'out' })
	},
	ssr: true,
	prerender: {
		crawl: true,
		enabled: true,
		entries: ['*'],
		onError: 'fail'
	}
};

export default config;
