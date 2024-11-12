import type { PayloadAction } from '@reduxjs/toolkit';
import type { SetJobStatusPayload } from '../store/types';
import { slice } from '../store/slice';

/**
 * @param dependedJobName Depended job's unique name
 * @returns {(action: any) => boolean} A Redux Saga pattern function to pass to a saga effect creator.
 */
export const getSagaPattern = (dependedJobName?: string) => (action: any) => {
    // Match initialization
    if (dependedJobName === undefined) {
        return action.type === slice.actions.initialize.type;
    }

    // Match completion of depended job
    const _action = action as PayloadAction<SetJobStatusPayload>;
    return (
        _action.type === slice.actions.setJobStatus.type &&
        _action.payload?.jobName === dependedJobName &&
        _action.payload?.status === false
    );
};
