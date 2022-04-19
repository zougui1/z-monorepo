import { useEffect, DependencyList } from 'react';

import { useDidMount } from '../useDidMount';

export const useUpdate = (onUpdate: () => void, dependencies?: DependencyList): void => {
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount) {
      onUpdate();
    }
  }, dependencies);
}
