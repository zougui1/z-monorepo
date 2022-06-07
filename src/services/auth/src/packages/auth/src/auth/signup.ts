import { hashPassword } from '@zougui/common.crypto/node';

import type { AuthResult } from './types';
import { createUser } from '../user';
import { createUserPlatform } from '../user-platform';
import { createSession } from '../session';

export const signup = async (options: SignupOptions): Promise<AuthResult> => {
  const password = await hashPassword(options.password);
  const userPlatform = await createUserPlatform({
    userAgent: options.userAgent,
    trusted: true,
  });
  const session = await createSession({
    ip: options.ip,
    platform: userPlatform,
  });

  const user = await createUser({
    ...options,
    password,
    userPlatform,
    session,
  });

  return {
    user,
    session,
    userPlatform,
  };
}

export interface SignupOptions {
  name: string;
  password: string;
  email: string;
  userAgent: string;
  ip: string;
}
