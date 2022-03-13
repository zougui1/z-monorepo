import { List } from '@mui/material';

import { ActionItem } from './ActionItem';
import type { ActionData } from '../types';

export function ActionList({ actions, onSelect, selectedAction }: ActionListProps) {
  return (
    <List>
      {actions.map((action, index) => (
        <ActionItem
          key={action.id}
          action={action}
          previousAction={actions[index - 1]}
          onSelect={onSelect}
          selected={selectedAction === action}
        />
      ))}
    </List>
  );
}

export interface ActionListProps {
  actions: ActionData[];
  selectedAction?: ActionData | undefined;
  onSelect: (action: ActionData) => void;
}
