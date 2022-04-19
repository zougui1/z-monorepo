import { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';

import { ms } from '@zougui/common.ms';

import { styles } from './Visualizer.styles';
import { getStackFrames, StackFrameGroup as StackFrameGroupType } from './utils';
import type { ActionData } from '../types';
import { Tabs } from '../../../components/Tabs';
import { JsonTree } from '../../../components/JsonTree';
import { StackFrameGroup } from '../../../components/StackFrameGroup';
import { replaceReactElements } from '../../../components/Tabs/src/utils';

export function Visualizer({ action }: VisualizerProps) {
  const [trace, setTrace] = useState<StackFrameGroupType[]>([]);

  useEffect(() => {
    if (!action.stack) {
      return;
    }

    getStackFrames(action.stack).then(trace => setTrace(trace));
  }, [action.stack]);

  const safeData = useMemo(() => {
    return {
      action: replaceReactElements(action.data),
      nextState: replaceReactElements(action.nextState),
      previousState: replaceReactElements(action.previousState),
    };
  }, [action]);

  return (
    <Tabs scrollButtons={false} debug={false} sx={styles.tabs}>
      <Tabs.Tab title="Action" panelProps={{ sx: styles.tabPanel }}>
        <Box sx={styles.tabContent}>
          <JsonTree value={safeData.action} hideRoot />
        </Box>
      </Tabs.Tab>

      <Tabs.Tab title="Context" panelProps={{ sx: styles.tabPanel }}>
        <Box sx={styles.tabContent}>
          <JsonTree style={{ maxHeight: '100%' }} value={safeData.nextState} label={action.contextName} defaultExpanded />
        </Box>
      </Tabs.Tab>

      <Tabs.Tab title="Diff" panelProps={{ sx: styles.tabPanel }}>
        <Box sx={styles.tabContent}>
          <JsonTree
            value={safeData.nextState}
            originalValue={safeData.previousState}
            label={action.contextName}
            defaultExpanded
          />
        </Box>
      </Tabs.Tab>

      <Tabs.Tab title="Trace" panelProps={{ sx: styles.tabPanel }}>
        <Box sx={styles.tabContent}>
          {trace.map(group => (
            <StackFrameGroup
              key={group.id}
              frames={group.frames}
              collapse={group.type !== 'app'}
              type={group.type}
              sx={styles.collaspedStackFrameGroup}
            />
          ))}
        </Box>
      </Tabs.Tab>

      <Tabs.Tab title="Perf" panelProps={{ sx: styles.tabPanel }}>
        <Box sx={styles.tabContent}>
          <Typography color="text.primary">
            The action's reducer executed in <span>{ms(action.timings.reducers)}</span>
          </Typography>

          <Typography color="text.primary">
            The side effects of the action executed in <span>{ms(action.timings.subscribers)}</span>
          </Typography>

          <Typography color="text.primary">
            The action executed in a total of <span>{ms(action.timings.total)}</span>
          </Typography>
        </Box>
      </Tabs.Tab>
    </Tabs>
  );
}

export interface VisualizerProps {
  action: ActionData;
}
