export type InAppLaunchState = {
    isInitialized: boolean;
    isWaitingForJobs: boolean;
    areAllJobsDone: boolean;
    isLaunchComplete: boolean;
    jobStatusDict: Record<string, boolean>;
    pendingJobsCount: number;
};

export type SetJobStatusPayload = { jobName: string; status: boolean };
