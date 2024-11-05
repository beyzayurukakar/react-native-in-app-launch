import { type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import type { InAppLaunchState } from '../store/types';
import { SLICE_NAME } from '../store/constants';

type InAppLaunchConfig = {
    listenerMiddleware: ListenerMiddlewareInstance | null;
    sliceSelector: (state: any) => InAppLaunchState;
};

export const inAppLaunchConfig: InAppLaunchConfig = {
    listenerMiddleware: null,
    sliceSelector: (state: any) => state[SLICE_NAME],
};
