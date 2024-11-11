import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchSlice } from 'react-native-in-app-launch';

import { listenerMiddleware, registerListeners } from './listenerMw';
import { sagaMiddleware, runSagas } from './sagaMw';

const reducers = {
    [inAppLaunchSlice.name]: inAppLaunchSlice.reducer,
};

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware).prepend(sagaMiddleware),
});

runSagas();
registerListeners();

export type RootState = ReturnType<typeof store.getState>;
