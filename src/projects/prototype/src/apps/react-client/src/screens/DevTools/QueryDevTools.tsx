import { useRegisterDevToolTab } from './devtools.hooks';
import { QueryDevTools as QueryDevToolsPanel } from './QueryDevToolsPanel';

const options = {
  name: 'React Query',
  Component: QueryDevToolsPanel,
};

export function QueryDevTools() {
  useRegisterDevToolTab(options);
  return null;
}
