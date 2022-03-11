import _ from 'lodash';

import { DevTools } from './screens/DevTools';
import { TabsScreen } from './screens/TabsScreen';
import { DialogScreen } from './screens/DialogScreen';
import { JsonTreeScreen } from './screens/JsonTreeScreen';
import { ContextDevTools } from './screens/ContextDevTools';

export const routes = [
  DevTools,
  TabsScreen,
  DialogScreen,
  JsonTreeScreen,
  ContextDevTools,
].map(createRoute);

function createRoute(Component: React.FunctionComponent) {
  const snakeName = _.snakeCase(Component.name);
  const name = _.upperFirst(snakeName.replace(/_/g, ' '));
  const route = snakeName.replace(/_/g, '-');

  return {
    name,
    path: `/${route}`,
    component: Component,
    element: <Component />,
  };
}
