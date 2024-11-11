import { createListenerMiddleware } from '@reduxjs/toolkit';

import { listenersA } from '../jobs/jobA';
import { listenersB } from '../jobs/jobB';
import { listenersC } from '../jobs/jobC';
import { listenersD } from '../jobs/jobD';
import { registerInAppLaunchListeners } from 'react-native-in-app-launch';

export const listenerMiddleware = createListenerMiddleware();

export const registerListeners = () => {
    registerInAppLaunchListeners(listenerMiddleware);
    listenersA(listenerMiddleware);
    listenersB(listenerMiddleware);
    listenersC(listenerMiddleware);
    listenersD(listenerMiddleware);
};
