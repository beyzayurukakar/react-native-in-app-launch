import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../store/selectors';
import { slice } from '../store/slice';

export const useInAppLaunchEffect = (effect: React.EffectCallback, ...jobNames: string[]) => {
    const areJobsCompleted = useSelector((state: any) =>
        selectors.isJobArrCompleted(state, jobNames)
    );
    const effectRef = useRef(effect);

    const dispatch = useDispatch();

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

    const addToAwaitedJobs = useCallback(
        (jobName: string) => {
            dispatch(slice.actions.addToAwaitedJobs(jobName));
        },
        [dispatch]
    );

    const removeFromAwaitedJobs = useCallback(
        (jobName: string) => {
            dispatch(slice.actions.removeFromAwaitedJobs(jobName));
        },
        [dispatch]
    );

    return {
        addToAwaitedJobs,
        removeFromAwaitedJobs,
    };
};
