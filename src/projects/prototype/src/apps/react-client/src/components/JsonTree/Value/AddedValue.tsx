import { Box } from '@mui/material';

import { styles } from './Value.styles';
import { Node } from '../Node';

const unrenderedTypes = ['undefined', 'function'];

const getRenderableValue = (value: unknown, type: string): string => {
  return unrenderedTypes.includes(type)
    ? type
    : JSON.stringify(value, Object.getOwnPropertyNames(Object(value)));
}

export function AddedValue({ node, ...props }: AddedValueProps) {
  return (
    <Box {...props} component="ins" sx={styles.added}>
      {node.isCompletelyDifferent
        ? <Node node={node} />
        : getRenderableValue(node.newValue, node.newType)
      }
    </Box>
  );
}

export interface AddedValueProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  node: any;
}
