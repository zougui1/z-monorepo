import { Node } from './Node';
import { makeDifferentialTree } from './makeDifferentialTree';

export function JsonTree({
  value,
  originalValue,
  defaultExpanded,
  hideRoot,
  label,
  ...rest
}: JsonTreeViewProps) {
  const tree = makeDifferentialTree({ oldValue: originalValue, newValue: value, label });

  if (hideRoot) {
    return (
      <div {...rest}>
        {tree.children?.map((node: any) => (
          <JsonTree
            key={node.id}
            value={node.newValue}
            originalValue={node.oldValue}
            label={node.label}
          />
        ))}
      </div>
    );
  }

  return (
    <div {...rest}>
      <Node
        node={tree}
        defaultExpanded={defaultExpanded}
        diffing={!!originalValue}
      />
    </div>
  );
}

export interface JsonTreeViewProps {
  value: any;
  originalValue?: any;
  label?: string | undefined;
  defaultExpanded?: boolean | any | undefined;
  hideRoot?: boolean | undefined;
  [index: string]: any;
}
