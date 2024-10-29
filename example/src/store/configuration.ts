import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchReducer, inAppLaunchSliceName } from 'react-native-in-app-launch';
import { listenerMiddleware } from './listenerMw';

export const store = configureStore({
    reducer: {
        [inAppLaunchSliceName]: inAppLaunchReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
