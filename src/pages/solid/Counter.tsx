/** @jsxImportSource solid-js */
import type { store as Store } from './store'

export const Counter = (props: { store: typeof Store }) => (
	<div>
		<button type='button' onClick={props.store.actions.increment}>
			+
		</button>
		<p>{props.store.state.count}</p>
		<p>{props.store.state.isDivisibleByThree ? 'Divisible by 3' : 'Not divisible by 3'}</p>
		<button type='button' onClick={props.store.actions.decrement}>
			-
		</button>
	</div>
)
