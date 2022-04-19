import { Entry } from '../Entry';
import { PrimitiveNode } from './PrimitiveNode';
import { ComplexNode } from './ComplexNode';

export const Node = ({ node, defaultExpanded, diffing }: any) => {
  const hasChildren = node.children?.length > 0;
  const isDifferent = !diffing || node.differenceValue !== undefined || node.newValue === undefined;
  const hasUniqueChild = node.children?.length === 1;

  return (
    <Entry>
      {hasChildren
        ? <ComplexNode node={node} defaultExpanded={defaultExpanded || hasUniqueChild} diffing={diffing} />
        : isDifferent && <PrimitiveNode node={node} diffing={diffing} />
      }
    </Entry>
  )
}
