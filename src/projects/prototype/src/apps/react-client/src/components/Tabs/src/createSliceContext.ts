import { createContext } from 'react';
import { createSlice } from '@reduxjs/toolkit';
import type { CreateSliceOptions, Slice, SliceCaseReducers, CaseReducerActions } from '@reduxjs/toolkit';

import { createReducerProvider, createSliceHooks, OverridenActions, SliceContextProviderProps } from './utils';
import { InternalSliceState } from './types';

export const createSliceContext = <
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
>(options: CreateSliceContextOptions<State, CR, Name>): SliceContext<State, CR, Name> => {
  const initialState = typeof options.initialState === 'function'
    ? (options.initialState as (() => State))()
    : options.initialState;

  const slice = createSlice(options);
  const Context = createContext<InternalSliceState<State, CR> | undefined>(undefined);
  Context.displayName = options.name;

  const SliceContextProvider = createReducerProvider({
    name: options.name,
    Context,
    reducer: slice.reducer,
    actions: slice.actions,
    initialState,
  });

  const {
    useSliceSelector,
    useSliceActions,
  } = createSliceHooks<State, CR>(Context, options.name);

  return {
    slice,
    Provider: SliceContextProvider,
    useSelector: useSliceSelector,
    useActions: useSliceActions,
  };
}

export interface CreateSliceContextOptions<
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> extends CreateSliceOptions<State, CR, Name> {

}

export interface SliceContext<
  State extends Record<string, any> = Record<string, any>,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Name extends string = string,
> {
  Provider: (props: SliceContextProviderProps) => JSX.Element;
  slice: Slice<State, CaseReducers, Name>;
  useSelector: <T>(selector: ((state: State) => T)) => T;
  useActions: () => OverridenActions<CaseReducerActions<CaseReducers>>;
}
