import { waitFor } from '@testing-library/react-native';
import { Launch, renderWithSetup, STATE_TEST_IDS } from '../utils/test-utils';
import { slice } from '../store/slice';

describe('useManageLaunch', () => {
    it('initializes launch on mount and waits for job', async () => {
        const { getByTestId } = renderWithSetup(<Launch />, { withListenerMiddleware: false });

        await waitFor(() => {
            const isInitializedText = getByTestId(STATE_TEST_IDS.isInitialized);
            const isWaitingForJobsText = getByTestId(STATE_TEST_IDS.isWaitingForJobs);
            const isCompleteText = getByTestId(STATE_TEST_IDS.isComplete);

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', true);
            expect(isCompleteText).toHaveProp('children', false);
        });
    });
    it('completes launch when all jobs and animation is done', async () => {
        const { store, getByTestId } = renderWithSetup(<Launch />, {
            withListenerMiddleware: false,
        });

        await waitFor(() => {
            store.dispatch(slice.actions.setAllJobsDone());
        });

        await waitFor(() => {
            const isInitializedText = getByTestId(STATE_TEST_IDS.isInitialized);
            const isWaitingForJobsText = getByTestId(STATE_TEST_IDS.isWaitingForJobs);
            const isCompleteText = getByTestId(STATE_TEST_IDS.isComplete);

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', false);
            expect(isCompleteText).toHaveProp('children', true);
        });
    });
    it('does not complete launch when all jobs are done and animation is NOT', async () => {
        const { store, getByTestId } = renderWithSetup(<Launch isAnimationComplete={false} />, {
            withListenerMiddleware: false,
        });

        await waitFor(() => {
            store.dispatch(slice.actions.setAllJobsDone());
        });

        await waitFor(() => {
            const isInitializedText = getByTestId(STATE_TEST_IDS.isInitialized);
            const isWaitingForJobsText = getByTestId(STATE_TEST_IDS.isWaitingForJobs);
            const isCompleteText = getByTestId(STATE_TEST_IDS.isComplete);

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', false);
            expect(isCompleteText).toHaveProp('children', false);
        });
    });
});
