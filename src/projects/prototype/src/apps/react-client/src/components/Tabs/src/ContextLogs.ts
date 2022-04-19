import { AnyAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

import type { Store } from './utils/Store';
import type { ActionData } from '../../../screens/ContextDevTools/types';

class ContextLogs {
  private id: number = 0;
  private listeners: Record<string, () => void> = {};
  contexts: Record<string, Store[]> = {};
  actions: ActionData[] = [];
  contextsActions: Map<Store, ActionData[]> = new Map();

  constructor() {
    const state = {};

    this.actions.push({
      id: nanoid(),
      contextName: 'ContextLog',
      timestamp: Date.now(),
      previousState: state,
      nextState: state,
      timings: {
        reducers: 0,
        subscribers: 0,
        total: 0,
      },

      data: {
        type: '@@INIT',
      },
    });
  }

  registerStore = (store: Store): void => {
    this.contexts[store.name] ||= [];
    this.contexts[store.name]?.push(store);
    this.contextsActions.set(store, []);
    this.callListeners();
  }

  unregisterStore = (store: Store): void => {
    const stores = this.contexts[store.name];

    if (stores) {
      this.contexts[store.name] = stores.filter(currentStore => currentStore !== store);
    }

    this.contextsActions.delete(store);
    this.callListeners();
  }

  getContexts = (): Record<string, Store[]> => {
    return this.contexts;
  }

  dispatch = (action: AnyAction, store: Store<any>, options: LogDispatchOptions): void => {
    const actionLog: ActionData = {
      ...options,
      id: nanoid(),
      contextName: store.name,
      timestamp: Date.now(),
      data: action,
    };

    this.actions.push(actionLog);
    this.contextsActions.get(store)?.push(actionLog);

    this.callListeners();
  }

  callListeners = (): void => {
    for (const listener of Object.values(this.listeners)) {
      listener();
    }
  }

  subscribe = (listener: (() => void)): (() => void) => {
    const id = this.id++;
    this.listeners[id] = listener;

    return () => {
      delete this.listeners[id];
    }
  }
}

export const contextLogs = new ContextLogs();

export interface LogDispatchOptions {
  previousState: any;
  nextState: any;
  stack?: string | undefined;
  timings: ActionData['timings'];
}
