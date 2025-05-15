import { Actions } from './Actions'
import { Count } from './Count'
import { IsDivisibleByThree } from './IsDivisibleByThree'
import { useStoreActions, useContextStore } from './store'

export const CounterWithProvider = () => (
	<>
		<Actions actions={useStoreActions()}>
			<Count useStore={useContextStore} />
			<IsDivisibleByThree useStore={useContextStore} />
		</Actions>
	</>
)
