import { createHook, createWithProvider } from '../../lib/react'

export const useStore = createHook(
	{
		count: 0,
		get isDivisibleByThree() {
			return this.count % 3 === 0
		},
	},
	(get, set) => ({
		increment: () => set({ count: get.count + 1 }),
		decrement: () => set({ count: get.count - 1 }),
	})
)

export const {
	Provider,
	useStore: useContextStore,
	useStoreActions,
} = createWithProvider(
	{
		count: 0,
		get isDivisibleByThree() {
			return this.count % 3 === 0
		},
	},
	(get, set) => ({
		increment: () => set({ count: get.count + 1 }),
		decrement: () => set({ count: get.count - 1 }),
	})
)
