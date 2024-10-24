import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';
import type { SetJobStatusPayload } from '../store/types';

const multiple =
    (...jobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (action.type === slice.actions.setJobStatus.type) {
            const _action = action as PayloadAction<SetJobStatusPayload>;
            if (jobNames.includes(_action.payload.jobName) && _action.payload.status === false) {
                const areDependedJobsDone = selectors.isJobArrCompleted(...jobNames)(currentState);
                return areDependedJobsDone;
            }
        }

        return false;
    };

const single =
    (jobName: string): AnyListenerPredicate<any> =>
    (action) => {
        if (action.type === slice.actions.setJobStatus.type) {
            const _action = action as PayloadAction<SetJobStatusPayload>;
            return _action.payload.jobName === jobName && _action.payload.status === false;
        }

        return false;
    };

const jobDependencyPredicates = {
    multiple,
    single,
};

export default jobDependencyPredicates;
