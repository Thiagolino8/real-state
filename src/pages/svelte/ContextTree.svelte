<script lang="ts">
	import CounterWithContext from './CounterWithContext.svelte'
	import { setContext } from './store'
</script>

{#snippet provider()}
	{@const _ = setContext()}
	<CounterWithContext />
{/snippet}

{@render provider()}
{@render provider()}
