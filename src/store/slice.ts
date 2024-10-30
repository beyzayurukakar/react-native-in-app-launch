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
    extraReducers: (builder) => {
        if (inAppLaunchConfig.globalResetActionType) {
            builder.addCase(inAppLaunchConfig.globalResetActionType, () => {
                return { ...INITIAL_STATE };
            });
        }
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
