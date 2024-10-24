import { type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { InAppLaunchState } from '../store/types';
import { SLICE_NAME } from '../store/constants';
import { registerListeners } from '../store/listeners';

type InAppLaunchConfig = {
    globalResetActionType?: string;
    listenerMiddleware: ListenerMiddlewareInstance | null;
    sliceSelector: (state: any) => InAppLaunchState;
};

export type InAppLaunchConfigParam = {
    /* TODO: add docs */
    globalResetActionType?: string;
    /* TODO: add docs */
    listenerMiddleware: ListenerMiddlewareInstance | null;
    /* TODO: add docs */
    sliceSelector?: (state: any) => InAppLaunchState;
};

export const inAppLaunchConfig: InAppLaunchConfig = {
    listenerMiddleware: null,
    sliceSelector: (state: any) => state[SLICE_NAME],
};

export const configureInAppLaunch = (config: InAppLaunchConfigParam) => {
    // Listener middleware
    if (config.listenerMiddleware === undefined || config.listenerMiddleware === null) {
        console.warn('TODO: no listener middleware, cannot work');
        return;
    }
    inAppLaunchConfig.listenerMiddleware = config.listenerMiddleware;

    // Global reset action
    inAppLaunchConfig.globalResetActionType = config.globalResetActionType;

    // Custom slice selector
    if (config.sliceSelector) {
        inAppLaunchConfig.sliceSelector = config.sliceSelector;
    }

    registerListeners(config.listenerMiddleware);
};
