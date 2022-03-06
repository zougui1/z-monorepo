import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { createContext } from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { createSliceHooks } from './createSliceHooks';
import { createReducerProvider } from './createReducerProvider';
import { InternalSliceState } from '../types';

const contextName = 'TestContext';

const createHooks = (canProvide: boolean) => {
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
  const { useSliceSelector, useSliceActions } = createSliceHooks<typeof initialState>(Context, contextName);
  const Provider = createReducerProvider({
    Context,
    initialState,
    actions: slice.actions,
    reducer: slice.reducer,
  });
  const wrapper = canProvide ? Provider : undefined;

  return {
    renderUseSelector: <T>(selector: ((state: typeof initialState) => T)) => {
      return renderHook(() => useSliceSelector(selector), {
        wrapper,
      });
    },

    renderUseActions: () => {
      return renderHook(() => useSliceActions(), {
        wrapper,
      });
    },
  };
}

describe('createSliceHooks()', () => {
  describe('when no context is provided', () => {
    const canProvide = false;

    describe('useSliceSelector()', () => {
      it('should throw an error', () => {
        const { renderUseSelector } = createHooks(canProvide);
        const { result } = renderUseSelector(state => state.count);

        expect(result.error).toEqual(expect.any(Error));
        expect(result.error?.message).toContain(contextName);
      });
    });

    describe('useSliceActions()', () => {
      it('should throw an error', () => {
        const { renderUseActions } = createHooks(canProvide);
        const { result } = renderUseActions();

        expect(result.error).toEqual(expect.any(Error));
        expect(result.error?.message).toContain(contextName);
      });
    });
  });

  describe('when a context is provided', () => {
    const canProvide = true;

    describe('useSliceSelector()', () => {
      it('should return the current count', () => {
        const count = 0;
        const { renderUseSelector } = createHooks(canProvide);
        const { result } = renderUseSelector(state => state.count);

        expect(result.current).toBe(count);
      });
    });

    describe('useSliceActions()', () => {
      it('should return an object of actions', () => {
        const { renderUseActions } = createHooks(canProvide);
        const { result } = renderUseActions();

        expect(result.current).toEqual({
          increment: expect.any(Function),
        });
      });
    });
  });
});
