import { createSelector } from '@reduxjs/toolkit';
import type { _RootState } from './types';

const pendingJobsSelector = createSelector(
    (state: _RootState) => state.inAppLaunch.jobStatusDict,
    (jobStatusDict: Record<string, boolean>) => {
        return Object.keys(jobStatusDict).filter((jobName) => {
            return jobStatusDict[jobName] === true;
        });
    }
);

const completedJobsSelector = createSelector(
    (state: _RootState) => state.inAppLaunch.jobStatusDict,
    (jobStatusDict: Record<string, boolean>) => {
        return Object.keys(jobStatusDict).filter((jobName) => {
            return jobStatusDict[jobName] === false;
        });
    }
);

const isJobArrCompletedSelector = createSelector(
    [
        (state: _RootState) => state.inAppLaunch.jobStatusDict,
        (_state: _RootState, jobNames: string[]) => jobNames,
    ],
    (jobStatusDict: Record<string, boolean>, jobNames: string[]) => {
        let _areJobsCompleted = true;
        for (const jobName of jobNames) {
            const isPending = jobStatusDict[jobName];
            if (isPending === true || isPending === undefined) {
                _areJobsCompleted = false;
                break;
            }
        }
        return _areJobsCompleted;
    }
);

export const selectors = {
    isInitialized: (state: _RootState) => state.inAppLaunch.isInitialized,
    isWaitingForJobs: (state: _RootState) => state.inAppLaunch.isWaitingForJobs,
    areAllJobsDone: (state: _RootState) => state.inAppLaunch.areAllJobsDone,
    isLaunchComplete: (state: _RootState) => state.inAppLaunch.isLaunchComplete,
    pendingJobsCount: (state: _RootState) => state.inAppLaunch.pendingJobsCount,
    jobStatus: (state: _RootState, jobName: string) => state.inAppLaunch.jobStatusDict[jobName],
    pendingJobs: pendingJobsSelector,
    completedJobs: completedJobsSelector,
    isJobArrCompleted: isJobArrCompletedSelector,
};
