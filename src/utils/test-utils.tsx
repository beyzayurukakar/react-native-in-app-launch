import { configureStore } from '@reduxjs/toolkit';
import type { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { slice } from '../store/slice';
import { render } from '@testing-library/react-native';

export const renderWithProviders = (ui: React.ReactElement) => {
    const store = configureStore({
        reducer: {
            [slice.name]: slice.reducer,
        },
    });

    const Wrapper = ({ children }: PropsWithChildren) => (
        <Provider store={store}>{children}</Provider>
    );

    // Return an object with the store and all of RTL's query functions
    return {
        store,
        ...render(ui, { wrapper: Wrapper }),
    };
};
