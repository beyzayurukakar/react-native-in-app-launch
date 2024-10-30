import { listenerMwTools } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersE = () => {
    listenerMiddleware.startListening({
        predicate: listenerMwTools.inAppLaunchPredicate(JOB_NAMES.D),
        effect: async (_action, api) => {
            api.dispatch(listenerMwTools.addToPendingJobsAction(JOB_NAMES.E));
            await api.delay(getRandomDuration());
            api.dispatch(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.E));
        },
    });
};
