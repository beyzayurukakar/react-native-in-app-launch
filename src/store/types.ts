export type InAppLaunchState = {
    isInitialized: boolean;
    isAnyJobPending: boolean;
    areAllJobsDone: boolean;
    isLaunchComplete: boolean;
    jobStatusDict: Record<string, boolean>;
    pendingJobsCount: number;
};

export type SetJobStatusPayload = { jobName: string; status: boolean };
