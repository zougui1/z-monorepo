import { useRef } from 'react';

import { useMount } from '../useMount';

export const useDidMount = (): boolean => {
  const didMount = useRef(false);

  useMount(() => {
    didMount.current = true;
  });

  return didMount.current;
}
