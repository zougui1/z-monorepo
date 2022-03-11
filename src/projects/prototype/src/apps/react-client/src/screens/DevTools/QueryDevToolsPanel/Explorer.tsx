import React from 'react';

export const theme = {
  background: '#0b1521',
  backgroundAlt: '#132337',
  foreground: 'white',
  gray: '#3f4e60',
  grayAlt: '#222e3e',
  inputBackgroundColor: '#fff',
  inputTextColor: '#000',
  success: '#00ab52',
  danger: '#ff0085',
  active: '#006bff',
  warning: '#ffb200',
} as const;

export const Entry = (props: any) => {
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

export const Label = (props: any) => {
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

export const Value = (props: any) => {
  return (
    <span
      {...props}
      style={{
        color: theme.danger,
        ...(props.style || {}),
      }}
    />
  );
}

export const SubEntries = (props: any) => {
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

export const Info = (props: any) => {
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

export const Expander = ({ expanded, style = {}, ...rest }: any) => (
  <span
    style={{
      display: 'inline-block',
      transition: 'all .1s ease',
      transform: `rotate(${expanded ? 90 : 0}deg) ${style.transform || ''}`,
      ...style,
    }}
  >
    ▶
  </span>
)

const DefaultRenderer = ({
  handleEntry,
  label,
  value,
  // path,
  subEntries,
  subEntryPages,
  type,
  // depth,
  expanded,
  toggle,
  pageSize,
}: any) => {
  const [expandedPages, setExpandedPages] = React.useState<any[]>([])

  return (
    <Entry key={label}>
      {subEntryPages?.length ? (
        <>
          <Label onClick={() => toggle()}>
            <Expander expanded={expanded} /> {label}{' '}
            <Info>
              {String(type).toLowerCase() === 'iterable' ? '(Iterable) ' : ''}
              {subEntries.length} {subEntries.length > 1 ? `items` : `item`}
            </Info>
          </Label>
          {expanded ? (
            subEntryPages.length === 1 ? (
              <SubEntries>
                {subEntries.map((entry: any) => handleEntry(entry))}
              </SubEntries>
            ) : (
              <SubEntries>
                {subEntryPages.map((entries: any, index: any) => (
                  <div key={index}>
                    <Entry>
                      <Label
                        onClick={() =>
                          setExpandedPages(old =>
                            old.includes(index)
                              ? old.filter(d => d !== index)
                              : [...old, index]
                          )
                        }
                      >
                        <Expander expanded={expanded} /> [{index * pageSize} ...{' '}
                        {index * pageSize + pageSize - 1}]
                      </Label>
                      {expandedPages.includes(index) ? (
                        <SubEntries>
                          {entries.map((entry: any) => handleEntry(entry))}
                        </SubEntries>
                      ) : null}
                    </Entry>
                  </div>
                ))}
              </SubEntries>
            )
          ) : null}
        </>
      ) : (
        <>
          <Label>{label}:</Label>{' '}
          <Value>
            {JSON.stringify(value, Object.getOwnPropertyNames(Object(value)))}
          </Value>
        </>
      )}
    </Entry>
  )
}

export default function Explorer({
  value,
  defaultExpanded,
  renderer = DefaultRenderer,
  pageSize = 100,
  depth = 0,
  ...rest
}: any) {
  const [expanded, setExpanded] = React.useState<boolean>(defaultExpanded)

  const toggle = (set: any) => {
    setExpanded(old => (typeof set !== 'undefined' ? set : !old))
  }

  const path: string[] = []

  let type: any = typeof value
  let subEntries
  const subEntryPages = []

  const makeProperty = (sub: any) => {
    const newPath = path.concat(sub.label)
    const subDefaultExpanded =
      defaultExpanded === true
        ? { [sub.label]: true }
        : defaultExpanded?.[sub.label]
    return {
      ...sub,
      path: newPath,
      depth: depth + 1,
      defaultExpanded: subDefaultExpanded,
    }
  }

  if (Array.isArray(value)) {
    type = 'array'
    subEntries = value.map((d, i) =>
      makeProperty({
        label: i,
        value: d,
      })
    )
  } else if (
    value !== null &&
    typeof value === 'object' &&
    typeof value[Symbol.iterator] === 'function'
  ) {
    type = 'Iterable'
    subEntries = Array.from(value, (val, i) =>
      makeProperty({
        label: i,
        value: val,
      })
    )
  } else if (typeof value === 'object' && value !== null) {
    type = 'object'
    // eslint-disable-next-line no-shadow
    subEntries = Object.entries(value).map(([label, value]) =>
      makeProperty({
        label,
        value,
      })
    )
  }

  if (subEntries) {
    let i = 0

    while (i < subEntries.length) {
      subEntryPages.push(subEntries.slice(i, i + pageSize))
      i = i + pageSize
    }
  }

  return renderer({
    handleEntry: (entry: any) => (
      <Explorer key={entry.label} renderer={renderer} {...rest} {...entry} />
    ),
    type,
    subEntries,
    subEntryPages,
    depth,
    value,
    path,
    expanded,
    toggle,
    pageSize,
    ...rest,
  })
}
