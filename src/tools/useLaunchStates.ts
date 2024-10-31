import { useSelector } from 'react-redux';
import { selectors } from '../store/selectors';

export const useLaunchStates = () => {
    const isInitialized = useSelector(selectors.isInitialized);
    const isWaitingForJobs = useSelector(selectors.isWaitingForJobs);
    const isComplete = useSelector(selectors.isLaunchComplete);
    return {
        isInitialized,
        isWaitingForJobs,
        isComplete,
    };
};
