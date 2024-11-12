import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../store/selectors';
import { useEffect } from 'react';
import { slice } from '../store/slice';

type ManageLaunchOptions = {
    /** Launch will not be completed until this value is `true`. Default value is `true`. */
    isAnimationComplete?: boolean;
};

/**
 * To be used in a launch indicator component
 * for updating launch state such that it is:
 * * initialized on mount,
 * * completed when all jobs and animation are done.
 */
export const useManageLaunch = (options: ManageLaunchOptions) => {
    const { isAnimationComplete = true } = options;

    const dispatch = useDispatch();
    const areAllJobsDone = useSelector(selectors.areAllJobsDone);

    useEffect(() => {
        dispatch(slice.actions.initialize());
    }, [dispatch]);

    useEffect(() => {
        if (areAllJobsDone && isAnimationComplete) {
            dispatch(slice.actions.completeInAppLaunch());
        }
    }, [dispatch, areAllJobsDone, isAnimationComplete]);
};
