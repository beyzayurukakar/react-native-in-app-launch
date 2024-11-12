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
    /** Is the launch initialized */
    isInitialized: (state: _RootState) => state.inAppLaunch.isInitialized,
    /** Is the launch waiting/listening for jobs */
    isWaitingForJobs: (state: _RootState) => state.inAppLaunch.isWaitingForJobs,
    /** Are all the jobs done and no jobs will be added */
    areAllJobsDone: (state: _RootState) => state.inAppLaunch.areAllJobsDone,
    /** Is the launch completed */
    isLaunchComplete: (state: _RootState) => state.inAppLaunch.isLaunchComplete,
    /** How many jobs are pending */
    pendingJobsCount: (state: _RootState) => state.inAppLaunch.pendingJobsCount,
    /** Status of a single job */
    jobStatus: (state: _RootState, jobName: string) => state.inAppLaunch.jobStatusDict[jobName],
    /** List of pending jobs */
    pendingJobs: pendingJobsSelector,
    /** List of completed jobs */
    completedJobs: completedJobsSelector,
    /** Are the jobs in the given list all done */
    isJobArrCompleted: isJobArrCompletedSelector,
};
