import { waitFor } from '@testing-library/react-native';
import { useManageLaunch, useLaunchStates } from '../tools';
import { renderWithProviders } from '../utils/test-utils';
import { Text, View } from 'react-native';
import { slice } from '../store/slice';

const Launch = (props: { isAnimationComplete: boolean }) => {
    useManageLaunch({ isAnimationComplete: props.isAnimationComplete });

    const { isInitialized, isWaitingForJobs, isComplete } = useLaunchStates();

    return (
        <View>
            <Text testID="isInitialized">{isInitialized}</Text>
            <Text testID="isWaitingForJobs">{isWaitingForJobs}</Text>
            <Text testID="isComplete">{isComplete}</Text>
        </View>
    );
};

describe('useManageLaunch', () => {
    it('initializes launch on mount and waits for job', async () => {
        const { getByTestId } = renderWithProviders(<Launch isAnimationComplete={true} />);

        await waitFor(() => {
            const isInitializedText = getByTestId('isInitialized');
            const isWaitingForJobsText = getByTestId('isWaitingForJobs');
            const isCompleteText = getByTestId('isComplete');

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', true);
            expect(isCompleteText).toHaveProp('children', false);
        });
    });
    it('completes launch when all jobs and animation is done', async () => {
        const { store, getByTestId } = renderWithProviders(<Launch isAnimationComplete={true} />);

        await waitFor(() => {
            store.dispatch(slice.actions.setAllJobsDone());
        });

        await waitFor(() => {
            const isInitializedText = getByTestId('isInitialized');
            const isWaitingForJobsText = getByTestId('isWaitingForJobs');
            const isCompleteText = getByTestId('isComplete');

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', false);
            expect(isCompleteText).toHaveProp('children', true);
        });
    });
    it('does not complete launch when all jobs are done and animation is NOT', async () => {
        const { store, getByTestId } = renderWithProviders(<Launch isAnimationComplete={false} />);

        await waitFor(() => {
            store.dispatch(slice.actions.setAllJobsDone());
        });

        await waitFor(() => {
            const isInitializedText = getByTestId('isInitialized');
            const isWaitingForJobsText = getByTestId('isWaitingForJobs');
            const isCompleteText = getByTestId('isComplete');

            expect(isInitializedText).toHaveProp('children', true);
            expect(isWaitingForJobsText).toHaveProp('children', false);
            expect(isCompleteText).toHaveProp('children', false);
        });
    });
});
