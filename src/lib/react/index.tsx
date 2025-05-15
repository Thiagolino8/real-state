import { createContext, use, useState, useSyncExternalStore, type ReactNode } from 'react'
import {
	Store,
	type ActionsInitializer,
	type BaseActions,
	type BaseState,
	type Compare,
	type Selector,
} from '../vanilla'

const storeExists = <State extends BaseState, Actions extends BaseActions>(
	store: Store<State, Actions> | null | undefined
) => {
	if (!store) throw new Error('set a provider upwards in your component tree')
	return store
}

export const transformStoreIntoHook = <State extends BaseState, Actions extends BaseActions>(
	store: Store<State, Actions>
) => {
	const useStore = <Slice = State,>(selector?: Selector<State, Slice>, compare?: Compare<Slice>) =>
		useSyncExternalStore(
			(listener) => (selector ? store.subscribe.withSelector(selector, listener, compare) : store.subscribe(listener)),
			() => (selector ? selector(store.state) : ({ ...store.state } as unknown as Slice)),
			() => (selector ? selector(store.state) : ({ ...store.state } as unknown as Slice))
		)

	return Object.assign(useStore, {
		get state() {
			return store.state
		},
		get actions() {
			return store.actions
		},
		subscribe: store.subscribe,
	})
}

export const createHook = <State extends BaseState, Actions extends BaseActions>(
	state: State,
	actions: ActionsInitializer<State, Actions>
) => {
	const store = new Store(state, actions)
	return transformStoreIntoHook(store)
}

export const createWithProvider = <State extends BaseState, Actions extends BaseActions>(
	defaultState: State,
	defaultActions: ActionsInitializer<State, Actions>
) => {
	const Context = createContext<Store<State, Actions> | null>(null)
	return {
		Provider({
			children,
			state,
			actions,
		}: {
			children: ReactNode
			state?: State
			actions?: ActionsInitializer<State, Actions>
		}) {
			const [store] = useState(
				() =>
					new Store(
						Object.defineProperties({} as State, Object.getOwnPropertyDescriptors(state ?? defaultState)),
						actions ?? defaultActions
					)
			)
			return <Context value={store}>{children}</Context>
		},
		useStore: <Slice = State,>(selector?: Selector<State, Slice>, compare?: Compare<Slice>) =>
			transformStoreIntoHook(storeExists(use(Context)))(selector, compare),
		useStoreActions: () => storeExists(use(Context)).actions,
	}
}
