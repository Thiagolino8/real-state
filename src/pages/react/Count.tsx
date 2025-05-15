import type { useContextStore } from './store'

export const Count = ({ useStore }: { useStore: typeof useContextStore }) => {
	const count = useStore((state) => state.count)

	return <p>{count}</p>
}
