import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchReducer, inAppLaunchSliceName } from 'react-native-in-app-launch';
import { listenerMiddleware } from './listenerMw';
import { listenersA } from '../jobs/jobA';
import { listenersB } from '../jobs/jobB';
import { listenersC } from '../jobs/jobC';
import { listenersD } from '../jobs/jobD';
import { listenersE } from '../jobs/jobE';

const startListeners = () => {
    listenersA();
    listenersB();
    listenersC();
    listenersD();
    listenersE();
};

const reducers = {
    [inAppLaunchSliceName]: inAppLaunchReducer,
};

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

startListeners();
