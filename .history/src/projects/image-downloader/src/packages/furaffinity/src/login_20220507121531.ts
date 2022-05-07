import { login as faLogin } from 'furaffinity-api';

import { cookieA, cookieB } from './constants';

export const login = (): void => {
  faLogin(cookieA, cookieB);
}

export const wrapLogin = <TArgs extends any[], TReturn> (func: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn => {
  return (...args: TArgs): TReturn => {
    login();
    return func(...args);
  }
}
