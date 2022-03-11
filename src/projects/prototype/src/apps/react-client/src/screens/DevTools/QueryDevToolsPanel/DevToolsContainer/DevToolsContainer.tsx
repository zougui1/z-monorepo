import { Box } from '@mui/material';

import { styles } from './DevToolsContainer.styles';

export function DevToolsContainer({ children, height }: DevToolsContainerProps) {
  return (
    <Box component="div" sx={[styles.root, { height }]}>
      {children}
    </Box>
  );
}

export interface DevToolsContainerProps {
  height: number;
  children: React.ReactNode;
}
