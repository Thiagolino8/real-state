import { Actions } from './Actions'
import { Count } from './Count'
import { IsDivisibleByThree } from './IsDivisibleByThree'
import { useStore } from './store'

export const Counter = () => (
	<Actions actions={useStore.actions}>
		<Count useStore={useStore} />
		<IsDivisibleByThree useStore={useStore} />
	</Actions>
)
