/** @jsxImportSource solid-js */
import { CounterWithProvider } from './CounterWithProvider'
import { Provider } from './store'

export const ContextTree = () => (
	<>
		<Provider>
			<CounterWithProvider />
		</Provider>
		<Provider>
			<CounterWithProvider />
		</Provider>
	</>
)
