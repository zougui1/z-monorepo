import { JsonTreeView } from '../../components/JsonTreeView';
import { jsonData } from './data';

export function JsonTreeScreen() {
  return (
    <>
      <JsonTreeView value={jsonData} label="root" />
    </>
  );
}
