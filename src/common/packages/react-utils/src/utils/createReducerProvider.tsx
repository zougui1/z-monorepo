import React, { useMemo, useRef } from 'react';
import { Slice } from '@reduxjs/toolkit';

import { Store } from './Store';
import { createAutoDispatchedActions } from './createAutoDispatchedActions';
import { InternalSliceState } from '../types';

export const createReducerProvider = (options: CreateReducerProviderOptions) => {
  const { Context, reducer, initialState } = options;

  function SliceContextProvider({ children }: SliceContextProviderProps) {
    const privateStore = useMemo(() => new Store(reducer, initialState), []);

    const actions = useMemo(() => {
      return createAutoDispatchedActions(options.actions, privateStore.dispatch)
    }, [privateStore.dispatch]);

    const publicStore = useRef<InternalSliceState>({
      actions,
      getState: privateStore.getState,
      subscribe: privateStore.subscribe,
      dispatch: privateStore.dispatch,
    });

    return (
      <Context.Provider value={publicStore.current}>
        {children}
      </Context.Provider>
    );
  }

  return SliceContextProvider;
}

export interface SliceContextProviderProps {
  children?: React.ReactNode;
}

export interface CreateReducerProviderOptions {
  Context: React.Context<any>;
  reducer: (state: any, action: any) => any;
  initialState: any;
  actions: Slice['actions'];
}
