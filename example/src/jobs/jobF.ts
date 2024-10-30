import { getSagaPattern, listenerMwTools } from 'react-native-in-app-launch';
import { delay, put, takeEvery } from 'redux-saga/effects';
import { JOB_NAMES } from './jobNames';
import { getRandomDuration } from './randomDuration';

function* workerJobF() {
    yield put(listenerMwTools.addToPendingJobsAction(JOB_NAMES.F));
    yield delay(getRandomDuration());
    yield put(listenerMwTools.removeFromPendingJobsAction(JOB_NAMES.F));
}

export function* watchInAppLaunchForF() {
    yield takeEvery(getSagaPattern(JOB_NAMES.E), workerJobF);
}
