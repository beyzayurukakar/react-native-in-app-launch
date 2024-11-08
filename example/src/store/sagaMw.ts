import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import { watchInAppLaunchForE } from '../jobs/jobE';
import { watchInAppLaunchForF } from '../jobs/jobF';
import { watchInAppLaunchForG } from '../jobs/jobG';

export const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([watchInAppLaunchForE(), watchInAppLaunchForF(), watchInAppLaunchForG()]);
}

export const runSagas = () => {
    sagaMiddleware.run(rootSaga);
};
