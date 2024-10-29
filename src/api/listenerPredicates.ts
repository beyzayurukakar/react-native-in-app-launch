import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';
import type { SetJobStatusPayload } from '../store/types';

export const jobListenerPredicate =
    (...jobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (action.type === slice.actions.setJobStatus.type) {
            const _action = action as PayloadAction<SetJobStatusPayload>;
            if (jobNames.includes(_action.payload.jobName) && _action.payload.status === false) {
                const areDependedJobsDone = selectors.isJobArrCompleted(currentState, jobNames);
                return areDependedJobsDone;
            }
        }

        return false;
    };
