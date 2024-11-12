# react-native-in-app-launch

A React Native library that helps with managing the order of completion of essential jobs required before entering a mobile app. It’s designed to handle both synchronous and asynchronous jobs, and jobs depending multiple other jobs.  

You can ensure that all necessary setup steps — such as data syncing, authorization checks, and configurations are completed smoothly before users proceed.

The library leverages RTK Listener Middleware to efficiently manage task dependencies and execution flow.  

## Content

- [Example](#example)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API](#api)
- [Inspection and Debugging](#inspection-and-debugging)
- [Contribution](#contribution)

## Example

## Installation

```sh
# NPM
npm install react-native-in-app-launch

# Yarn
yarn add react-native-in-app-launch
```

This library has `peerDependencies` listing for `@reduxjs/toolkit` and `react-redux`


## Setup
### Step 1: Configure Redux Toolkit and listener middleware
Please set up Redux Toolkit first. You can follow the configuration guide in this link:  
[Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)

Also create and add the listener middleware as guided here:  
[RTK API Reference: createListenerMiddleware](https://redux-toolkit.js.org/api/createListenerMiddleware)

If you also use Redux Saga, you can add both the listener middleware and saga middleware as below:
```typescript
const store = configureStore({
    reducer: reducers,

    // HERE:
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware).prepend(sagaMiddleware), 
});
```


### Step 2: Add In-App-Launch reducer to Redux store

Import inAppLaunchSlice and add the reducer in your store configuration:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchSlice } from 'react-native-in-app-launch';

const store = configureStore({
  reducer: {
    // ... other reducers ...

    // HERE:
    [inAppLaunchSlice.name]: inAppLaunchSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) => {
    //...
  }
});
```

### Step 3: Register the In-App-Launch listeners

In-App-Launch needs to start listening for certain actions and state changes to work as expected. To do this, call `registerInAppLaunchListeners` with the listener middleware instance of your project. 

Make sure this function is called **before the launch process is initialized** (See: [Launch Indicator](#1-launch-indicator) for initialization).

```typescript
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { registerInAppLaunchListeners } from 'react-native-in-app-launch';

const listenerMiddleware = createListenerMiddleware();

// HERE:
registerInAppLaunchListeners(listenerMiddleware);
```

## Usage

### 1. Launch Indicator

In the launch indicator component (for example, a screen component with a launch animation), use the `useManageLaunch` hook for allowing the library to initialize the jobs when this component is mounted and complete the process when all the jobs are done:

```typescript
import { useManageLaunch } from 'react-native-in-app-launch';

const LaunchScreen = () => {

    // HERE:
    useManageLaunch();

    return <LaunchAnimation />;
};
```

If you have an animation and you do not want to mark the launch process 'completed' before the animation is finished, you can pass a stateful boolean parameter to the hook. It won't complete the launch process before the animation ends:

```typescript
import { useManageLaunch } from 'react-native-in-app-launch';

const LaunchScreen = () => {
    const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);

    useManageLaunch({
        // HERE:
        isAnimationComplete,
    });

    return (
        <LaunchAnimation onAnimationEnd={() => setIsAnimationComplete(true)} />
    );
};
```

_See in Example App: `src/components/launch/Launch.tsx`_

### 2. Job Lifecycle and Interdependency

#### With RTK listener middleware

You can call the `getListenerPredicate` utility function to obtain a listener middleware predicate. You can use this predicate to start listening for launch initialization or for the completion of depended jobs.

```typescript
listenerMiddleware.startListening({
    predicate: getListenerPredicate(), // HERE
    effect: (action, api) => {
        // ...
    },
});
```

To listen for launch initialization, pass no parameters:
```typescript
getListenerPredicate();
```

To listen for completion of a job, pass job's name:

```typescript
getListenerPredicate('depended-job');
```

To listen for completion of multiple jobs, pass the names of those jobs:

```typescript
getListenerPredicate('depended-job-A', 'depended-job-B', '...');
```
___
  
You also need to **update the status of a job** in the In-App-Launch state. To do this, just dispatch start and end actions using the `inAppLaunchSlice` in your effect:

```typescript
listenerMiddleware.startListening({
    predicate: getListenerPredicate(),
    effect: (action, api) => {
        api.dispatch(inAppLaunchSlice.actions.jobStarted('this-job')); // HERE
        // Handle the job ...
        api.dispatch(inAppLaunchSlice.actions.jobEnded('this-job')); // HERE
    },
});
```

** It is perfectly okay to use async effects.

_See in Example App: `src/jobs/jobA & jobB & jobC & jobD`_

#### With Redux Saga

You can call the `getSagaPattern` utility function to obtain a saga `pattern` function. You can use this function to watch for launch initialization or for the completion of depended jobs.

```typescript
function* watchInAppLaunch() {
    yield takeEvery(
        getSagaPattern(), // HERE
        workerForThisJob
    );
}
```

To watch for launch initialization, pass no parameters:
```typescript
getSagaPattern()
```

To watch for completion of a job, pass job's name:

```typescript
getSagaPattern('depended-job');
```

To watch for completion of multiple jobs, you can construct an effect to call your worker saga when all these jobs are completed:

```typescript
function* watchInAppLaunch() {
    yield all([
        take(getSagaPattern('depended-job-A')), 
        take(getSagaPattern('depended-job-B')), 
        // ...
    ]);
    yield call(workerForThisJob);
}
```

* You also need to update the status of a job in the In-App-Launch state. To do this, just dispatch start and end actions using the `inAppLaunchSlice` in your worker saga:

```typescript
function* workerForThisJob() {
    yield put(inAppLaunchSlice.actions.jobStarted('this-job')); // HERE
    // Handle the job ...
    yield put(inAppLaunchSlice.actions.jobEnded('this-job')); // HERE
}

function* watchInAppLaunchForThisJob() {
    yield takeEvery(getSagaPattern(), workerForThisJob);
}
```

_See in Example App: `src/jobs/jobE & jobF & jobG`_

### 3. Proceeding into app

You can use the `useIsLaunchComplete` hook to manage what you would like to do when the launch process is completed.

For example:

```typescript
const RootContainer = () => {
    const isLaunchComplete = useIsLaunchComplete(); // HERE

    if (isLaunchComplete) {
        return <Home />;
    }

    return <Launch />;
}
```

Or with React Navigation:

```typescript
const RootNavigator = () => {
    const isLaunchComplete = useIsLaunchComplete(); // HERE

    const renderNavigator = () => {
        if (isLaunchComplete) {
            return <AppNavigator />;
        }

        return <LaunchNavigator />;
    }

    return (
        <NavigationContainer>
            {renderNavigator()}
        </NavigationContainer>
    )
}
```

_See in Example App: `src/RootContainer.tsx`_

### 4. Resetting
You might need to reset In-App-Launch state to its default value, for example when the user logs out and logs in again and you need to re-run all jobs.

To do this, just dispatch the reset action of In-App-Launch slice:

```typescript
import { inAppLaunchSlice } from 'react-native-in-app-launch';

dispatch(inAppLaunchSlice.actions.reset);
```

## Inspection and Debugging

For inspection and debugging purposes, there are some selectors for In-App-Launch state:

```typescript
import { inAppLaunchSelectors } from 'react-native-in-app-launch';
```

See [API Section](#api) for more detail.

## API

### Tools

#### `useManageLaunch`

```typescript
const useManageLaunch: (options: ManageLaunchOptions) => void;

type ManageLaunchOptions = {
    isAnimationComplete?: boolean;
};
```

Parameters:
* `options`: Options object with properties:
    * `isAnimationComplete`: Launch status will not be set to 'completed' until this value is `true`. Default value is `true`.

#### `useIsLaunchComplete`

```typescript
const useIsLaunchComplete: () => boolean;
```

Returns:  
`true` if launch status is 'completed'.

#### `getListenerPredicate`

```typescript
const getListenerPredicate: (...dependedJobNames: string[]) => AnyListenerPredicate<any>;
```

Parameters:
* `...dependedJobNames`: Unique names of depended jobs

Returns:  
A predicate function for RTK Listener Middleware


#### `getSagaPattern`

```typescript
const getSagaPattern: (dependedJobName?: string) => (action: any) => boolean;
```

Parameters:
* `dependedJobName`: Depended job's unique name

Returns:  
A Redux Saga pattern function to pass to a saga effect creator.

### `inAppLaunchSlice`

```typescript
const inAppLaunchSlice: {
    name: "inAppLaunch";
    reducer: Reducer<InAppLaunchState>;
    actions: {
        jobStarted: ActionCreatorWithPayload<string, "inAppLaunch/jobStarted">;
        jobEnded: ActionCreatorWithPayload<string, "inAppLaunch/jobEnded">;
        reset: ActionCreatorWithoutPayload<"inAppLaunch/reset">;
    };
}
```

Actions:

* `jobStarted`: Sets the status of job to 'pending' (`true`)
* `jobEnded`: Sets the status of job to 'done' (`false`)
* `reset`: Resets all state to default


### `registerInAppLaunchListeners`

```typescript
const registerListeners: (listenerMiddleware: ListenerMiddlewareInstance) => void;
```

Starts listeners of In-App-Launch.


### `inAppLaunchSelectors`

```typescript
const inAppLaunchSelectors: {
    /** Is the launch initialized */
    isInitialized: (state: RootState) => boolean;
    /** Is the launch waiting/listening for jobs */
    isWaitingForJobs: (state: RootState) => boolean;
    /** Are all the jobs done and no jobs will be added */
    areAllJobsDone: (state: RootState) => boolean;
    /** Is the launch completed */
    isLaunchComplete: (state: RootState) => boolean;
    /** How many jobs are pending */
    pendingJobsCount: (state: RootState) => number;
    /** Status of a single job */
    jobStatus: (state: RootState, jobName: string) => boolean | undefined;
    /** List of pending jobs */
    pendingJobs: (state: RootState) => string[];
    /** List of completed jobs */
    completedJobs: (state: RootState) => string[];
    /** Are the jobs in the given list all done */
    isJobArrCompleted: (state: RootState, jobNames: string[]) => boolean;
};
```

#### Launch status values during launch lifecycle:

| (Launch Status)   | Not initialized | Pending | All Jobs Done | Launch Completed |
| ----------------- | --------------- | ------- | ------------- | ---------------- |
| isInitialized     | false           | true    | true          | true             |
| isWaitingForJobs  | false           | true    | false         | false            |
| areAllJobsDone    | false           | false   | true          | true             |
| isLaunchComplete  | false           | false   | false         | true             |



#### Job status values during job lifecycle:

|           | Not started | Pending | Done  |
| --------- | ----------- | ------- | ----- |
| jobStatus | undefined   | true    | false |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
