import { listenerMwTools } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersC = () => {
    listenerMiddleware.startListening({
        predicate: listenerMwTools.jobDependencyPredicate(),
        effect: async (_action, api) => {
            api.dispatch(listenerMwTools.addToPendingJobsAction(JOB_NAMES.C));
            await api.delay(getRandomDuration());
            api.dispatch(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.C));
        },
    });
};
