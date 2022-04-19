
import { useState } from 'react';

import { Node } from './Node';
import { Label } from '../Label';
import { Expander } from '../Expander';
import { Info } from '../Info';
import { SubEntries } from '../SubEntries';

const getEntriesCount = (entries: unknown[], type: string) => {
  const count = entries.length;
  const plural = count > 1;

  switch (type) {
    case 'iterable':
      return `(Iterable) ${count} ${plural ? 'items' : 'item'}`;
    case 'array':
      return `${count} ${plural ? 'items' : 'item'}`;

    default:
      return `${count} ${plural ? 'keys' : 'key'}`;
  }
}

export const ComplexNode = ({ node, defaultExpanded, diffing }: any) => {
  const [expanded, setExpanded] = useState<boolean>(!!defaultExpanded);

  const toggle = () => {
    setExpanded(old => !old)
  }

  return (
    <>
      <Label onClick={() => toggle()}>
        <Expander expanded={expanded} /> {node.label}{' '}
        <Info>
          {getEntriesCount(node.children, String(node.type))}
        </Info>
      </Label>

      {expanded && (
        <SubEntries>
          {node.children.map((childNode: any) => (
            <Node
              {...childNode}
              key={childNode.id}
              node={childNode}
              diffing={diffing}
            />
          ))}
        </SubEntries>
      )}
    </>
  )
}
