import { login as faLogin } from 'furaffinity-api';

import { cookieA, cookieB } from './constants';

export const login = (): void => {
  faLogin(cookieA, cookieB);
}
