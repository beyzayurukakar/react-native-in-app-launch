import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';
import type { SetJobStatusPayload } from '../store/types';

export const inAppLaunchPredicate =
    (...dependedJobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (dependedJobNames.length === 0) {
            const returning = action.type === slice.actions.initialize.type;
            return returning;
        }
        if (action.type === slice.actions.setJobStatus.type) {
            const _action = action as PayloadAction<SetJobStatusPayload>;
            if (
                dependedJobNames.includes(_action.payload.jobName) &&
                _action.payload.status === false
            ) {
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
