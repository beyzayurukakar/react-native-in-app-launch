import { getSagaPattern, listenerMwTools } from 'react-native-in-app-launch';
import { all, call, delay, put, take } from 'redux-saga/effects';
import { JOB_NAMES } from './jobNames';
import { getRandomDuration } from './randomDuration';

function* workerJobE() {
    yield put(listenerMwTools.addToPendingJobsAction(JOB_NAMES.E));
    yield delay(getRandomDuration());
    yield put(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.E));
}

export function* watchInAppLaunchForE() {
    // eslint-disable-next-line prettier/prettier
    yield all([
        take(getSagaPattern(JOB_NAMES.B)), 
        take(getSagaPattern(JOB_NAMES.D))
    ]);
    yield call(workerJobE);
}
