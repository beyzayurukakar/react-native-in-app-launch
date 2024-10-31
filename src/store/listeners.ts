import { type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from './slice';
import { selectors } from './selectors';

export const registerListeners = (listenerMiddleware: ListenerMiddlewareInstance) => {
    // A job started
    listenerMiddleware.startListening({
        actionCreator: slice.actions.jobStarted,
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
            }
        },
    });

    // A job ended
    listenerMiddleware.startListening({
        actionCreator: slice.actions.jobEnded,
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
            }
        },
    });

    /*
    Decides when to complete the launch.
    Works like debounce / saga takeLatest.
    */
    listenerMiddleware.startListening({
        predicate: (action) => {
            /*
            1. Listens for job status changes for:
                - Job status set to 'pending': decides not to complete the launch.
                - Job status set to 'done': waits for new jobs before completing the launch.
            2. Listens for initialization in case no job ever starts and launch needs to be completed.
            */

            return (
                action.type === slice.actions.setJobStatus.type ||
                action.type === slice.actions.initialize.type
            );
        },
        effect: async (_action, api) => {
            // Cancel other instances for debounce effect
            api.cancelActiveListeners();

            // Wait in case another instance of this listener is called
            // i.e a job status update happened
            await api.delay(200);

            // If we are here, no job status update happened in the last 500 ms:
            const state = api.getState();
            if (selectors.pendingJobsCount(state) > 0) {
                // There are still pending jobs: no-op
                return;
            }

            // Pending jobs count fell to zero: complete the launch
            api.dispatch(slice.actions.setAllJobsDone());
        },
    });
};
