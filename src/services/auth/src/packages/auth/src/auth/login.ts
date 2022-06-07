import { verifyHash } from '@zougui/common.crypto/node';
import { userQueries } from '@zougui/auth.database';

import type { AuthResult } from './types';
import { createUserPlatform } from '../user-platform';
import { createSession } from '../session';

export const login = async (options: LoginOptions): Promise<AuthResult | undefined> => {
  const user = await userQueries.findByEmail(options.email, { withPassword: true });

  // TODO check a random "password" when the user was not found
  // TODO to prevent timing attacks
  if (!user) {
    return;
  }

  const { password, ...publicUser } = user;
  const { isValid } = await verifyHash(password, options.password);

  if (!isValid) {
    return;
  }

  const existingPlatform = user.platforms.find(platform => platform.userAgent === options.userAgent);
  const userPlatform = existingPlatform || await createUserPlatform({ userAgent: options.userAgent });

  const session = await createSession({
    ip: options.ip,
    platform: userPlatform,
  });

  await userQueries.addSessionAndPlatform(user._id, session, userPlatform);

  return {
    user: publicUser,
    userPlatform,
    session: session,
  };
}

export interface LoginOptions {
  password: string;
  email: string;
  ip: string;
  userAgent: string;
}
