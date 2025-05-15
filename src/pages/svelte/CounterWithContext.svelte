<script lang="ts">
	import Counter from './Counter.svelte'
	import { getContext } from './store'
	const store = getContext()
</script>

<Counter {store} />
