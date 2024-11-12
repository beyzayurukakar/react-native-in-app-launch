import { useSelector } from 'react-redux';
import { selectors } from '../store/selectors';

/**
 * @returns True if launch is complete, false if not.
 */
export const useIsLaunchComplete = () => {
    const isLaunchComplete = useSelector(selectors.isLaunchComplete);
    return isLaunchComplete;
};
