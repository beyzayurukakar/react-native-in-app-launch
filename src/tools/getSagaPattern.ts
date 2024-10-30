import type { PayloadAction } from '@reduxjs/toolkit';
import type { SetJobStatusPayload } from '../store/types';
import { slice } from '../store/slice';

export const getSagaPattern = (jobName: string) => (action: any) => {
    const _action = action as PayloadAction<SetJobStatusPayload>;
    return (
        _action.type === slice.actions.setJobStatus.type &&
        _action.payload.jobName === jobName &&
        _action.payload.status === false
    );
};
