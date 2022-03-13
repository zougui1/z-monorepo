import { TabsProvider } from './context';
import { TabsRoot, TabsRootProps } from './TabsRoot';
import { Tab } from './Tab';

export function Tabs({ children, debug, ...props }: TabsProps) {
  return (
    <TabsProvider debug={debug}>
      <TabsRoot {...props} />
      {children}
    </TabsProvider>
  );
}

Tabs.Tab = Tab;

export interface TabsProps extends TabsRootProps {
  children: React.ReactNode;
  debug?: boolean | undefined;
}
