import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../store/selectors';
import { useEffect } from 'react';
import { slice } from '../store/slice';

export const useManageLaunch = ({ isAnimationComplete }: { isAnimationComplete?: boolean }) => {
    const _isAnimationComplete = isAnimationComplete === undefined ? true : isAnimationComplete;
    const dispatch = useDispatch();
    const areAllJobsDone = useSelector(selectors.areAllJobsDone);

    useEffect(() => {
        dispatch(slice.actions.initialize());
    }, [dispatch]);

    useEffect(() => {
        if (areAllJobsDone && _isAnimationComplete) {
            dispatch(slice.actions.completeInAppLaunch());
        }
    }, [dispatch, areAllJobsDone, _isAnimationComplete]);
};
