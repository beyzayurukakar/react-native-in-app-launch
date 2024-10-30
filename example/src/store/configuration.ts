import { configureStore } from '@reduxjs/toolkit';
import { inAppLaunchSlice } from 'react-native-in-app-launch';

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();

import { listenerMiddleware } from './listenerMw';
import { listenersA } from '../jobs/jobA';
import { listenersB } from '../jobs/jobB';
import { listenersC } from '../jobs/jobC';
import { listenersD } from '../jobs/jobD';
import { watchInAppLaunchForE } from '../jobs/jobE';
import { all } from 'redux-saga/effects';
import { watchInAppLaunchForF } from '../jobs/jobF';

const startListeners = () => {
    listenersA();
    listenersB();
    listenersC();
    listenersD();
};

function* rootSaga() {
    yield all([watchInAppLaunchForE(), watchInAppLaunchForF()]);
}

const reducers = {
    [inAppLaunchSlice.name]: inAppLaunchSlice.reducer,
};

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware).prepend(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
startListeners();
