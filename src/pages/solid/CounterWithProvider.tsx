/** @jsxImportSource solid-js */
import { Counter } from './Counter'
import { useStore } from './store'

export const CounterWithProvider = () => {
	const store = useStore()
	return <Counter store={store} />
}
