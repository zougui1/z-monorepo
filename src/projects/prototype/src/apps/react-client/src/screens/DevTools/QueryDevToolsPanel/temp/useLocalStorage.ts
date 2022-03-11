import { Dispatch, SetStateAction, useCallback, useState, useRef, useLayoutEffect } from 'react';

// TODO @zougui/common.env
export const isBrowser = typeof window !== 'undefined';
// TODO @zougui/common.utils.function
export const noop = () => {};

export type ParserOptions<T> =
  | {
      raw: true;
    }
  | {
      raw: false;
      serializer: (value: T) => string;
      deserializer: (value: string) => T;
    };

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: ParserOptions<T>,
): [T, Dispatch<SetStateAction<T>>, () => void];
export function useLocalStorage<T>(
  key: string,
  initialValue?: T | undefined,
  options?: ParserOptions<T | undefined>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void];
export function useLocalStorage<T>(
  key: string,
  initialValue?: T | undefined,
  options?: ParserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
  if (!isBrowser) {
    return [initialValue as T, noop, noop];
  }
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const deserializer = options
    ? options.raw === true
      ? (value: any) => value
      : options.deserializer
    : JSON.parse;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const initializer = useRef((key: string) => {
    try {
      const serializer = options ? (options.raw === true ? String : options.serializer) : JSON.stringify;

      const localStorageValue = localStorage.getItem(key);
      if (localStorageValue !== null) {
        return deserializer(localStorageValue);
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue));
        return initialValue;
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. JSON.parse and JSON.stringify
      // can throw, too.
      return initialValue;
    }
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState<T | undefined>(() => initializer.current(key));

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const initialize = useCallback(() => {
    setState(initializer.current(key))
  }, [key]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => initialize(), [initialize]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (valOrFunc) => {
      try {
        const newState =
          typeof valOrFunc === 'function' ? (valOrFunc as Function)(state) : valOrFunc;
        if (typeof newState === 'undefined') return;
        let value: string;

        if (options)
          if (options.raw === true)
            if (typeof newState === 'string') value = newState;
            else value = JSON.stringify(newState);
          else if (options.serializer) value = options.serializer(newState);
          else value = JSON.stringify(newState);
        else value = JSON.stringify(newState);

        localStorage.setItem(key, value);
        setState(deserializer(value));
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, setState]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key);
      initialize();
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw.
    }
  }, [key, initialize]);

  return [state, set, remove];
};
