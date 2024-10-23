import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from '../state/slice';
import { selectors } from '../state/selectors';

export const registerListeners = (
  listenerMiddleware: ListenerMiddlewareInstance
) => {
  // A job started
  listenerMiddleware.startListening({
    actionCreator: slice.actions.addToAwaitedJobs,
    effect: (action, api) => {
      const state = api.getState();

      // If launch is already complete, no-op
      const isLaunchComplete = selectors.isLaunchComplete(state);
      if (isLaunchComplete) {
        return;
      }

      const jobName = action.payload;
      const currentStatusOfJob = selectors.jobStatus(jobName)(state);

      // Check if job was not already being waited
      if (currentStatusOfJob === undefined || currentStatusOfJob === false) {
        // Set job's 'waited' status to true
        api.dispatch(
          slice.actions.setJobStatus({
            jobName,
            status: true,
          })
        );

        // Increase awaited jobs count by 1
        const awaitedJobsCount: number = selectors.awaitedJobsCount(state);
        api.dispatch(slice.actions.setAwaitedJobsCount(awaitedJobsCount + 1));
      } else {
        console.warn('TODO: this job already added');
      }
    },
  });

  // A job ended
  listenerMiddleware.startListening({
    actionCreator: slice.actions.removeFromAwaitedJobs,
    effect: (action, api) => {
      const state = api.getState();

      // If launch is already complete, no-op
      const isLaunchComplete = selectors.isLaunchComplete(state);
      if (isLaunchComplete) {
        return;
      }

      const jobName = action.payload;
      const currentStatusOfJob = selectors.jobStatus(jobName)(state);

      // Check if job was being waited
      if (currentStatusOfJob === true) {
        // Set job's 'waited' status to false
        api.dispatch(
          slice.actions.setJobStatus({
            jobName,
            status: false,
          })
        );

        // Decrease awaited jobs count by 1
        const awaitedJobsCount: number = selectors.awaitedJobsCount(state);
        api.dispatch(slice.actions.setAwaitedJobsCount(awaitedJobsCount - 1));
      } else {
        console.warn('TODO: this job already removed');
      }
    },
  });

  // Job count down to zero
  listenerMiddleware.startListening({
    predicate: (action) => {
      return (
        action.type === slice.actions.setAwaitedJobsCount.type &&
        action.payload === 0
      );
    },
    effect: async (_action, api) => {
      /*
            Whenever awaited jobs count falls to zero,
            wait a little in case there will be an addition of a job that depends on the last completed job.
            If no jobs start, complete the launch.
            */

      const WAIT_DURATION = 500; // ms

      const resolved = await api.take((action) => {
        return action.type === slice.actions.addToAwaitedJobs.type;
      }, WAIT_DURATION);

      if (resolved === null) {
        // timed out => complete the launch
        api.dispatch(slice.actions.setAllJobsDone());
      }
    },
  });
};
