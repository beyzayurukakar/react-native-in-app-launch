import { listenerMwTools } from 'react-native-in-app-launch';
import { listenerMiddleware } from '../store/listenerMw';
import { getRandomDuration } from './randomDuration';
import { JOB_NAMES } from './jobNames';

export const listenersB = () => {
    listenerMiddleware.startListening({
        predicate: listenerMwTools.jobDependencyPredicate(JOB_NAMES.A),
        effect: async (_action, api) => {
            api.dispatch(listenerMwTools.addToPendingJobsAction(JOB_NAMES.B));
            await api.delay(getRandomDuration());
            api.dispatch(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.B));
        },
    });
};
