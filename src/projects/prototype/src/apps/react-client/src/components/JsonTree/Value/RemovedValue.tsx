import { Box } from '@mui/material';

import { styles } from './Value.styles';

const unrenderedTypes = ['undefined', 'function'];

const getRenderableValue = (value: unknown, type: string): string => {
  return unrenderedTypes.includes(type)
    ? type
    : JSON.stringify(value, Object.getOwnPropertyNames(Object(value)));
}

export function RemovedValue({ node, ...props }: RemovedValueProps) {
  return (
    <Box {...props} component="del" sx={styles.removed}>
      {getRenderableValue(node.oldValue, node.oldType)}
    </Box>
  );
}

export interface RemovedValueProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  node: any;
}
