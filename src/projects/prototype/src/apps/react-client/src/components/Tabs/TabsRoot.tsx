import { Tabs, TabsProps, Tab, Box } from '@mui/material';
import clsx from 'clsx';

import { useTabsSelector, useTabsActions, TabData } from './context';
import { styles } from './TabsRoot.styles';
import { mergeSx } from '../../utils';

// TODO show a warning when the component change of state between controlled and uncontrolled (controlled = active props !== undefined)
// TODO show a warning when the prop active has a non-existent tab ID (except for empty string which is allowed to take the default active tab)
export function TabsRoot({ active, onActive, ...props }: TabsRootProps) {
  const tabs = useTabsSelector(state => state.tabs);
  const internalActiveTabId = useTabsSelector(state => state.activeTabId);
  const actions = useTabsActions();
  const tabsArr = Object.values(tabs);

  const activeTabId = active ?? internalActiveTabId;

  const defaultActiveTab = tabsArr.find(tab => tab.defaultActive) || tabsArr[0];
  const activeTab: TabData | undefined = (activeTabId && tabs[activeTabId]) || defaultActiveTab;

  const onChange = (e: React.ChangeEvent<{}>, tab: string) => {
    actions.activateTab({ id: tab });

    if (onActive) {
      onActive(tab, e)
    }
  }

  return (
    <>
      <Tabs
        variant="scrollable"
        visibleScrollbar
        {...props}
        sx={mergeSx(styles.tabs, props.sx)}
        value={activeTab?.id}
        onChange={onChange}
      >
        {tabsArr.map(tab => (
          <Tab
            {...tab.titleProps}
            className={clsx('tab', tab.titleProps.className)}
            key={tab.id}
            value={tab.id}
            id={tab.allyProps.tabId}
            aria-controls={tab.allyProps.panelId}
          />
        ))}
      </Tabs>

      {activeTab && (
        <Box
          {...activeTab.panelProps}
          sx={mergeSx(styles.tabPanel, activeTab.panelProps?.sx)}
          key={activeTab.id}
          id={activeTab.allyProps.panelId}
          aria-labelledby={activeTab.allyProps.tabId}
          role="tabpanel"
        >
          {activeTab.panelProps.children}
        </Box>
      )}
    </>
  );
}

export interface TabsRootProps extends TabsProps {
  active?: string | undefined;
  onActive?: (id: string, event: React.ChangeEvent<{}>) => void;
}
