import { Slice } from '@reduxjs/toolkit';

export type OverridenActions<T extends Slice['actions']> = {
  [ActionName in keyof T]: (...args: Parameters<T[ActionName]>) => ReturnType<T[ActionName]>;
}

export const createAutoDispatchedActions = <T extends Slice['actions']>(actions: T, dispatch: (action: ReturnType<T[keyof T]>) => void): OverridenActions<T> => {
  return Object.entries(actions).reduce((actions, [actionName, currentAction]) => {
    return {
      ...actions,
      [actionName]: (...args: Parameters<T[keyof T]>) => {
        dispatch((currentAction as any)(...args));
      },
    };
  }, {} as OverridenActions<T>);
}
