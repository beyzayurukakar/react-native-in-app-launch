import { INITIAL_STATE, slice } from '../store/slice';
import { renderWithSetup } from '../utils/test-utils';

const makeChangesInState = (store: ReturnType<typeof renderWithSetup>['store']) => {
    store.dispatch(slice.actions.initialize());
    store.dispatch(slice.actions.jobStarted('a'));
    store.dispatch(slice.actions.jobStarted('b'));
    store.dispatch(slice.actions.jobEnded('a'));
    store.dispatch(slice.actions.jobEnded('b'));
    store.dispatch(slice.actions.setAllJobsDone());
    store.dispatch(slice.actions.completeInAppLaunch());
};

describe('Resetting', () => {
    it('resets state to default when reset action is dispatched', () => {
        const { store } = renderWithSetup(null, {
            withListenerMiddleware: false,
        });

        makeChangesInState(store);

        // Reset
        store.dispatch(slice.actions.reset());

        // Expect state to be resetted to initial state
        expect(store.getState().inAppLaunch).toEqual(INITIAL_STATE);
    });
});
