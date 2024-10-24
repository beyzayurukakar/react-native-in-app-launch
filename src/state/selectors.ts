import { createSelector } from '@reduxjs/toolkit';
import { inAppLaunchConfig } from '../config/config';

const awaitedJobsSelector = createSelector(
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

export const selectors = {
  isInitialized: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).isInitialized,
  isWaitingForJobs: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).isWaitingForJobs,
  areAllJobsDone: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).areAllJobsDone,
  isLaunchComplete: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).isLaunchComplete,
  awaitedJobsCount: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).awaitedJobsCount,
  jobStatus: (jobName: string) => (state: any) =>
    Boolean(inAppLaunchConfig.sliceSelector(state).jobStatusDict[jobName]),
  awaitedJobs: awaitedJobsSelector,
  completedJobs: completedJobsSelector,
};
