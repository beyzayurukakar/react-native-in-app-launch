import type { AnyListenerPredicate } from '@reduxjs/toolkit';
import { slice } from '../store/slice';
import { selectors } from '../store/selectors';

export const allOfJobs =
    (...jobNames: string[]): AnyListenerPredicate<any> =>
    (action, currentState) => {
        if (action.type === slice.actions.removeFromAwaitedJobs.type) {
            const completedJobs = selectors.completedJobs(currentState);
            let areDependedJobsDone = true;
            for (const jobName of jobNames) {
                if (!completedJobs.includes(jobName)) {
                    areDependedJobsDone = false;
                    break;
                }
            }
            return areDependedJobsDone;
        }

        return false;
    };
