<script lang="ts">
	import Counter from './Counter.svelte'
	import { store } from './store'
</script>

<Counter {store} />
