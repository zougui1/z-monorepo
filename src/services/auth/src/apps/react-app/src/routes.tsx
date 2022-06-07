import {
  Route,
  DefaultGenerics,
} from '@tanstack/react-location';

import { HomeScreen } from './screens/HomeScreen';
import { SignupScreen } from './screens/SignupScreen';
import { LoginScreen } from './screens/LoginScreen';
import { FormScreen } from './screens/FormScreen';

export const routes: Route<DefaultGenerics>[] = [
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/form',
    element: <FormScreen />,
  },
];
