import { getListenerPredicate, inAppLaunchSlice } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersA = () => {
    listenerMiddleware.startListening({
        predicate: getListenerPredicate(),
        effect: async (_action, api) => {
            api.dispatch(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.A));
            await api.delay(getRandomDuration());
            api.dispatch(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.A));
        },
    });
};
