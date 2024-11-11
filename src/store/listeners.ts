import { type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from './slice';
import { selectors } from './selectors';
import { DEBOUNCE_DURATION } from './constants';
import type { _RootState } from './types';

export const registerListeners = (listenerMiddleware: ListenerMiddlewareInstance) => {
    const listenerMw = listenerMiddleware as ListenerMiddlewareInstance<_RootState>;
    // A job started
    listenerMw.startListening({
        actionCreator: slice.actions.jobStarted,
        effect: (action, api) => {
            const state = api.getState();

            // If launch is not on, no-op
            const isWaitingForJobs = selectors.isWaitingForJobs(state);
            if (!isWaitingForJobs) {
                return;
            }

            const jobName = action.payload;
            const currentStatusOfJob = selectors.jobStatus(state, jobName);

            // Check if job was not already pending or completed
            if (currentStatusOfJob === undefined) {
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
    listenerMw.startListening({
        actionCreator: slice.actions.jobEnded,
        effect: (action, api) => {
            const state = api.getState();

            // If launch is not on, no-op
            const isWaitingForJobs = selectors.isWaitingForJobs(state);
            if (!isWaitingForJobs) {
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
    Marks 'allJobsDone' true when there are no jobs left and will not be.
    Works like debounce / saga takeLatest.
    */
    listenerMw.startListening({
        predicate: (action, _currentState, originalState) => {
            /*
            1. Listens for job status changes for:
                - Job status set to 'pending': decides not to mark all done.
                - Job status set to 'done': waits for new jobs before marking all done.
            2. Listens for initialization in case no job ever starts and launch needs to be completed.
            */

            return (
                action.type === slice.actions.setJobStatus.type ||
                (action.type === slice.actions.initialize.type &&
                    selectors.isInitialized(originalState) === false)
            );
        },
        effect: async (_action, api) => {
            // Cancel other instances for debounce effect
            api.cancelActiveListeners();

            // Wait in case another instance of this listener is called
            // i.e a job status update happened
            await api.delay(DEBOUNCE_DURATION);

            // If we are here, no job status update happened in the last [DEBOUNCE_DURATION] miliseconds:
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
