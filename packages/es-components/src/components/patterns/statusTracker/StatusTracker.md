The `StatusTracker` component is used to display success or failure along a given set of steps.

```
const planStates = ['First step', 'Second step', 'Third step', 'Fourth step'];

<StatusTracker statusArray={planStates} step={3} />
```

The `isErrorState` prop will display the current step with an error status, showing that progress
can no longer continue.

```
import Icon from '../../base/icons/Icon';

const planStates = [
  <span><Icon name="cog" size={22} /> First Step</span>,
  <span><Icon name="cog" size={22} style={{fontWeight:'normal'}} /> Second Step</span>,
  <span><Icon name="bell" size={22} /> Third Step</span>
];

<StatusTracker statusArray={planStates} step={2} isErrorState={true} />
```
