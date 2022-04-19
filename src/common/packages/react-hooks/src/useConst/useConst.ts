import { useRef } from 'react';

import { useUpdate } from '../lifecycle';

export const useConst = <T>(value: T | (() => T), options?: UseConstOptions): T => {
  const warnOnChange = options?.warnOnChange ?? typeof value !== 'function';

  const originalRef = useRef<T | (() => T)>();
  const ref = useRef<T>();

  if (originalRef.current === undefined) {
    originalRef.current = value;
  }

  if (ref.current === undefined) {
    ref.current = typeof value === 'function' ? (value as (() => T))() : value;
  }

  useUpdate(() => {
    if (warnOnChange) {
      console.group('useConst');
      console.warn('The value used as a constant has changed');
      console.log('Original value:', originalRef.current);
      console.log('New value:', value);
      console.info('The value returned by useConst will not change');
      console.groupEnd();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return ref.current;
}

export interface UseConstOptions {
  /**
   * warn if the value changes.
   * default: true if the value is not a function
   */
  warnOnChange?: boolean;
}
