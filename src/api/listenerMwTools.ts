import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';

export const inAppLaunchPredicate =
    (...dependedJobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (dependedJobNames.length === 0) {
            const returning = action.type === slice.actions.initialize.type;
            return returning;
        }
        if (action.type === slice.actions.removeFromPendingJobs.type) {
            const _action = action as PayloadAction<string>;
            if (dependedJobNames.includes(_action.payload)) {
                const areDependedJobsDone = selectors.isJobArrCompleted(
                    currentState,
                    dependedJobNames
                );
                return areDependedJobsDone;
            }
        }

        return false;
    };

const listenerMwTools = {
    inAppLaunchPredicate,
    addToPendingJobsAction: slice.actions.addToPendingJobs,
    removeFromPendingJobsAction: slice.actions.removeFromPendingJobs,
};

export default listenerMwTools;
