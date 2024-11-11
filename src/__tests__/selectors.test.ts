import { SLICE_NAME } from '../store/constants';
import { selectors } from '../store/selectors';
import type { _RootState } from '../store/types';

const state = {
    [SLICE_NAME]: {
        jobStatusDict: {
            // True for pending, false for done
            a: true,
            b: true,
            c: false,
            d: false,
        },
        isInitialized: true,
        isLaunchComplete: false,
        areAllJobsDone: false,
        isWaitingForJobs: true,
        pendingJobsCount: 2,
    },
} as _RootState;

describe('Selectors: isJobArrCompleted', () => {
    it('Returns true if no jobNames provided', () => {
        expect(selectors.isJobArrCompleted(state, [])).toBe(true);
    });
    it('Returns true if all given jobs are done', () => {
        // c and d are both done
        expect(selectors.isJobArrCompleted(state, ['c', 'd'])).toBe(true);
    });
    it('Returns false if some given jobs are pending', () => {
        // a is pending, d is done
        expect(selectors.isJobArrCompleted(state, ['a', 'd'])).toBe(false);
    });
    it('Returns false if all given jobs are pending', () => {
        // a and b are both pending
        expect(selectors.isJobArrCompleted(state, ['a', 'b'])).toBe(false);
    });
    it('Returns false if some given jobs are not initialized', () => {
        // f is not initialized (undefined), d is done
        expect(selectors.isJobArrCompleted(state, ['f', 'd'])).toBe(false);
    });
    it('Returns false if all given jobs are not initialized', () => {
        // f and e are both not initialized (undefined)
        expect(selectors.isJobArrCompleted(state, ['f', 'e'])).toBe(false);
    });
});

describe('Selectors: pendingJobs', () => {
    it('Returns pending jobs (a and b)', () => {
        expect(selectors.pendingJobs(state)).toEqual(['a', 'b']);
    });
});

describe('Selectors: completedJobs', () => {
    it('Returns completed jobs (c and d)', () => {
        expect(selectors.completedJobs(state)).toEqual(['c', 'd']);
    });
});
