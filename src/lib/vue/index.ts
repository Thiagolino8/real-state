import { customRef, inject, onScopeDispose, provide, reactive } from 'vue'
import {
	Store as VanillaStore,
	type ActionsInitializer,
	type BaseActions,
	type BaseState,
	type Selector,
} from '../vanilla'
import { readOnlyProxy } from '../internal'

const storeExists = <State extends BaseState, Actions extends BaseActions>(
	store: Store<State, Actions> | null | undefined
) => {
	if (!store) throw new Error('set a provider upwards in your component tree')
	return store
}

export class Store<State extends BaseState, Actions extends BaseActions> extends VanillaStore<State, Actions> {
	#state: State
	constructor(defaultState: State, actions: ActionsInitializer<State, Actions>) {
		const state = reactive(defaultState) as State
		super(state, actions)
		this.#state = readOnlyProxy(state)
	}

	get state() {
		return this.#state
	}
}

export const createWithProvider = <State extends BaseState, Actions extends BaseActions>(
	defaultState: State,
	defaultActions: ActionsInitializer<State, Actions>
) => {
	const key = Symbol()
	return {
		provide: (state?: State, actions?: ActionsInitializer<State, Actions>) =>
			provide(
				key,
				new Store(
					Object.defineProperties({} as State, Object.getOwnPropertyDescriptors(state ?? defaultState)),
					actions ?? defaultActions
				)
			),
		useStore: () => storeExists(inject<Store<State, Actions> | null>(key)),
	}
}

export const getReactiveValue = <State extends BaseState, Actions extends BaseActions, Slice = State>(
	store: VanillaStore<State, Actions>,
	selector?: Selector<State, Slice>,
	compare?: (a: Slice, b: Slice) => boolean
) =>
	customRef((track, trigger) => {
		onScopeDispose(selector ? store.subscribe.withSelector(selector, trigger, compare) : store.subscribe(trigger), true)

		return {
			get() {
				track()
				return selector ? selector(store.state) : store.state
			},
			set() {},
		}
	})
