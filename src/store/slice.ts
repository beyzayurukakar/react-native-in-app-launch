import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { inAppLaunchConfig } from '../config/config';
import type { InAppLaunchState, SetJobStatusPayload } from './types';
import { SLICE_NAME } from './constants';

const INITIAL_STATE: InAppLaunchState = {
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
        setPendingJobsCount: (state, action: PayloadAction<number>) => {
            state.pendingJobsCount = action.payload;
        },
        setAllJobsDone: (state) => {
            state.isWaitingForJobs = false;
            state.areAllJobsDone = true;
        },
        setJobStatus: (state, action: PayloadAction<SetJobStatusPayload>) => {
            const jobName = action.payload.jobName;
            const status = action.payload.status;
            state.jobStatusDict[jobName] = status;
        },
        completeInAppLaunch: (state) => {
            state.isLaunchComplete = true;
        },
        reset: () => ({ ...INITIAL_STATE }),
        // handled by listener
        addToPendingJobs: (_state, _action: PayloadAction<string>) => {},
        // handled by listener
        removeFromPendingJobs: (_state, _action: PayloadAction<string>) => {},
    },
    extraReducers: (builder) => {
        if (inAppLaunchConfig.globalResetActionType) {
            builder.addCase(inAppLaunchConfig.globalResetActionType, () => {
                return { ...INITIAL_STATE };
            });
        }
    },
});
