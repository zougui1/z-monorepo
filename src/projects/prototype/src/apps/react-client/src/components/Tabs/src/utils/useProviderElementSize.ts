import { useState, useRef, useLayoutEffect } from 'react';

export const useProviderElementSize = <T extends HTMLElement>(): [React.MutableRefObject<T | null>, DOMRect] => {
  const [sizeRect, setSizeRect] = useState(new DOMRect(0, 0, 0, 0));
  const elementRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    if (!elementRef.current?.parentElement) return;

    const { parentElement } = elementRef.current;

    let isInProvider = false;

    const rects = Array
      .from(parentElement.children)
      .filter(child => {
        const attr = child.attributes.getNamedItem('data-slot');
        const value = attr?.value;

        if (value === 'start') {
          isInProvider = true;
        } else if (value === 'end') {
          isInProvider = false;
        }

        return value !== 'start' && value !== 'sizing' && isInProvider;
      })
      .map(child => child.getBoundingClientRect());

    const leftMin = Math.min(...rects.map(rect => rect.left));
    const topMin = Math.min(...rects.map(rect => rect.top));
    const rightMax = Math.max(...rects.map(rect => rect.right));
    const bottomMax = Math.max(...rects.map(rect => rect.bottom));
    const width = rightMax - leftMin;
    const height = bottomMax - topMin;

    const rectInProvider = new DOMRect(leftMin, topMin, width, height);

    if (
      sizeRect.x !== rectInProvider.x ||
      sizeRect.y !== rectInProvider.y ||
      sizeRect.width !== rectInProvider.width ||
      sizeRect.height !== rectInProvider.height
    ) {
      setSizeRect(rectInProvider);
    }
  }, [sizeRect]);

  return [elementRef, sizeRect];
}
