import { Box, SxProps, Theme } from '@mui/material';

import { styles } from './QueryStatus.styles';
import { Code } from '../styledComponents';

export function QueryStatus({ label, queryCount, backgroundColor, sx = {} }: QueryStatusProps) {
  return (
    <Box
      component="span"
      sx={[
        styles.root,
        sx as any,
        { backgroundColor },
        queryCount > 0 && styles.root.hasQueries,
      ]}
    >
      {label} <Code>({queryCount})</Code>
    </Box>
  );
}

export interface QueryStatusProps {
  backgroundColor: string;
  queryCount: number;
  label: string;
  sx?: SxProps<Theme> | undefined;
}
