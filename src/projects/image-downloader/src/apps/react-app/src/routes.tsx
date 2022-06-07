import {
  Route,
  DefaultGenerics,
} from '@tanstack/react-location';

import { HomeScreen } from './screens/HomeScreen';
import { GalleryScreen } from './screens/GalleryScreen';

export const routes: Route<DefaultGenerics>[] = [
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/gallery',
    element: <GalleryScreen />,
  },
];
