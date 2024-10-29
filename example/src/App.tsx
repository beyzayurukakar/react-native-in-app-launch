import Home from './components/home/Home';
import Launch from './components/launch/Launch';

export default function App() {
    const isLaunchComplete = false;

    if (isLaunchComplete) {
        return <Home />;
    }

    return <Launch />;
}
