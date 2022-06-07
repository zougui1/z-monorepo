import { useState, RefObject } from 'react';

import { useRefEvent } from './useRefEvent';

export const useHover = (ref: RefObject<HTMLElement>): boolean => {
  const [isHover, setIsHover] = useState(false);

  useRefEvent(ref, 'mouseenter', e => {
    setIsHover(true);
  });

  useRefEvent(ref, 'mouseleave', e => {
    setIsHover(false);
  });

  return isHover;
}

export interface MouseEnterListener {
  addEventListener(event: 'mouseenter', listener: (this: Window, ev: WindowEventMap['mouseenter']) => any): any;
  removeEventListener(event: 'mouseenter', listener: (this: Window, ev: WindowEventMap['mouseenter']) => any): any;
}
