import { waitFor } from '@testing-library/react-native';
import { Launch, renderWithSetup, STATE_TEST_IDS } from '../utils/test-utils';
import { DEBOUNCE_DURATION } from '../store/constants';
import { getListenerPredicate } from '../tools';
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { slice } from '../store/slice';

describe('Launch Completion', () => {
    it('When there is no job, launch completes shortly after initialization', async () => {
        const { getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
        });

        await waitFor(() => {
            expect(getByTestId('isComplete')).toHaveProp('children', true);
        });
    });
    it.failing(
        'When a job is added to and not removed from pending jobs, launch pends',
        async () => {
            const jobName = 'A';

            const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
                // Job A listens for initialization, starts itself, but does not end itself
                listenerMw.startListening({
                    predicate: getListenerPredicate(),
                    effect: async (_action, api) => {
                        api.dispatch(slice.actions.jobStarted(jobName));
                    },
                });
            };

            const { getByTestId } = renderWithSetup(<Launch />, {
                withListenerMiddleware: true,
                startListeners,
            });

            await waitFor(
                () => {
                    // (Failing) Expect launch NOT to complete even after DEBOUNCE_DURATION * 3
                    expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
                },
                {
                    timeout: DEBOUNCE_DURATION * 3,
                }
            );
        }
    );
    it('When there is a single job and it is removed from pending jobs, launch is completed', async () => {
        const jobName = 'A';

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    // Start but do not end job A
                    api.dispatch(slice.actions.jobStarted(jobName));
                    api.dispatch(slice.actions.jobEnded(jobName));
                },
            });
        };

        const { getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(() => {
            // Expect launch to complete
            expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
        });
    });
    it.failing('When a job is done but others are pending, launch pends', async () => {
        const jobNameA = 'A';
        const jobNameB = 'B';

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization, starts and ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameA));
                    api.dispatch(slice.actions.jobEnded(jobNameA));
                },
            });
            // Job A listens for initialization, starts itself, but does not end itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameB));
                },
            });
        };

        const { getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // (Failing) Expect launch NOT to complete even after DEBOUNCE_DURATION * 3
                expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
            },
            {
                timeout: DEBOUNCE_DURATION * 3,
            }
        );
    });
    it('When all jobs are done, launch completes', async () => {
        const jobNameA = 'A';
        const jobNameB = 'B';

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization, starts and ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameA));
                    api.dispatch(slice.actions.jobEnded(jobNameA));
                },
            });
            // Job A listens for initialization, starts and ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameB));
                    api.dispatch(slice.actions.jobEnded(jobNameB));
                },
            });
        };

        const { getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(() => {
            // Expect launch to complete
            expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
        });
    });
    it.failing('When a new job is added after current jobs are done, launch pends', async () => {
        const jobNameA = 'A';
        const jobNameB = 'B';
        const jobNameC = 'B';
        const jobDuration = 500;

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization, starts and ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameA));
                    await api.delay(jobDuration);
                    api.dispatch(slice.actions.jobEnded(jobNameA));
                },
            });
            // Job A listens for initialization, starts and ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameB));
                    await api.delay(jobDuration);
                    api.dispatch(slice.actions.jobEnded(jobNameB));
                },
            });
            listenerMw.startListening({
                predicate: getListenerPredicate(jobNameA, jobNameB),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(jobNameC));
                },
            });
        };

        const { getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // (Failing) Expect launch NOT to complete even after DEBOUNCE_DURATION * 3
                expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
            },
            {
                timeout: DEBOUNCE_DURATION * 3,
            }
        );
    });
});
