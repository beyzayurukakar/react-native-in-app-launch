import { getSagaPattern, inAppLaunchSlice } from 'react-native-in-app-launch';
import { all, call, delay, put, take } from 'redux-saga/effects';
import { JOB_NAMES } from './constants';
import { getRandomDuration } from './randomDuration';

function* workerJobG() {
    yield put(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.G));
    yield delay(getRandomDuration());
    yield put(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.G));
}

export function* watchInAppLaunchForG() {
    yield all([take(getSagaPattern(JOB_NAMES.B)), take(getSagaPattern(JOB_NAMES.F))]);
    yield call(workerJobG);
}
