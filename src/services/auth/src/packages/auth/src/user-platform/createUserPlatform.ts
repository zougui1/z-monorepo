import { UserPlatformObject, userPlatformQueries } from '@zougui/auth.database';
import { parseUserAgent } from '@zougui/common.user-agent';

export const createUserPlatform = async (options: CreateUserPlatformOptions): Promise<UserPlatformObject> => {
  const { userAgent, trusted = false } = options;
  const parsedUserAgent = parseUserAgent(userAgent);

  const userPlatform = await userPlatformQueries.create({
    ...parsedUserAgent,
    userAgent,
    trusted,
  });

  return userPlatform;
}

export interface CreateUserPlatformOptions {
  userAgent: string;
  trusted?: boolean | undefined;
}
