import { getListenerPredicate, inAppLaunchSlice } from 'react-native-in-app-launch';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './constants';
import type { ListenerMiddlewareInstance } from '@reduxjs/toolkit';

export const listenersB = (listenerMiddleware: ListenerMiddlewareInstance) => {
    listenerMiddleware.startListening({
        predicate: getListenerPredicate(JOB_NAMES.A),
        effect: async (_action, api) => {
            api.dispatch(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.B));
            await api.delay(getRandomDuration());
            api.dispatch(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.B));
        },
    });
};
