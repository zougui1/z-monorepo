import { Box, Typography } from '@mui/material';
import type { BoxTypeMap } from '@mui/material';
import type { OverrideProps } from '@mui/material/OverridableComponent';

import { styles } from './StackFrame.styles';
import { StackFrameCodeBlock } from '../StackFrameCodeBlock';

export function StackFrame({ fileName, file, code, ...rest }: StackFrameProps) {
  return (
    <Box {...rest}>
      <Typography sx={styles.file}>{file}</Typography>
      <Typography sx={styles.fileName}>{fileName}</Typography>

      {code && <StackFrameCodeBlock {...code} />}
    </Box>
  );
}

export interface StackFrameProps extends OverrideProps<BoxTypeMap<{}, 'div'>, 'div'> {
  fileName: string;
  file: string;
  code?: {
    lines: string[];
    startLineNumber?: number | undefined;
    currentLineNumber?: number | undefined;
  };
}
