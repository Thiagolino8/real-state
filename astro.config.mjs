// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import svelte from '@astrojs/svelte'

import solidJs from '@astrojs/solid-js'

import vue from '@astrojs/vue'

// https://astro.build/config
export default defineConfig({
	integrations: [
		react({
			include: ['**/react/**/*.{ts,tsx,jsx,js}'],
		}),
		svelte(),
		solidJs({
			include: ['**/solid/**/*.{ts,tsx,jsx,js}'],
		}),
		vue(),
	],
})
