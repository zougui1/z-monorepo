import { useState, useEffect, RefObject } from 'react'

export const useResizeObserver = (
  ref: RefObject<HTMLElement>,
): ResizeObserverEntry | undefined => {
  const [entry, setEntry] = useState<ResizeObserverEntry>();

  useEffect(() => {
    const element = ref.current;

    if(!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => setEntry(entry));
    observer.observe(element);

    return () => {
      setEntry(undefined);
      observer.disconnect();
    }
  }, [ref.current]);

  return entry;
}
