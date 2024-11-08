import { createListenerMiddleware } from '@reduxjs/toolkit';

import { listenersA } from '../jobs/jobA';
import { listenersB } from '../jobs/jobB';
import { listenersC } from '../jobs/jobC';
import { listenersD } from '../jobs/jobD';

export const listenerMiddleware = createListenerMiddleware();

export const startListeners = () => {
    listenersA(listenerMiddleware);
    listenersB(listenerMiddleware);
    listenersC(listenerMiddleware);
    listenersD(listenerMiddleware);
};
