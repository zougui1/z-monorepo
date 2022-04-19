import { useEffect } from 'react';

export const useMount = (onMount: () => void): void => {
  useEffect(() => {
    onMount();
  }, []);
}
