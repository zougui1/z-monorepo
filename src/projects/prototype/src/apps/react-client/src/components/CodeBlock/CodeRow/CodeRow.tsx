import { Box } from '@mui/material';
import { createElement } from 'react-syntax-highlighter';
import clsx from 'clsx';

import { styles } from './CodeRow.styles';

const createRow = ({ row, data }: Pick<CodeRowProps, 'data' | 'row'>) => {
  return createElement({
    ...data,
    node: row,
  });
}

export const CodeRow = ({ data, row, highlight }: CodeRowProps) => {
  return (
    <Box component="span" sx={styles.root} className={clsx({ highlight })}>
      {createRow({ data, row })}
    </Box>
  )
}

export interface CodeRowProps {
  data: Record<string, any>;
  row: Record<string, any>;
  highlight?: boolean | undefined;
}
