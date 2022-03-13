export function Info(props: InfoProps) {
  return (
    <span
      {...props}
      style={{
        color: 'grey',
        fontSize: '.7em',
        ...(props.style || {}),
      }}
    />
  );
}

export interface InfoProps extends React.PropsWithoutRef<JSX.IntrinsicElements['span']> {

}
