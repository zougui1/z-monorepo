import { userQueries, UserPlatformObject, SessionObject } from '@zougui/auth.database';

import type { PublicUser } from './types';

export const createUser = async (options: CreateUserOptions): Promise<PublicUser> => {
  const { userPlatform, session, ...userData } = options;

  const user = await userQueries.create({
    ...userData,
    platforms: [userPlatform],
    sessions: [session],
  }) as PublicUser & { password?: string | undefined };

  delete user.password;

  return user;
}

export interface CreateUserOptions {
  name: string;
  password: string;
  email: string;
  userPlatform: UserPlatformObject;
  session: SessionObject;
  ip: string;
}
