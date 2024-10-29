import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../store/selectors';

export const useInAppLaunchEffect = (effect: React.EffectCallback, ...jobNames: string[]) => {
    const areJobsCompleted = useSelector((state: any) =>
        selectors.isJobArrCompleted(state, jobNames)
    );
    const effectRef = useRef(effect);

    useEffect(() => {
        /*
        Using an up-to-date reference of `effect`.
        Not using `effect` directly as deps in the next useEffect
        because we want to call it only when `areJobsCompleted` has changed, not when `effect` has changed
        */
        effectRef.current = effect;
    }, [effect]);

    useEffect(() => {
        let unsubscribe: ReturnType<React.EffectCallback>;
        if (areJobsCompleted) {
            unsubscribe = effectRef.current();
        }

        return () => {
            unsubscribe?.();
        };
    }, [areJobsCompleted]);
};
