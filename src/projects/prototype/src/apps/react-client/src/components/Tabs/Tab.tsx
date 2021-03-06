import { useEffect } from 'react';
import type { TabProps as MuiTabProps, BoxTypeMap } from '@mui/material';
import type { OverrideProps } from '@mui/material/OverridableComponent';

import { useTabsActions } from './context';
import { useId } from '../../hooks';

export function Tab(props: TabProps) {
  const tabsActions = useTabsActions();
  const id = useId(props.id);

  useEffect(() => {
    tabsActions.addTab(id);

    return () => {
      tabsActions.removeTab(id);
    }
  }, [id, tabsActions]);

  useEffect(() => {
    tabsActions.updateTab({
      id,
      titleProps: {
        ...(props.titleProps || {}),
        disabled: props.disabled,
        label: props.title,
      },
      panelProps: {
        ...(props.panelProps || {}),
        children: props.children,
      },
      defaultActive: props.defaultActive,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tabsActions, ...Object.values(props)]);

  return null;
}

export interface TabProps {
  id?: string | undefined;
  title: MuiTabProps['label'];
  titleProps?: Omit<MuiTabProps, 'label' | 'id'> | undefined;
  panelProps?: OverrideProps<BoxTypeMap<{}, 'div'>, 'div'> | undefined;
  disabled?: boolean | undefined;
  children?: React.ReactNode | undefined;
  defaultActive?: boolean | undefined;
}
