import type { PublicUserObject, SessionObject, UserPlatformObject } from '@zougui/auth.database';

export interface AuthResult {
  user: PublicUserObject;
  session: SessionObject;
  userPlatform: UserPlatformObject;
}
