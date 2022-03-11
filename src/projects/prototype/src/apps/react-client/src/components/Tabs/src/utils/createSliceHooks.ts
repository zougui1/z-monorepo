import React, { useContext, useDebugValue } from 'react';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { SliceCaseReducers } from '@reduxjs/toolkit';

import { InternalSliceState } from '../types';

export const createSliceHooks = <
  State extends Record<string, any> = Record<string, any>,
  CR extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  TContext extends React.Context<InternalSliceState<State, CR> | undefined> = React.Context<InternalSliceState<State, CR> | undefined>,
>(Context: TContext, name: string) => {

  const useSliceContext = (): InternalSliceState<State, CR> => {
    const context = useContext(Context);

    if (!context) {
      throw new Error(`Can't use the context "${name}" without its provider in the component tree.`);
    }

    return context;
  }

  const useSliceSelector = <T>(selector: ((state: State) => T)): T => {
    const context = useSliceContext();

    const value = useSyncExternalStoreWithSelector(
      context.subscribe,
      context.getState,
      context.getState,
      selector,
      Object.is,
    );

    useDebugValue(value);

    return value;
  }

  const useSliceActions = () => {
    const context = useSliceContext();
    useDebugValue(context.actions);

    return context.actions;
  }

  return {
    useSliceSelector,
    useSliceActions,
  };
}
