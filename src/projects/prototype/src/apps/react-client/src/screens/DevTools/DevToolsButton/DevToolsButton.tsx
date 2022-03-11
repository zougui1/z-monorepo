import { Fab } from '@mui/material';

import { styles } from './DevToolsButton.styles';
import { DevtoolsIcon } from './DevtoolsIcon';

const ariaLabels = {
  open: 'Open devtools',
  closed: 'Close devtools',
};

export function DevToolsButton({ isOpen, onClick }: DevToolsButtonProps) {
  return (
    <Fab
      sx={styles.root}
      aria-label={ariaLabels[isOpen ? 'open' : 'closed']}
      aria-controls="ReactQueryDevtoolsPanel"
      aria-haspopup="true"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <DevtoolsIcon />
    </Fab>
  );
}

export interface DevToolsButtonProps {
  isOpen: boolean;
  onClick: () => void;
}
