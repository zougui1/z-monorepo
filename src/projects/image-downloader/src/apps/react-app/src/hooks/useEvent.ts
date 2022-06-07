import { useEffect } from 'react';

import type { AnyElement, AnyElementEventMap } from '~/types';

export function useEvent<K extends keyof WindowEventMap>(
  name: K,
  listener: (this: Window, event: WindowEventMap[K]) => any,
  element?: Window | undefined,
): void;
export function useEvent<K extends keyof DocumentEventMap>(
  name: K,
  listener: (this: Document, event: DocumentEventMap[K]) => any,
  element: Document,
): void;
export function useEvent<K extends keyof HTMLElementEventMap>(
  name: K,
  listener: (this: HTMLElement, event: HTMLElementEventMap[K]) => any,
  element: HTMLElement,
): void;
export function useEvent<K extends keyof AnyElementEventMap>(
  name: K,
  listener: (this: AnyElement, event: AnyElementEventMap[K]) => any,
  element?: AnyElement | undefined,
): void;
export function useEvent<K extends keyof AnyElementEventMap>(
  name: K,
  listener: (this: AnyElement, event: AnyElementEventMap[K]) => any,
  element?: AnyElement | undefined,
): void {
  const actualElement = element || window;

  useEffect(() => {
    actualElement.addEventListener(name, listener as EventListener);

    return () => {
      actualElement.removeEventListener(name, listener as EventListener);
    }
  }, [name, listener, actualElement]);
}
