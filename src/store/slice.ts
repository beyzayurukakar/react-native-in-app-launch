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
        },
        completeInAppLaunch: (state) => {
            state.isLaunchComplete = true;
        },
        reset: () => ({ ...INITIAL_STATE }),
        addToPendingJobs: (state, action: PayloadAction<string>) => {
            // If launch is already complete, no-op
            const isLaunchComplete = state.isLaunchComplete;
            if (isLaunchComplete) {
                return;
            }

            const jobName = action.payload;
            const currentStatusOfJob = state.jobStatusDict[jobName];

            // Check if job was not already pending
            if (currentStatusOfJob === undefined || currentStatusOfJob === false) {
                // Set job's 'pending' status to true
                state.jobStatusDict[jobName] = true;
                state.pendingJobsCount++;
            } else {
                console.warn('TODO: this job already added', jobName);
            }
        },
        removeFromPendingJobs: (state, action: PayloadAction<string>) => {
            // If launch is already complete, no-op
            const isLaunchComplete = state.isLaunchComplete;
            if (isLaunchComplete) {
                return;
            }

            const jobName = action.payload;
            const currentStatusOfJob = state.jobStatusDict[jobName];

            // Check if job was pending
            if (currentStatusOfJob === true) {
                // Set job's 'pending' status to false
                state.jobStatusDict[jobName] = false;
                state.pendingJobsCount--;
            } else {
                console.warn('TODO: this job already removed', jobName);
            }
        },
    },
    extraReducers: (builder) => {
        if (inAppLaunchConfig.globalResetActionType) {
            builder.addCase(inAppLaunchConfig.globalResetActionType, () => {
                return { ...INITIAL_STATE };
            });
        }
    },
});
