import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../store/selectors';
import { useEffect } from 'react';
import { slice } from '../store/slice';

export const useInAppLaunch = ({ isAnimationComplete }: { isAnimationComplete: boolean }) => {
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
