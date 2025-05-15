import type { useContextStore } from './store'

export const IsDivisibleByThree = ({ useStore }: { useStore: typeof useContextStore }) => {
	const isDivisibleByThree = useStore((state) => state.isDivisibleByThree)

	return <p>{isDivisibleByThree ? 'Divisible by 3' : 'Not divisible by 3'}</p>
}
