import { Provider } from 'react-redux';
import RootContainer from './RootContainer';
import { store } from './store/configuration';
import { configureInAppLaunch } from 'react-native-in-app-launch';
import { listenerMiddleware } from './store/listenerMw';

configureInAppLaunch({
    listenerMiddleware: listenerMiddleware,
});

export default function App() {
    return (
        <Provider store={store}>
            <RootContainer />
        </Provider>
    );
}
