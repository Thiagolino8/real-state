/** @jsxImportSource solid-js */
import { createMutable } from 'solid-js/store'
import { Store as VanillaStore, type ActionsInitializer, type BaseActions, type BaseState } from '../vanilla'
import { readOnlyProxy } from '../internal'
import { createContext, createEffect, createSignal, untrack, useContext, onCleanup, type JSX } from 'solid-js'

const storeExists = <State extends BaseState, Actions extends BaseActions>(
	store: Store<State, Actions> | null | undefined
) => {
	if (!store) throw new Error('set a provider upwards in your component tree')
	return store
}

export class Store<State extends BaseState, Actions extends BaseActions> extends VanillaStore<State, Actions> {
	#state: State

	constructor(defaultState: State, actions: ActionsInitializer<State, Actions>) {
		const state = createMutable(defaultState)
		super(state, actions)
		this.#state = readOnlyProxy(state)
	}

	getState(): State {
		return this.#state
	}
}

export const createWithProvider = <State extends BaseState, Actions extends BaseActions>(
	defaultState: State,
	defaultActions: ActionsInitializer<State, Actions>
) => {
	const Context = createContext<Store<State, Actions> | null>(null)
	return {
		Provider: (props: { children: JSX.Element; state?: State; actions?: ActionsInitializer<State, Actions> }) => {
			const store = new Store(
				Object.defineProperties({} as State, Object.getOwnPropertyDescriptors(props.state ?? defaultState)),
				props.actions ?? defaultActions
			)
			return <Context.Provider value={store}>{props.children}</Context.Provider>
		},
		useStore: () => storeExists(useContext(Context)),
	}
}

export function createSubscriber(start: (update: () => void) => (() => void) | void) {
	let subscribers = 0
	const [version, setVersion] = createSignal(0)
	/** @type {(() => void) | void} */
	let stop: (() => void) | void

	return () => {
		version() // track signal
		createEffect(() => {
			if (subscribers === 0) {
				stop = untrack(() =>
					start(() => {
						setVersion((v) => v + 1)
					})
				)
			}

			subscribers += 1

			onCleanup(() => {
				queueMicrotask(() => {
					subscribers -= 1

					if (subscribers === 0) {
						stop?.()
						stop = undefined
					}
				})
			})
		})
	}
}

export const getReactiveValue = <State extends BaseState, Actions extends BaseActions, Slice = State>(
	store: VanillaStore<State, Actions>,
	selector?: (state: State) => Slice,
	compare?: (a: Slice, b: Slice) => boolean
) => {
	const subscriber = createSubscriber((update) =>
		selector ? store.subscribe.withSelector(selector, update, compare) : store.subscribe(update)
	)

	return () => {
		subscriber()
		return selector ? selector(store.state) : store.state
	}
}
