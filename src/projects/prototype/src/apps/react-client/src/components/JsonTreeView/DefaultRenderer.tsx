import { useState } from 'react';

import { Entry } from './Entry';
import { Label } from './Label';
import { Expander } from './Expander';
import { Info } from './Info';
import { SubEntries } from './SubEntries';
import { Value } from './Value';

export const DefaultRenderer = ({
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
  const [expandedPages, setExpandedPages] = useState<any[]>([])

  return (
    <Entry key={label}>
      {subEntryPages?.length ? (
        <>
          <Label onClick={() => toggle()}>
            <Expander expanded={expanded} /> {label}{' '}
            <Info>
              {String(type) === 'iterable' && '(Iterable) '}
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
          <Value value={value} />
          {/*JSON.stringify(value, Object.getOwnPropertyNames(Object(value)))*/}
        </>
      )}
    </Entry>
  )
}
