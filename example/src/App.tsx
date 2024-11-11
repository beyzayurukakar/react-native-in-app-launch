import { Provider } from 'react-redux';
import RootContainer from './RootContainer';
import { store } from './store/configuration';

export default function App() {
    return (
        <Provider store={store}>
            <RootContainer />
        </Provider>
    );
}
