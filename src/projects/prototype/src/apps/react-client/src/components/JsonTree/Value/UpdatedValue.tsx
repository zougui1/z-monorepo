import { Box } from '@mui/material';

import { styles } from './Value.styles';
import { Node } from '../Node';

const unrenderedTypes = ['undefined', 'function'];

const getRenderableValue = (value: unknown, type: string): string => {
  return unrenderedTypes.includes(type)
    ? type
    : JSON.stringify(value, Object.getOwnPropertyNames(Object(value)));
}

export function UpdatedValue({ node, ...props }: UpdatedValueProps) {

  return (
    <Box {...props} sx={styles.container}>
      <span>
        <Box component="del" sx={styles.removed}>
          {getRenderableValue(node.oldValue, node.oldType)}
        </Box>
      </span>

      <span>
        &nbsp;=&gt;&nbsp;
      </span>

      <Box component="ins" sx={styles.added}>
        {node.newType === 'object' ? (
          <Node node={node} />
        ) : getRenderableValue(node.newValue, node.newType)}
      </Box>
    </Box>
  );
}

export interface UpdatedValueProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  node: any;
}
