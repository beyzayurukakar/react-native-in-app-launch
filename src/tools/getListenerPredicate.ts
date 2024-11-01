import type { AnyListenerPredicate, PayloadAction } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';
import type { SetJobStatusPayload } from '../store/types';

export const getListenerPredicate =
    (...dependedJobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState, originalState) => {
        if (dependedJobNames.length === 0) {
            return (
                action.type === slice.actions.initialize.type &&
                selectors.isInitialized(originalState) === false
            );
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
