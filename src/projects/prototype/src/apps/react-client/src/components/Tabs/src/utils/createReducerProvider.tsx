import React, { useMemo, useRef, useEffect } from 'react';
import { Slice } from '@reduxjs/toolkit';

import { HtmlSentry } from './HtmlSentry';
import { Store } from './Store';
import { createAutoDispatchedActions } from './createAutoDispatchedActions';
import { contextLogs } from '../ContextLogs';
import { InternalSliceState } from '../types';

export const createReducerProvider = (options: CreateReducerProviderOptions) => {
  const { name, Context, reducer, initialState } = options;

  function SliceContextProvider({ children, debug }: SliceContextProviderProps) {
    const privateStore = useMemo(() => new Store(name, reducer, initialState), []);
    privateStore.debug = debug;

    const actions = useMemo(() => {
      return createAutoDispatchedActions(options.actions, privateStore.dispatch)
    }, [privateStore.dispatch]);

    const publicStore = useRef<InternalSliceState>({
      actions,
      getState: privateStore.getState,
      subscribe: privateStore.subscribe,
      dispatch: privateStore.dispatch,
    });

    useEffect(() => {
      if (privateStore.debug === false) {
        return;
      }

      contextLogs.registerStore(privateStore);

      return () => {
        contextLogs.unregisterStore(privateStore);
      }
    }, [privateStore]);

    return (
      <Context.Provider value={publicStore.current}>
        <HtmlSentry store={privateStore} />
        {children}
        <div data-slot="end" style={{ display: 'none' }} />
      </Context.Provider>
    );
  }

  return SliceContextProvider;
}

export interface SliceContextProviderProps {
  children?: React.ReactNode;
  debug?: boolean | undefined;
}

export interface CreateReducerProviderOptions {
  name: string;
  Context: React.Context<any>;
  reducer: (state: any, action: any) => any;
  initialState: any;
  actions: Slice['actions'];
}
