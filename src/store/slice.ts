import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { inAppLaunchConfig } from '../config/configuration';
import type { InAppLaunchState, SetJobStatusPayload } from './types';
import { SLICE_NAME } from './constants';

const INITIAL_STATE: InAppLaunchState = {
    isInitialized: false,
    isAnyJobPending: false,
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
            state.isAnyJobPending = true;
        },
        setPendingJobsCount: (state, action: PayloadAction<number>) => {
            state.pendingJobsCount = action.payload;
        },
        setAllJobsDone: (state) => {
            state.isAnyJobPending = false;
            state.areAllJobsDone = true;
        },
        setJobStatus: (state, action: PayloadAction<SetJobStatusPayload>) => {
            const jobName = action.payload.jobName;
            const newStatus = action.payload.status;
            const previousStatus = state.jobStatusDict[jobName];
            if (newStatus !== previousStatus) {
                state.jobStatusDict[jobName] = newStatus;
                if (newStatus === true) {
                    state.pendingJobsCount++;
                } else {
                    state.pendingJobsCount--;
                }
            }
        },
        completeInAppLaunch: (state) => {
            state.isLaunchComplete = true;
        },
        reset: () => ({ ...INITIAL_STATE }),
        // Handled by listener
        addToPendingJobs: (_state, _action: PayloadAction<string>) => {},
        // Handled by lsitener
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
