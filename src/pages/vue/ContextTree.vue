<script setup lang="ts">
import CounterWithContext from './CounterWithContext.vue'
import Provider from './Provider.vue'
</script>

<template>
	<Provider>
		<CounterWithContext />
	</Provider>
	<Provider>
		<CounterWithContext />
	</Provider>
</template>