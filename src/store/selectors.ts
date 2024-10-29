import { createSelector } from '@reduxjs/toolkit';
import { inAppLaunchConfig } from '../config/config';

const pendingJobsSelector = createSelector(
    (state) => inAppLaunchConfig.sliceSelector(state).jobStatusDict,
    (jobStatusDict: Record<string, boolean>) => {
        return Object.keys(jobStatusDict).filter((jobName) => {
            return jobStatusDict[jobName] === true;
        });
    }
);

const completedJobsSelector = createSelector(
    (state) => inAppLaunchConfig.sliceSelector(state).jobStatusDict,
    (jobStatusDict: Record<string, boolean>) => {
        return Object.keys(jobStatusDict).filter((jobName) => {
            return jobStatusDict[jobName] === false;
        });
    }
);

const isJobArrCompletedSelector = createSelector(
    [
        (state) => inAppLaunchConfig.sliceSelector(state).jobStatusDict,
        (_state, jobNames: string[]) => jobNames,
    ],
    (jobStatusDict: Record<string, boolean>, jobNames: string[]) => {
        let _areJobsCompleted = true;
        for (const jobName of jobNames) {
            const isPending = jobStatusDict[jobName];
            if (isPending) {
                _areJobsCompleted = false;
                break;
            }
        }
        return _areJobsCompleted;
    }
);

export const selectors = {
    isInitialized: (state: any) => inAppLaunchConfig.sliceSelector(state).isInitialized,
    isAnyJobPending: (state: any) => inAppLaunchConfig.sliceSelector(state).isAnyJobPending,
    areAllJobsDone: (state: any) => inAppLaunchConfig.sliceSelector(state).areAllJobsDone,
    isLaunchComplete: (state: any) => inAppLaunchConfig.sliceSelector(state).isLaunchComplete,
    pendingJobsCount: (state: any) => inAppLaunchConfig.sliceSelector(state).pendingJobsCount,
    jobStatus: (state: any, jobName: string) =>
        Boolean(inAppLaunchConfig.sliceSelector(state).jobStatusDict[jobName]),
    pendingJobs: pendingJobsSelector,
    completedJobs: completedJobsSelector,
    isJobArrCompleted: isJobArrCompletedSelector,
};
