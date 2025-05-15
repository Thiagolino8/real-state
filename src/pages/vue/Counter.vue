<script setup lang="ts">
import type { store as SvelteStore } from './store'
const { store } = defineProps<{ store: typeof SvelteStore }>()
</script>

<template>
	<div>
		<button type="button" @click="store.actions.increment">+</button>
		<p>{{ store.state.count }}</p>
		<p>{{ store.state.isDivisibleByThree ? 'Divisible by 3' : 'Not divisible by 3' }}</p>
		<button type="button" @click="store.actions.decrement">-</button>
	</div>
</template>