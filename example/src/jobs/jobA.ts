import { listenerMwTools } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersA = () => {
    listenerMiddleware.startListening({
        predicate: listenerMwTools.inAppLaunchPredicate(),
        effect: async (_action, api) => {
            api.dispatch(listenerMwTools.addToPendingJobsAction(JOB_NAMES.A));
            await api.delay(getRandomDuration());
            api.dispatch(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.A));
        },
    });
};
