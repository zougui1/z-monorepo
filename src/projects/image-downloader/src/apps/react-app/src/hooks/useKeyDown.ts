import { useState } from 'react';

import { useEvent } from './useEvent';
import type { AnyElement } from '~/types';

export const useKeyDown = (key: string, element: AnyElement | undefined = window): boolean => {
  const [isDown, setIsDown] = useState(false);

  useEvent('keydown', e => {
    if (e.key === key) {
      setIsDown(true);
    }
  }, element);

  useEvent('keyup', e => {
    if (e.key === key) {
      setIsDown(false);
    }
  }, element);

  return isDown;
}

export interface KeyDownListener {
  addEventListener(event: 'keydown', listener: (this: Window, ev: WindowEventMap['keydown']) => any): any;
  removeEventListener(event: 'keydown', listener: (this: Window, ev: WindowEventMap['keydown']) => any): any;
}
