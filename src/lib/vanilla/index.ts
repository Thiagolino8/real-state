export type BaseState = Record<string, unknown>
export type BaseActions = Record<string, VoidFunction>
export type ActionsInitializer<State extends BaseState, Actions extends BaseActions> = (
	get: State,
	set: ((state: Partial<State>) => void) & { replace: (state: State) => void }
) => Actions
export type Selector<State, Slice> = (state: State) => Slice
export type Compare<Slice> = (a: Slice, b: Slice) => boolean

export class Store<State extends BaseState, Actions extends BaseActions> {
	#state_listeners = new Set<{
		selector: (state: State) => any
		listener: (state: any) => unknown
		previousValue?: any
		compare: (a: any, b: any) => boolean
	}>()
	#eventListeners = new Map<keyof Actions | '*', Set<(state: State) => unknown>>()
	#state: State
	#actions: Actions

	constructor(state: State, actions: ActionsInitializer<State, Actions>) {
		this.#state = state
		const setter = (state: Partial<State>) => this.#setState(state)
		const setterWithReplace = Object.assign(setter, { replace: (state: State) => this.#setState(state) })
		this.#actions = this.#set_event_listener_triggers(actions(this.#state, setterWithReplace))
	}

	get state() {
		return this.#state
	}

	get actions() {
		return this.#actions
	}

	#set_event_listener_triggers(actions: Actions) {
		return Object.fromEntries(
			Object.entries(actions).map(([key, value]) => [
				key,
				() => {
					value()
					this.#eventListeners.get(key)?.forEach((listener) => listener(this.state))
					this.#eventListeners.get('*')?.forEach((listener) => listener(this.state))
				},
			])
		) as Actions
	}

	on(eventList: (keyof Actions)[] | ['*'], callback: (state: State) => unknown) {
		const unsubs = eventList.map((event) => {
			const eventListeners = this.#eventListeners.get(event)
			if (!eventListeners) this.#eventListeners.set(event, new Set([callback]))
			else eventListeners.add(callback)
			return () => this.#eventListeners.get(event)?.delete(callback)
		})
		return () => unsubs.forEach((unsub) => unsub())
	}

	#subscribeWithSelector<Slice = State>(
		selector: Selector<State, Slice>,
		listener: (state: Slice) => unknown,
		compare: Compare<Slice> = (a: Slice, b: Slice) => a === b
	) {
		const listenerObj = {
			selector,
			listener,
			previousValue: selector(this.state),
			compare,
		}
		listener(selector(this.state))
		this.#state_listeners.add(listenerObj)

		return () => {
			this.#state_listeners.delete(listenerObj)
		}
	}

	#subscribe = Object.assign((listener: (state: State) => unknown) => this.#subscribeWithSelector((v) => v, listener), {
		withSelector: <Slice = State>(
			selector: Selector<State, Slice>,
			listener: (state: Slice) => unknown,
			compare?: Compare<Slice>
		) => this.#subscribeWithSelector(selector, listener, compare),
	})

	get subscribe() {
		return this.#subscribe
	}

	#notify() {
		this.#state_listeners.forEach((listenerObj) => {
			const { listener, selector, previousValue, compare } = listenerObj

			const currentValue = selector(this.state)
			if (currentValue !== previousValue && !compare?.(currentValue, previousValue)) {
				listenerObj.previousValue = currentValue
				listener(this.state)
			}
		})
	}

	#setState(state: Partial<State>) {
		Object.defineProperties(this.#state, Object.getOwnPropertyDescriptors(state))
		this.#notify()
	}
}
