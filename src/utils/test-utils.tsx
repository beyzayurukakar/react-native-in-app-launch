import {
    configureStore,
    createListenerMiddleware,
    Tuple,
    type ListenerMiddlewareInstance,
} from '@reduxjs/toolkit';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { slice } from '../store/slice';
import { render } from '@testing-library/react-native';
import { useLaunchStates, useManageLaunch } from '../tools';
import { Text, View } from 'react-native';
import { configureInAppLaunch } from '../config/configure';

export const renderWithSetup = (
    ui: React.ReactElement,
    options?: {
        withListenerMiddleware?: boolean;
        startListeners?: (listenerMw: ListenerMiddlewareInstance) => void;
    }
) => {
    let listenerMiddleware: ListenerMiddlewareInstance | undefined;
    if (options?.withListenerMiddleware === true) {
        listenerMiddleware = createListenerMiddleware();
        configureInAppLaunch({
            listenerMiddleware,
        });
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
        options?.startListeners?.(listenerMiddleware);
    }

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper }),
    };
};

export const Launch = (props: { isAnimationComplete?: boolean }) => {
    const { isAnimationComplete = true } = props;

    useManageLaunch({ isAnimationComplete });

    const { isInitialized, isWaitingForJobs, isComplete } = useLaunchStates();

    return (
        <View>
            <Text testID="isInitialized">{isInitialized}</Text>
            <Text testID="isWaitingForJobs">{isWaitingForJobs}</Text>
            <Text testID="isComplete">{isComplete}</Text>
        </View>
    );
};

export const configureLaunch = () => {
    const listenerMiddleware = createListenerMiddleware();

    return listenerMiddleware;
};
