import { RemovedValue } from './RemovedValue';
import { AddedValue } from './AddedValue';
import { UpdatedValue } from './UpdatedValue';
import { theme } from '../theme';

const unrenderedTypes = ['undefined', 'function'];

const getRenderableValue = (value: unknown, type: string): string => {
  return unrenderedTypes.includes(type)
    ? type
    : JSON.stringify(value, Object.getOwnPropertyNames(Object(value)));
}

export function Value({ node, diffing, ...props }: ValueProps) {
  if (diffing && node.differenceValue !== undefined && node.oldValue !== node.newValue) {
    if (node.newValue === undefined) {
      return <RemovedValue {...props} node={node} />
    }

    if (node.oldValue === undefined) {
      return <AddedValue {...props} node={node} />
    }

    return (
      <UpdatedValue {...props} node={node} />
    );
  }

  return (
    <span
      {...props}
      style={{
        color: (theme as any)[node.differenceType as any],
        ...(props.style || {}),
      }}
    >
      {getRenderableValue(node.differenceValue, node.differenceType)}
    </span>
  );
}

export interface ValueProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  node: any;
  diffing?: boolean | undefined;
}
