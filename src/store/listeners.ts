import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from './slice';
import { selectors } from './selectors';

export const registerListeners = (listenerMiddleware: ListenerMiddlewareInstance) => {
    // Job count down to zero
    listenerMiddleware.startListening({
        predicate: (action, currentState) => {
            return (
                action.type === slice.actions.removeFromPendingJobs.type &&
                selectors.pendingJobsCount(currentState) === 0
            );
        },
        effect: async (_action, api) => {
            /*
            Whenever pending jobs count falls to zero,
            wait a little in case there will be an addition of a job that depends on the last completed job.
            If no jobs start, complete the launch.
            */

            const WAIT_DURATION = 2000; // ms

            const isJobAdded = await api.condition((action) => {
                return action.type === slice.actions.addToPendingJobs.type;
            }, WAIT_DURATION);

            if (isJobAdded === false) {
                // timed out => complete the launch
                api.dispatch(slice.actions.setAllJobsDone());
                return;
            }
        },
    });
};
