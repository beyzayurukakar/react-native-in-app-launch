import { getListenerPredicate, inAppLaunchSlice } from 'react-native-in-app-launch';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './constants';
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';

export const listenersD = (listenerMiddleware: ListenerMiddlewareInstance) => {
    listenerMiddleware.startListening({
        predicate: getListenerPredicate(JOB_NAMES.A, JOB_NAMES.C),
        effect: async (_action, api) => {
            api.dispatch(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.D));
            await api.delay(getRandomDuration());
            api.dispatch(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.D));
        },
    });
};
