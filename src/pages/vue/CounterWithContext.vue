<script setup lang="ts">
import Counter from './Counter.vue'
import { useStore } from './store'
const store = useStore()
</script>

<template>
	<Counter :store />
</template>