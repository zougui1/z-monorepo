export function Expander({ expanded, style = {}, ...rest }: ExpanderProps) {
  return (
    <span
      {...rest}
      style={{
        display: 'inline-block',
        transition: 'all .1s ease',
        transform: `rotate(${expanded ? 90 : 0}deg) ${style.transform || ''}`,
        ...style,
      }}
    >
      ▶
    </span>
  );
}

export interface ExpanderProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  expanded?: boolean;
}
