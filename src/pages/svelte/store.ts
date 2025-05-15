import { createWithContext, Store } from '../../lib/svelte'

export const store = new Store(
	{
		count: 0,
		get isDivisibleByThree() {
			return this.count % 3 === 0
		},
	},
	(state) => ({
		increment: () => {
			state.count++
		},
		decrement: () => {
			state.count--
		},
	})
)

store.on(['decrement'], (s) => console.log('decrement', s.count))
store.on(['*'], (s) => console.log('*', s.count))

export const { setContext, getContext } = createWithContext(
	{
		count: 0,
		get isDivisibleByThree() {
			return this.count % 3 === 0
		},
	},
	(state) => ({
		increment: () => {
			state.count++
		},
		decrement: () => {
			state.count--
		},
	})
)
