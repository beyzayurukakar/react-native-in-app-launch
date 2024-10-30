import { listenerMwTools } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersD = () => {
    listenerMiddleware.startListening({
        predicate: listenerMwTools.inAppLaunchPredicate(JOB_NAMES.A, JOB_NAMES.C),
        effect: async (_action, api) => {
            api.dispatch(listenerMwTools.addToPendingJobsAction(JOB_NAMES.D));
            await api.delay(getRandomDuration());
            api.dispatch(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.D));
        },
    });
};
