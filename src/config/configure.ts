import { type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { InAppLaunchState } from '../store/types';
import { registerListeners } from '../store/listeners';
import { inAppLaunchConfig } from './configuration';

export type InAppLaunchConfigParam = {
    /* TODO: add docs */
    globalResetActionType?: string;
    /* TODO: add docs */
    listenerMiddleware: ListenerMiddlewareInstance | null;
    /* TODO: add docs */
    sliceSelector?: (state: any) => InAppLaunchState;
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
