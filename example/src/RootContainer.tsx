import Home from './components/home/Home';
import Launch from './components/launch/Launch';
import { useIsLaunchComplete } from 'react-native-in-app-launch';

export default function RootContainer() {
    const isLaunchComplete = useIsLaunchComplete();

    if (isLaunchComplete) {
        return <Home />;
    }

    return <Launch />;
}
