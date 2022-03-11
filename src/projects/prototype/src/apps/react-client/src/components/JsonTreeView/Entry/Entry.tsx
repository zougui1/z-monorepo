export function Entry(props: EntryProps) {
  return (
    <div
      {...props}
      style={{
        fontFamily: 'Menlo, monospace',
        fontSize: '1em',
        lineHeight: '1.7',
        outline: 'none',
        wordBreak: 'break-word',
        ...(props.style || {}),
      }}
    />
  );
}

export interface EntryProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {

}
