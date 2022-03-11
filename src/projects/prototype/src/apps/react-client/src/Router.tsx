import { Route, Routes } from 'react-router-dom';

import { HomeScreen } from './screens/HomeScreen';
import { routes } from './routes';

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />

      {routes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route element={<HomeScreen />} />
    </Routes>
  );
}
