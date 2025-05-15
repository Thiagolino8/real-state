<script lang="ts">
	import type { store as SvelteStore } from './store'
	const { store }: { store: typeof SvelteStore } = $props()
</script>

<div>
	<button type="button" onclick={store.actions.increment}>+</button>
	<p>{store.state.count}</p>
	<p>{store.state.isDivisibleByThree ? 'Divisible by 3' : 'Not divisible by 3'}</p>
	<button type="button" onclick={store.actions.decrement}>-</button>
</div>
