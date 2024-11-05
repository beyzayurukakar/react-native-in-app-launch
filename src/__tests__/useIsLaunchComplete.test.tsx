import { Text } from 'react-native';
import { useIsLaunchComplete } from '../tools';
import { renderWithSetup } from '../utils/test-utils';
import { waitFor } from '@testing-library/react-native';
import { slice } from '../store/slice';

const TestComponent = () => {
    const isLaunchComplete = useIsLaunchComplete();

    return <Text testID="isLaunchComplete">{isLaunchComplete}</Text>;
};

describe('useIsLaunchComplete', () => {
    it('returns correct value', async () => {
        const { store, getByTestId } = renderWithSetup(<TestComponent />, {
            withListenerMiddleware: false,
        });

        await waitFor(() => {
            // Expect isLaunchComplete to be false
            const isCompleteText = getByTestId('isLaunchComplete');
            expect(isCompleteText).toHaveProp('children', false);

            // Change store state to true
            store.dispatch(slice.actions.completeInAppLaunch());
        });

        await waitFor(() => {
            // Expect isLaunchComplete to be true
            const isCompleteText = getByTestId('isLaunchComplete');
            expect(isCompleteText).toHaveProp('children', true);
        });
    });
});
