import {
    configureStore,
    createListenerMiddleware,
    Tuple,
    type AnyListenerPredicate,
    type ListenerMiddlewareInstance,
    type PayloadAction,
} from '@reduxjs/toolkit';
import type { PropsWithChildren } from 'react';
import { Provider, useSelector } from 'react-redux';
import { slice } from '../store/slice';
import { render } from '@testing-library/react-native';
import { useManageLaunch } from '../tools';
import { Text, View } from 'react-native';
import type { SetJobStatusPayload } from '../store/types';
import { registerListeners } from '../store/listeners';
import { selectors } from '../store/selectors';

export const renderWithSetup = (
    ui: React.ReactElement | null,
    options: {
        withListenerMiddleware: boolean;
        startListeners?: (listenerMw: ListenerMiddlewareInstance) => void;
    }
) => {
    const { withListenerMiddleware, startListeners } = options;

    let listenerMiddleware: ListenerMiddlewareInstance | undefined;
    if (withListenerMiddleware === true) {
        listenerMiddleware = createListenerMiddleware();
    }

    const store = configureStore({
        reducer: {
            [slice.name]: slice.reducer,
        },
        middleware: (getDefaultMiddleware) => {
            let resultMw: Tuple<any> = getDefaultMiddleware();
            if (listenerMiddleware) {
                resultMw = resultMw.prepend(listenerMiddleware.middleware);
            }
            return resultMw;
        },
    });

    if (listenerMiddleware) {
        startListeners?.(listenerMiddleware);
        registerListeners(listenerMiddleware);
    }

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
    );

    return {
        store,
        ...render(ui || <View />, { wrapper: Wrapper }),
    };
};

export const STATE_TEST_IDS = {
    isInitialized: 'isInitialized',
    isWaitingForJobs: 'isWaitingForJobs',
    isComplete: 'isComplete',
};
export const Launch = (props: { isAnimationComplete?: boolean }) => {
    const { isAnimationComplete = true } = props;

    useManageLaunch({ isAnimationComplete });

    const isInitialized = useSelector(selectors.isInitialized);
    const isWaitingForJobs = useSelector(selectors.isWaitingForJobs);
    const isComplete = useSelector(selectors.isLaunchComplete);

    return (
        <View>
            <Text testID={STATE_TEST_IDS.isInitialized}>{isInitialized}</Text>
            <Text testID={STATE_TEST_IDS.isWaitingForJobs}>{isWaitingForJobs}</Text>
            <Text testID={STATE_TEST_IDS.isComplete}>{isComplete}</Text>
        </View>
    );
};

export const getJobStatusPredicate =
    (jobName: string, status: boolean): AnyListenerPredicate<any> =>
    (action) => {
        const _action = action as PayloadAction<SetJobStatusPayload>;
        return (
            action.type === slice.actions.setJobStatus.type &&
            _action.payload?.jobName === jobName &&
            _action.payload?.status === status
        );
    };
