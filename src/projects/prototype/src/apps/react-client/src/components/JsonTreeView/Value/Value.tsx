import { theme } from '../theme';
import { getType } from '../getType';

const unrenderedTypes = ['undefined', 'function'];

export function Value({ value, ...props }: ValueProps) {
  const type = getType(value);

  return (
    <span
      {...props}
      style={{
        color: theme[type],
        ...(props.style || {}),
      }}
    >
      {unrenderedTypes.includes(type)
        ? type
        : JSON.stringify(value, Object.getOwnPropertyNames(Object(value)))
      }
    </span>
  );
}

export interface ValueProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  value: unknown;
}
