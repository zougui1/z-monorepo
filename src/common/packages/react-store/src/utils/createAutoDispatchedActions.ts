import { Slice } from '@reduxjs/toolkit';

export type OverridenActions<
  TSlice extends Slice,
  T extends TSlice['actions'] = TSlice['actions'],
> = {
  [ActionName in keyof T]: (...args: Parameters<T[ActionName]>) => ReturnType<T[ActionName]>;
}

export const createAutoDispatchedActions = <
  TSlice extends Slice,
  T extends TSlice['actions'] = TSlice['actions'],
>(actions: T, dispatch: (action: ReturnType<T[keyof T]>) => void): OverridenActions<TSlice> => {
  return Object.entries(actions as any).reduce((actions, [actionName, currentAction]) => {
    return {
      ...actions,
      [actionName]: (...args: Parameters<T[keyof T]>) => {
        dispatch((currentAction as any)(...args));
      },
    };
  }, {} as OverridenActions<TSlice>);
}
