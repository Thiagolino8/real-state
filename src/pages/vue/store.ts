import { createWithProvider, Store } from '../../lib/vue'

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

export const { provide, useStore } = createWithProvider(
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
