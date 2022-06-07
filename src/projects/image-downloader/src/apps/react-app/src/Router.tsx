import {
  ReactLocation,
  Router as ReactLocationRouter,
  Outlet,
} from '@tanstack/react-location';
import { ReactLocationDevtools } from '@tanstack/react-location-devtools';

import { Header } from './globals/Header';
import { routes } from './routes';

const location = new ReactLocation();

export const Router = () => {
  return (
    <ReactLocationRouter
      location={location}
      routes={routes}
    >
      <Header />

      <div style={{ marginTop: 64 }}>
        <Outlet />
      </div>

      <ReactLocationDevtools initialIsOpen={false} />
    </ReactLocationRouter>
  );
}
