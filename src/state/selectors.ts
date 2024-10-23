import { inAppLaunchConfig } from '../config/config';

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
  jobStatusDict: (state: any) =>
    inAppLaunchConfig.sliceSelector(state).jobStatusDict,
  jobStatus: (jobName: string) => (state: any) =>
    Boolean(inAppLaunchConfig.sliceSelector(state).jobStatusDict[jobName]),
};
