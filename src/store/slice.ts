import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InAppLaunchState, SetJobStatusPayload } from './types';
import { SLICE_NAME } from './constants';

export const INITIAL_STATE: InAppLaunchState = {
    isInitialized: false,
    isWaitingForJobs: false,
    areAllJobsDone: false,
    isLaunchComplete: false,
    jobStatusDict: {},
    pendingJobsCount: 0,
};

export const slice = createSlice({
    name: SLICE_NAME,
    initialState: INITIAL_STATE,
    reducers: {
        initialize: (state) => {
            state.isInitialized = true;
            state.isWaitingForJobs = true;
        },
        setAllJobsDone: (state) => {
            state.isWaitingForJobs = false;
            state.areAllJobsDone = true;
        },
        setJobStatus: (state, action: PayloadAction<SetJobStatusPayload>) => {
            const jobName = action.payload.jobName;
            const status = action.payload.status;
            state.jobStatusDict[jobName] = status;
            if (status === true) {
                state.pendingJobsCount++;
            } else {
                state.pendingJobsCount--;
            }
        },
        completeInAppLaunch: (state) => {
            state.isLaunchComplete = true;
        },
        reset: () => ({ ...INITIAL_STATE }),
        // Handled by listener
        jobStarted: (_state, _action: PayloadAction<string>) => {},
        // Handled by lsitener
        jobEnded: (_state, _action: PayloadAction<string>) => {},
    },
});

export const sliceExternal = {
    name: slice.name,
    reducer: slice.reducer,
    actions: {
        jobStarted: slice.actions.jobStarted,
        jobEnded: slice.actions.jobEnded,
    },
};
