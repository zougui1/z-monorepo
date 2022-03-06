import { createSlice } from '@reduxjs/toolkit';

import { Store } from './Store';

describe('new Store()', () => {
  const initialState = { count: 0 };
  const slice = createSlice({
    name: 'testSlice',
    initialState,
    reducers: {
      increment: state => {
        state.count++;
      },
    },
  });

  describe('when nothing has been dispatched', () => {
    describe('getState()', () => {
      it('should return the initial state', () => {
        const store = new Store(slice.reducer, initialState);

        expect(store.getState()).toEqual({
          count: 0,
        });
      });
    });

    describe('subscribe()', () => {
      it('should not call the listener', () => {
        const listener = jest.fn();

        const store = new Store(slice.reducer, initialState);
        const unlisten = store.subscribe(listener);

        expect(listener).not.toBeCalled();
        unlisten();
      });
    });
  });

  describe('when an action has been dispatched', () => {
    describe('getState()', () => {
      it('should return the updated state', () => {
        const store = new Store(slice.reducer, initialState);

        store.dispatch(slice.actions.increment());

        expect(store.getState()).toEqual({
          count: 1,
        });
      });
    });

    describe('subscribe()', () => {
      it('should call all the listeners', () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        const store = new Store(slice.reducer, initialState);
        const unlisten1 = store.subscribe(listener1);
        const unlisten2 = store.subscribe(listener2);

        store.dispatch(slice.actions.increment());

        expect(listener1).toBeCalledTimes(1);
        expect(listener2).toBeCalledTimes(1);

        unlisten1();
        unlisten2();
      });
    });

    describe('subscribe()()', () => {
      it('should not call the listener', () => {
        const listener = jest.fn();

        const store = new Store(slice.reducer, initialState);
        const unlisten = store.subscribe(listener);
        unlisten();

        store.dispatch(slice.actions.increment());

        expect(listener).not.toBeCalled();
      });
    });
  });
});
