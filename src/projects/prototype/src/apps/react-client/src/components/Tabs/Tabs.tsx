import { TabsProvider } from './context';
import { TabsRoot, TabsRootProps } from './TabsRoot';
import { Tab } from './Tab';

export function Tabs({ children, ...props }: TabsProps) {
  return (
    <TabsProvider>
      <TabsRoot {...props} />
      {children}
    </TabsProvider>
  );
}

Tabs.Tab = Tab;

export interface TabsProps extends TabsRootProps {
  children: React.ReactNode;
}
