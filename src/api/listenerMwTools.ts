import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';

export const jobDependencyPredicate =
    (...jobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (jobNames.length === 0) {
            const returning = action.type === slice.actions.initialize.type;
            return returning;
        }
        if (action.type === slice.actions.removeFromPendingJobs.type) {
            const _action = action as PayloadAction<string>;
            if (jobNames.includes(_action.payload)) {
                const areDependedJobsDone = selectors.isJobArrCompleted(currentState, jobNames);
                return areDependedJobsDone;
            }
        }

        return false;
    };

const listenerMwTools = {
    jobDependencyPredicate,
    addToPendingJobsAction: slice.actions.addToPendingJobs,
    removeFromPendingJobsAction: slice.actions.removeFromPendingJobs,
};

export default listenerMwTools;
