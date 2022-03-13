import { JsonTree } from '../../components/JsonTree';
import { jsonData } from './data';

export function JsonTreeScreen() {
  return (
    <>
      <JsonTree value={jsonData} label="root" />
    </>
  );
}

<div>
<button>Actions</button>
</div>
