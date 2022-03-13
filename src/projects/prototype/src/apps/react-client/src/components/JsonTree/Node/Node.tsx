import { Entry } from '../Entry';
import { PrimitiveNode } from './PrimitiveNode';
import { ComplexNode } from './ComplexNode';

export const Node = ({ node, defaultExpanded, diffing }: any) => {

  return (
    <Entry>
      {node.children?.length
        ? <ComplexNode node={node} defaultExpanded={defaultExpanded} diffing={diffing} />
        : (!diffing || node.differenceValue !== undefined || node.newValue === undefined) && <PrimitiveNode node={node} diffing={diffing} />
      }
    </Entry>
  )
}
