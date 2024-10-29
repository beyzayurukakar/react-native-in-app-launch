import { useEffect, type PropsWithChildren } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../store/selectors';
import { slice } from '../store/slice';

const InAppLaunch = (
    props: PropsWithChildren<{
        isAnimationComplete: boolean;
    }>
) => {
    const dispatch = useDispatch();
    const areAllJobsDone = useSelector(selectors.areAllJobsDone);

    useEffect(() => {
        dispatch(slice.actions.initialize());
    }, [dispatch]);

    useEffect(() => {
        if (areAllJobsDone && props.isAnimationComplete) {
            dispatch(slice.actions.completeInAppLaunch());
        }
    }, [dispatch, areAllJobsDone, props.isAnimationComplete]);

    return props.children;
};

export default InAppLaunch;
