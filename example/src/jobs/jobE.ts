import { getSagaPattern, inAppLaunchSlice } from 'react-native-in-app-launch';
import { delay, put, takeEvery } from 'redux-saga/effects';
import { JOB_NAMES } from './constants';
import { getRandomDuration } from './randomDuration';

function* workerJobE() {
    yield put(inAppLaunchSlice.actions.jobStarted(JOB_NAMES.E));
    yield delay(getRandomDuration());
    yield put(inAppLaunchSlice.actions.jobEnded(JOB_NAMES.E));
}

export function* watchInAppLaunchForE() {
    yield takeEvery(getSagaPattern(), workerJobE);
}
