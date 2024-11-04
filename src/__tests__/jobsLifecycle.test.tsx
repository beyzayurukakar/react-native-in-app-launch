import { View } from 'react-native';
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react-native';

import {
    getJobStatusPredicate,
    Launch,
    renderWithSetup,
    STATE_TEST_IDS,
} from '../utils/test-utils';

import { getListenerPredicate } from '../tools';
import { slice } from '../store/slice';

describe('Job Lifecycle', () => {
    it('Job with no dependency notified on initialization', async () => {
        const mockEffect = jest.fn();
        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job listens for initialization
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: mockEffect,
            });
        };
        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(() => {
            // Expect job to be notified at initialization
            expect(mockEffect).toHaveBeenCalled();
        });
    });
    it('Two jobs with no dependency notified on intialization', async () => {
        const mockEffectA = jest.fn();
        const mockEffectB = jest.fn();
        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: mockEffectA,
            });
            // Job B listens for initialization
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: mockEffectB,
            });
        };
        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(() => {
            // Expect job A and job B to be notified at initialization
            expect(mockEffectA).toHaveBeenCalled();
            expect(mockEffectB).toHaveBeenCalled();
        });
    });
    it('Job depending on single job notified on completion of depended job', async () => {
        const dependedJobName = 'A';
        const dependedJobDuration = 1000;
        const mockEffectB = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobName));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobName));
                },
            });
            // Job B listens for completion of job A
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobName),
                effect: mockEffectB,
            });
        };

        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // Expect job B NOT to be notified before completion of job A
                expect(mockEffectB).not.toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration - 100,
            }
        );
        await waitFor(
            () => {
                // Expect job B to be notified at completion of job A
                expect(mockEffectB).toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration + 100,
            }
        );
    });
    it('Job depending on two jobs notified on completion of depended jobs', async () => {
        const dependedJobNameA = 'A';
        const dependedJobNameB = 'B';
        const dependedJobDuration = 1000;
        const mockEffectC = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameA));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameA));
                },
            });
            // Job B listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameB));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameB));
                },
            });
            // Job C listens for completion of job A & B
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobNameA, dependedJobNameB),
                effect: mockEffectC,
            });
        };

        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // Expect job B NOT to be notified before completion of job A & B
                expect(mockEffectC).not.toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration - 100,
            }
        );
        await waitFor(
            () => {
                // Expect job B to be notified at completion of job A & B
                expect(mockEffectC).toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration + 100,
            }
        );
    });
    it('Two jobs depending on same two jobs starts on completion of depended jobs', async () => {
        const dependedJobNameA = 'A';
        const dependedJobNameB = 'B';
        const dependedJobDuration = 1000;
        const mockEffectC = jest.fn();
        const mockEffectD = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameA));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameA));
                },
            });
            // Job B listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameB));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameB));
                },
            });
            // Job C listens for completion of job A & B
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobNameA, dependedJobNameB),
                effect: mockEffectC,
            });
            // Job D listens for completion of job A & B
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobNameA, dependedJobNameB),
                effect: mockEffectD,
            });
        };

        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // Expect job B or job C NOT to be notified before completion of job A & B
                expect(mockEffectC).not.toHaveBeenCalled();
                expect(mockEffectD).not.toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration - 100,
            }
        );
        await waitFor(
            () => {
                // Expect job B and job C to be notified at completion of job A & B
                expect(mockEffectC).toHaveBeenCalled();
                expect(mockEffectD).toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration + 100,
            }
        );
    });
    it('Chain of three jobs that depend on the previous start on completion of the previous', async () => {
        const dependedJobNameA = 'A';
        const dependedJobNameB = 'B';
        const dependedJobDuration = 1000;
        const mockEffectC = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Job A listens for initialization and starts-ends itself
            listenerMw.startListening({
                predicate: getListenerPredicate(),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameA));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameA));
                },
            });
            // Job B listens for completion of job A
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobNameA),
                effect: async (_action, api) => {
                    api.dispatch(slice.actions.jobStarted(dependedJobNameB));
                    await api.delay(dependedJobDuration);
                    api.dispatch(slice.actions.jobEnded(dependedJobNameB));
                },
            });
            // Job C listens for completion of job B
            listenerMw.startListening({
                predicate: getListenerPredicate(dependedJobNameB),
                effect: mockEffectC,
            });
        };

        renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        await waitFor(
            () => {
                // Expect job C NOT to be notified before completion of job B
                expect(mockEffectC).not.toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration * 2 - 100,
            }
        );
        await waitFor(
            () => {
                // Expect job C to be notified at completion of job B
                expect(mockEffectC).toHaveBeenCalled();
            },
            {
                timeout: dependedJobDuration * 2 + 100,
            }
        );
    });
    it('Cannot start a job before launch is initialized', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'pending'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, true),
                effect: mockEffect,
            });
        };

        // Do not render Launch, so that no initialization occurs
        const { store } = renderWithSetup(<View />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Attempt to start job A
        store.dispatch(slice.actions.jobStarted(jobName));

        await waitFor(() => {
            // Expect mock effect not to be called
            expect(mockEffect).not.toHaveBeenCalled();
        });
    });
    it('Cannot start a job after launch is completed', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'pending'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, true),
                effect: mockEffect,
            });
        };

        const { store, getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Wait until launch completes
        await waitFor(() => {
            expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
        });

        // Attempt to start job A
        store.dispatch(slice.actions.jobStarted('A'));

        await waitFor(() => {
            // Expect mock effect not to be called
            expect(mockEffect).not.toHaveBeenCalled();
        });
    });

    it('Cannot start a job while it is already pending', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'pending'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, true),
                effect: mockEffect,
            });
        };

        const { store } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Start job A once
        store.dispatch(slice.actions.jobStarted(jobName));

        // Attempt to start job A again
        store.dispatch(slice.actions.jobStarted(jobName));

        await waitFor(() => {
            // Expect mock effect to have been called only once at first start of job A
            expect(mockEffect).toHaveBeenCalledTimes(1);
        });
    });
    it('Cannot start a job after it ends', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'pending'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, true),
                effect: mockEffect,
            });
        };

        const { store } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Start and end job A once
        store.dispatch(slice.actions.jobStarted(jobName));
        store.dispatch(slice.actions.jobEnded(jobName));

        // Attempt to start job A again
        store.dispatch(slice.actions.jobStarted(jobName));

        await waitFor(() => {
            // Expect mock effect to have been called only once at first start of job A
            expect(mockEffect).toHaveBeenCalledTimes(1);
        });
    });
    it('Cannot end a job before launch is initialized', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'completed'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, false),
                effect: mockEffect,
            });
        };

        // Do not render Launch, so that no initialization occurs
        const { store } = renderWithSetup(<View />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Attempt to start job A
        store.dispatch(slice.actions.jobStarted(jobName));
        // Attempt to end job A
        store.dispatch(slice.actions.jobEnded(jobName));

        await waitFor(() => {
            // Expect mock effect not to be called
            expect(mockEffect).not.toHaveBeenCalled();
        });
    });
    it('Cannot end a job after launch is completed', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'completed'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, false),
                effect: mockEffect,
            });
        };

        const { store, getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Wait until launch completes
        await waitFor(() => {
            expect(getByTestId(STATE_TEST_IDS.isComplete)).toHaveProp('children', true);
        });

        // Attempt to start job A
        store.dispatch(slice.actions.jobStarted('A'));
        // Attempt to end job A
        store.dispatch(slice.actions.jobEnded(jobName));

        await waitFor(() => {
            // Expect mock effect not to be called
            expect(mockEffect).not.toHaveBeenCalled();
        });
    });
    it('Cannot end a job before it starts', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'completed'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, false),
                effect: mockEffect,
            });
        };

        const { store } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Attempt to end job A
        store.dispatch(slice.actions.jobEnded(jobName));

        await waitFor(() => {
            // Expect mock effect not to be called
            expect(mockEffect).not.toHaveBeenCalled();
        });
    });
    it('Cannot end a job when it already ended', async () => {
        const jobName = 'A';
        const mockEffect = jest.fn();

        const startListeners = (listenerMw: ListenerMiddlewareInstance) => {
            // Call mock effect when status of job A is changed to 'completed'
            listenerMw.startListening({
                predicate: getJobStatusPredicate(jobName, false),
                effect: mockEffect,
            });
        };

        const { store } = renderWithSetup(<Launch />, {
            withListenerMiddleware: true,
            startListeners,
        });

        // Start and end job A once
        store.dispatch(slice.actions.jobStarted(jobName));
        store.dispatch(slice.actions.jobEnded(jobName));

        // Attempt to end job A again
        store.dispatch(slice.actions.jobEnded(jobName));

        await waitFor(() => {
            // Expect mock effect to have been called only once at first end of job A
            expect(mockEffect).toHaveBeenCalledTimes(1);
        });
    });
});
