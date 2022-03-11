export function Label(props: LabelProps) {
  return (
    <span
      {...props}
      style={{
        cursor: 'pointer',
        color: 'white',
        ...(props.style || {}),
      }}
    />
  );
}

export interface LabelProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {

}
