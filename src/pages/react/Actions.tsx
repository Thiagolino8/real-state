import type { ReactNode } from 'react'
import type { useStoreActions } from './store'

export const Actions = ({
	actions,
	children,
}: {
	actions: ReturnType<typeof useStoreActions>
	children: ReactNode
}) => (
	<div>
		<button type='button' onClick={actions.increment}>
			+
		</button>
		{children}
		<button type='button' onClick={actions.decrement}>
			-
		</button>
	</div>
)
