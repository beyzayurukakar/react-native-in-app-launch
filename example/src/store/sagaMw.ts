import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import { watchInAppLaunchForE } from '../jobs/jobE';
import { watchInAppLaunchForF } from '../jobs/jobF';

export const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([watchInAppLaunchForE(), watchInAppLaunchForF()]);
}

export const runSagas = () => {
    sagaMiddleware.run(rootSaga);
};
