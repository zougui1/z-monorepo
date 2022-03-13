import { useState } from 'react';
import { Box, ListItem, ListItemButton, ListItemText, ButtonGroup, Button, Typography } from '@mui/material';

import { styles } from './ActionItem.styles';
import type { ActionData } from '../../types';

const padNumber = (num: number, maxLength: number): string => {
  return String(num).padStart(maxLength, '0');
}

const getTimestamp = (action: ActionData, previousAction?: ActionData | undefined): string => {
  if (!previousAction) {
    const date = new Date(action.timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const date = new Date(action.timestamp - previousAction.timestamp);
  const minutes = padNumber(date.getMinutes(), 2);
  const seconds = padNumber(date.getSeconds(), 2);
  const milliseconds = padNumber(date.getMilliseconds(), 2);

  return `+${minutes}:${seconds}.${milliseconds}`;
}

export function ActionItem({ action, previousAction, onSelect, selected }: ActionItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const timestamp = getTimestamp(action, previousAction);

  return (
    <ListItem
      disablePadding
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      secondaryAction={(
        <div>
          {isHovered ? (
            <ButtonGroup sx={styles.buttonGroup}>
              <Button sx={styles.button}>Jump</Button>
              <Button sx={styles.button}>Skip</Button>
            </ButtonGroup>
          ) : (
            <Box sx={styles.timestampContainer}>
              <Typography color="text.secondary">
                {timestamp}
              </Typography>
            </Box>
          )}
        </div>
      )}
    >
      <ListItemButton onClick={() => onSelect(action)} selected={selected}>
        <ListItemText primary={action.data.type} sx={styles.actionText} />
      </ListItemButton>
    </ListItem>
  );
}

export interface ActionItemProps {
  action: ActionData;
  previousAction?: ActionData | undefined;
  onSelect: (action: ActionData) => void;
  selected: boolean;
}
