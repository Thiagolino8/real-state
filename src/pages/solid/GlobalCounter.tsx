/** @jsxImportSource solid-js */
import { Counter } from './Counter'
import { store } from './store'

export const GlobalCounter = () => <Counter store={store} />
