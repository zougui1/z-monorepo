import { Label } from '../Label';
import { Value } from '../Value';

export const PrimitiveNode = ({ node, diffing }: any) => {
  return (
    <div style={{ display: 'flex' }}>
      <Label>{node.label}:</Label>&nbsp;
      <Value node={node} diffing={diffing} />
    </div>
  )
}
