import { useEffect, useRef, useLayoutEffect } from 'react';

import { useProviderElementSize } from './useProviderElementSize';
import type { Store } from './Store';
import { useForceUpdate } from '../../../../hooks';

export function HtmlSentry({ store }: HtmlSentryProps) {
  const forceUpdate = useForceUpdate();
  const divSizingRef = useRef<null | HTMLDivElement>(null);

  const [divSentryRef, sizeRect] = useProviderElementSize<HTMLDivElement>();

  useEffect(() => {
    const unsubscribe = store.subscribe(forceUpdate);

    return unsubscribe;
  }, [store, forceUpdate]);

  useLayoutEffect(() => {
    store.sizeElement = divSizingRef.current;

    return () => {
      store.sizeElement = undefined;
    }
  }, [store, forceUpdate, sizeRect]);

  return (
    <>
      <div ref={divSentryRef} data-slot="start" style={{ display: 'none' }} />
      <div
        ref={divSizingRef}
        data-slot="sizing"
        style={{
          opacity: 0,
          position: 'absolute',
          top: sizeRect.top,
          left: sizeRect.left,
          width: sizeRect.width,
          height: sizeRect.height,
        }}
      />
    </>
  );
}

export interface HtmlSentryProps {
  store: Store;
}
