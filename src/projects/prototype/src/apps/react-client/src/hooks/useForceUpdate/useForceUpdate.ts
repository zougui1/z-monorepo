import { useState, useCallback } from 'react';

export const useForceUpdate = (): (() => void) => {
  const [, setForceUpdate] = useState({});

  const forceUpdate = useCallback(() => {
    setForceUpdate({});
  }, []);

  return forceUpdate;
}
