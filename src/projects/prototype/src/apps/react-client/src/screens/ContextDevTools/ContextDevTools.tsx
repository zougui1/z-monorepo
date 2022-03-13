import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import { styles } from './ContextDevTools.styles';
import { ActionList } from './ActionList';
import { Visualizer } from './Visualizer';
import type { ActionData } from './types';
import { Tabs } from '../../components/Tabs';
import { contextLogs } from '../../components/Tabs/src/ContextLogs';
import { useForceUpdate } from '../../hooks';

export function ContextDevToolsPanel() {
  const [selectedAction, setSelectedAction] = useState<ActionData>();
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const unsubscribe = contextLogs.subscribe(forceUpdate);

    return unsubscribe;
  }, [forceUpdate]);

  const toggleSelectedAction = (action: ActionData) => {
    setSelectedAction(selectedAction => {
      return selectedAction === action ? undefined : action;
    });
  }

  return (
    <Box sx={styles.root}>
      <Tabs debug={false}>
        <Tabs.Tab title="Actions" panelProps={{ sx: styles.tabPanel }}>
          <div>
            toolbar
          </div>

          <Box sx={styles.mainSection}>
            <Box sx={styles.actionsSubSection}>
              <ActionList
                actions={contextLogs.actions}
                selectedAction={selectedAction}
                onSelect={toggleSelectedAction}
              />
            </Box>

            <Box sx={styles.contextsSubSection}>
              <Visualizer action={selectedAction || contextLogs.actions[contextLogs.actions.length - 1]} />
            </Box>
          </Box>

          <div>
            history
          </div>

          <div>
            toolbar
          </div>
        </Tabs.Tab>
      </Tabs>
    </Box>
  );
}

const arr = new Array(1000).fill(0).map((t, i) => i);

export function ContextDevTools() {
  return (
    <div style={{ display: 'flex' }}>
      <ContextDevToolsPanel />

      <Tabs>
        <Tabs.Tab title="Tab 1">Tab 1</Tabs.Tab>
        <Tabs.Tab title="Tab 2">
          {arr.map(v => (
            <Typography key={v}>{v}</Typography>
          ))}
        </Tabs.Tab>
        <Tabs.Tab title="Tab 3">Tab 3</Tabs.Tab>
        <Tabs.Tab title="Tab 4">Tab 4</Tabs.Tab>
      </Tabs>
    </div>
  );
}
