import { AnyAction } from '@reduxjs/toolkit';

import { contextLogs } from '../ContextLogs';
import { Stopwatch } from '../../../../utils';


export class Store<T extends Record<string, any> = Record<string, any>> {
  readonly name: string;
  debug: boolean | undefined = true;
  private id: number = 0;
  private listeners: Record<string, () => void> = {};
  private state: T;
  private reducer: (state: T, action: AnyAction) => T;
  sizeElement: HTMLDivElement | null | undefined;

  constructor(name: string, reducer: (state: T, action: AnyAction) => T, initialState: T) {
    this.name = name;
    this.state = initialState;
    this.reducer = reducer;
  }

  getState = (): T => {
    return this.state;
  }

  dispatch = (action: AnyAction): void => {
    const stopwatch = new Stopwatch<'reducers' | 'total' | 'subscribers'>();

    const previousState = this.state;
    stopwatch.start('reducers', 'total');
    this.state = this.reducer(this.state, action);
    stopwatch.stop('reducers');
    const nextState = this.state;

    stopwatch.start('subscribers');
    for (const listener of Object.values(this.listeners)) {
      listener();
    }
    stopwatch.stop('subscribers', 'total');

    const timings = stopwatch.getTimings({ raw: true });

    if (this.debug !== false) {
      const error = new Error();

      contextLogs.dispatch(action, this, {
        previousState,
        nextState,
        timings,
        stack: error.stack,
      });
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
