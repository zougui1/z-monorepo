import { useState } from 'react';
import { Tabs, TabsProps, Tab } from '@mui/material';

import { useTabsSelector, TabData } from './context';

// TODO show a warning when the component change of state between controlled and uncontrolled (controlled = active props !== undefined)
// TODO show a warning when the prop active has a non-existent tab ID (except for empty string which is allowed to take the default active tab)
export function TabsRoot({ active, onActive, ...props }: TabsRootProps) {
  const tabs = useTabsSelector(state => state.tabs);
  const [internalActiveTabId, setInternalActiveTabId] = useState<string | undefined>();
  const tabsArr = Object.values(tabs);

  const activeTabId = active ?? internalActiveTabId;

  const defaultActiveTab = tabsArr.find(tab => tab.defaultActive) || tabsArr[0];
  const activeTab: TabData | undefined = (activeTabId && tabs[activeTabId]) || defaultActiveTab;

  const onChange = (e: React.ChangeEvent<{}>, tab: string) => {
    if (onActive) {
      onActive(tab, e)
    } else {
      setInternalActiveTabId(tab);
    }
  }

  return (
    <>
      <Tabs
        variant="scrollable"
        visibleScrollbar
        {...props}
        value={activeTab?.id}
        onChange={onChange}
      >
        {tabsArr.map(tab => (
          <Tab
            {...tab.titleProps}
            key={tab.id}
            value={tab.id}
            id={tab.allyProps.tabId}
            aria-controls={tab.allyProps.panelId}
          />
        ))}
      </Tabs>

      {activeTab && (
        <div
          {...activeTab.panelProps}
          id={activeTab.allyProps.panelId}
          aria-labelledby={activeTab.allyProps.tabId}
          role="tabpanel"
        >
          {activeTab.panelProps.children}
        </div>
      )}
    </>
  );
}

export interface TabsRootProps extends TabsProps {
  active?: string | undefined;
  onActive?: (id: string, event: React.ChangeEvent<{}>) => void;
}
