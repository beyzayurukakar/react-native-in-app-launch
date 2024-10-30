import { useSelector } from 'react-redux';
import { selectors } from '../store/selectors';

export const useIsLaunchComplete = () => {
    const isLaunchComplete = useSelector(selectors.isLaunchComplete);
    return isLaunchComplete;
};
