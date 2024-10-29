import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from './slice';
import { selectors } from './selectors';

export const registerListeners = (listenerMiddleware: ListenerMiddlewareInstance) => {
    // addToPendingJobs: A job started
    listenerMiddleware.startListening({
        actionCreator: slice.actions.addToPendingJobs,
        effect: (action, api) => {
            const state = api.getState();

            // If launch is already complete, no-op
            const isLaunchComplete = selectors.isLaunchComplete(state);
            if (isLaunchComplete) {
                return;
            }

            const jobName = action.payload;
            const currentStatusOfJob = selectors.jobStatus(state, jobName);

            // Check if job was not already pending
            if (currentStatusOfJob === undefined || currentStatusOfJob === false) {
                // Set job's 'pending' status to true
                api.dispatch(
                    slice.actions.setJobStatus({
                        jobName,
                        status: true,
                    })
                );

                // Increase pending jobs count by 1
                const pendingJobsCount: number = selectors.pendingJobsCount(state);
                api.dispatch(slice.actions.setPendingJobsCount(pendingJobsCount + 1));
            } else {
                console.warn('TODO: this job already added');
            }
        },
    });

    // removeFromPendingJobs: A job ended
    listenerMiddleware.startListening({
        actionCreator: slice.actions.removeFromPendingJobs,
        effect: (action, api) => {
            const state = api.getState();

            // If launch is already complete, no-op
            const isLaunchComplete = selectors.isLaunchComplete(state);
            if (isLaunchComplete) {
                return;
            }

            const jobName = action.payload;
            const currentStatusOfJob = selectors.jobStatus(state, jobName);

            // Check if job was pending
            if (currentStatusOfJob === true) {
                // Set job's 'pending' status to false
                api.dispatch(
                    slice.actions.setJobStatus({
                        jobName,
                        status: false,
                    })
                );

                // Decrease pending jobs count by 1
                const pendingJobsCount: number = selectors.pendingJobsCount(state);
                api.dispatch(slice.actions.setPendingJobsCount(pendingJobsCount - 1));
            } else {
                console.warn('TODO: this job already removed');
            }
        },
    });

    // Job count down to zero
    listenerMiddleware.startListening({
        predicate: (action) => {
            return action.type === slice.actions.setPendingJobsCount.type && action.payload === 0;
        },
        effect: async (_action, api) => {
            /*
            Whenever pending jobs count falls to zero,
            wait a little in case there will be an addition of a job that depends on the last completed job.
            If no jobs start, complete the launch.
            */

            const WAIT_DURATION = 500; // ms

            const resolved = await api.take((action) => {
                return action.type === slice.actions.addToPendingJobs.type;
            }, WAIT_DURATION);

            if (resolved === null) {
                // timed out => complete the launch
                api.dispatch(slice.actions.setAllJobsDone());
            }
        },
    });
};
