import { getSagaPattern, inAppLaunchSlice } from 'react-native-in-app-launch';
import { all, call, delay, put, take } from 'redux-saga/effects';
import { JOB_NAMES } from './jobNames';
import { getRandomDuration } from './randomDuration';

function* workerJobE() {
    yield put(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.E));
    yield delay(getRandomDuration());
    yield put(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.E));
}

export function* watchInAppLaunchForE() {
    yield all([take(getSagaPattern(JOB_NAMES.B)), take(getSagaPattern(JOB_NAMES.D))]);
    yield call(workerJobE);
}
