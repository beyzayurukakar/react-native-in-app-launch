import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchSlice } from 'react-native-in-app-launch';

import { listenerMiddleware, startListeners } from './listenerMw';
import { runSagas, sagaMiddleware } from './sagaMw';

const reducers = {
    [inAppLaunchSlice.name]: inAppLaunchSlice.reducer,
};

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware).prepend(sagaMiddleware),
});

runSagas();
startListeners();
