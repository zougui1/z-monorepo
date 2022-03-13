export function SubEntries(props: SubEntriesProps) {
  return (
    <div
      {...props}
      style={{
        marginLeft: '.1em',
        paddingLeft: '1em',
        borderLeft: '2px solid rgba(0,0,0,.15)',
        ...(props.style || {}),
      }}
    />
  );
}

export interface SubEntriesProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {

}
