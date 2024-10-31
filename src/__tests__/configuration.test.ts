import { createListenerMiddleware, type ListenerMiddlewareInstance } from '@reduxjs/toolkit';
import { configureInAppLaunch, type InAppLaunchConfigParam } from '../config/configure';
import { inAppLaunchConfig } from '../config/configuration';
import type { InAppLaunchState } from '../store/types';
import { SLICE_NAME } from '../store/constants';

describe('Configuration', () => {
    const DEFAULT_CONFIG = {
        ...inAppLaunchConfig,
    };
    beforeEach(() => {
        Object.assign(inAppLaunchConfig, DEFAULT_CONFIG);
    });
    it.failing('throws error when listener middleware is not provided', () => {
        configureInAppLaunch({} as InAppLaunchConfigParam);
    });
    it.failing('throws error when invalid listener middleware is provided', () => {
        configureInAppLaunch({
            listenerMiddleware: {} as ListenerMiddlewareInstance,
        });
    });
    it('sets all options in config', () => {
        const listenerMw = createListenerMiddleware();
        const globalResetActionType = 'reset';
        const sliceSelector = (state: any) => state as InAppLaunchState;
        configureInAppLaunch({
            listenerMiddleware: listenerMw,
            globalResetActionType,
            sliceSelector,
        });

        expect(inAppLaunchConfig.listenerMiddleware).toBe(listenerMw);
        expect(inAppLaunchConfig.globalResetActionType).toBe(globalResetActionType);
        expect(inAppLaunchConfig.sliceSelector).toBe(sliceSelector);
    });
    it('has default sliceSelector value if not set', () => {
        const listenerMw = createListenerMiddleware();
        configureInAppLaunch({
            listenerMiddleware: listenerMw,
        });

        const mockState = {
            [SLICE_NAME]: 'test',
        };

        expect(inAppLaunchConfig.sliceSelector(mockState)).toBe('test');
    });
});
