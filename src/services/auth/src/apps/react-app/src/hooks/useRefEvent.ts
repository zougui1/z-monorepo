import { useEffect, RefObject } from 'react';

export function useRefEvent<K extends keyof HTMLElementEventMap>(
  ref: RefObject<HTMLElement>,
  name: K,
  listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => any,
): void {
  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.addEventListener(name, listener);

    return () => {
      element.removeEventListener(name, listener);
    }
  }, [ref.current, name, listener]);
}
