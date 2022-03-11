import { useEffect } from 'react';

import { useDevToolsActions, RegisterTabOptions } from './devtools.context';

export const useRegisterDevToolTab = (options: RegisterTabOptions) => {
  const actions = useDevToolsActions();

  useEffect(() => {
    actions.registerTab(options)
  }, [actions, options]);
}
