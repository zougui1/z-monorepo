import { createContext, useContext, useState, useEffect } from 'react';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import { createReducerProvider } from './createReducerProvider';
import { InternalSliceState } from '../types';

const renderCurrent = (props: { subscribe?: boolean } = {}) => {
  const initialState = { count: 0 };
  const slice = createSlice({
    name: 'TestContext',
    initialState,
    reducers: {
      increment: state => {
        state.count++;
      },
    },
  });

  type ContextType = InternalSliceState<typeof initialState, SliceCaseReducers<typeof initialState>>;

  const Context = createContext<ContextType | undefined>(undefined);

  const Provider = createReducerProvider({
    reducer: slice.reducer,
    actions: slice.actions,
    initialState,
    Context,
  });

  function TestComponent({ subscribe }: { subscribe?: boolean }) {
    const [, forceUpdate] = useState({});
    const context = useContext(Context);

    useEffect(() => {
      if (!context || !subscribe) {
        return;
      }

      const unsubscribe = context.subscribe(() => forceUpdate({}));

      return () => {
        unsubscribe();
      }
    }, [context]);

    if (!context) {
      throw new Error('No context provided');
    }

    return (
      <div>
        <p aria-label="count">{context.getState().count}</p>
        <button onClick={() => context.dispatch(slice.actions.increment())}>dispatch</button>
        <button onClick={() => context.actions.increment()}>action</button>
        <button onClick={() => forceUpdate({})}>forceUpdate</button>
      </div>
    );
  }

  const renderResults = render(
    <Provider>
      <TestComponent {...props} />
    </Provider>
  );

  return {
    ...renderResults,
    actions: slice.actions,
  };
}

describe('createReducerProvider()', () => {
  describe('when no action is dispatched', () => {
    it('should provide a context with reducer to the component tree', () => {
      renderCurrent();

      const initialCountElement = screen.getByLabelText('count');
      expect(initialCountElement).toBeInTheDocument();
      expect(initialCountElement).toHaveTextContent('0');
    });
  });

  describe('when not subscribed', () => {
    describe('when an action is dispatched using the function dispatch', () => {
      it('should not automatically update the component', () => {
        renderCurrent();

        const dispatchButton = screen.getByText('dispatch');
        fireEvent.click(dispatchButton);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('0');
      });

      it('should update the component when an update has been triggered', () => {
        renderCurrent();

        const dispatchButton = screen.getByText('dispatch');
        fireEvent.click(dispatchButton);

        const forceUpdate = screen.getByText('forceUpdate');
        fireEvent.click(forceUpdate);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('1');
      });
    });

    describe('when an action is dispatched using the object actions', () => {
      it('should not automatically update the component', () => {
        renderCurrent();

        const actionButton = screen.getByText('action');
        fireEvent.click(actionButton);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('0');
      });

      it('should update the component when an update has been triggered', () => {
        renderCurrent();

        const actionButton = screen.getByText('action');
        fireEvent.click(actionButton);

        const forceUpdate = screen.getByText('forceUpdate');
        fireEvent.click(forceUpdate);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('1');
      });
    });
  });

  describe('when subscribed', () => {
    const props = {
      subscribe: true,
    };

    describe('when an action is dispatched using the function dispatch', () => {
      it('should automatically update the component', () => {
        renderCurrent(props);

        const dispatchButton = screen.getByText('dispatch');
        fireEvent.click(dispatchButton);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('1');
      });
    });

    describe('when an action is dispatched using the object actions', () => {
      it('should automatically update the component', () => {
        renderCurrent(props);

        const actionButton = screen.getByText('action');
        fireEvent.click(actionButton);

        const initialCountElement = screen.getByLabelText('count');
        expect(initialCountElement).toBeInTheDocument();
        expect(initialCountElement).toHaveTextContent('1');
      });
    });
  });
});
