import { getContext, setContext } from 'svelte'
import { readOnlyProxy } from '../internal'
import {
	Store as VanillaStore,
	type ActionsInitializer,
	type BaseActions,
	type BaseState,
	type Selector,
} from '../vanilla'
import { createSubscriber } from 'svelte/reactivity'

export const storeExists = <State extends BaseState, Actions extends BaseActions>(
	store: Store<State, Actions> | null | undefined
) => {
	if (!store) throw new Error('set a provider upwards in your component tree')
	return store
}

export class Store<State extends BaseState, Actions extends BaseActions> extends VanillaStore<State, Actions> {
	#state: State
	constructor(initialState: State, actions: ActionsInitializer<State, Actions>) {
		const state = $state(initialState)
		super(state, actions)
		this.#state = readOnlyProxy(super.state)
	}

	get state() {
		return this.#state
	}
}

export const createWithContext = <State extends BaseState, Actions extends BaseActions>(
	defaultState: State,
	defaultActions: ActionsInitializer<State, Actions>
) => {
	const key = Symbol()
	return {
		setContext: (state?: State, actions?: ActionsInitializer<State, Actions>) =>
			setContext(key, new Store(state ?? defaultState, actions ?? defaultActions)),
		getContext: () => storeExists(getContext<Store<State, Actions> | null>(key)),
	}
}

export const getReactiveValue = <State extends BaseState, Actions extends BaseActions, Slice = State>(
	store: VanillaStore<State, Actions>,
	selector?: Selector<State, Slice>,
	compare?: (a: Slice, b: Slice) => boolean
) => {
	const subscriber = createSubscriber((update) =>
		selector ? store.subscribe.withSelector(selector, update, compare) : store.subscribe(update)
	)

	return {
		get current() {
			subscriber()
			return selector ? selector(store.state) : store.state
		},
	}
}
