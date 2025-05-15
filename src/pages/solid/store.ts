/** @jsxImportSource solid-js */
import { Store, createWithProvider } from '../../lib/solid'

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

export const { Provider, useStore } = createWithProvider(
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
