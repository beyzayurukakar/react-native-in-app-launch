export type InAppLaunchState = {
    isInitialized: boolean;
    isWaitingForJobs: boolean;
    areAllJobsDone: boolean;
    isLaunchComplete: boolean;
    jobStatusDict: Record<string, boolean>;
    awaitedJobsCount: number;
};

export type SetJobStatusPayload = { jobName: string; status: boolean };
