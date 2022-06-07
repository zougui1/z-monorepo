import type { UserObject, UserPlatformObject, SessionObject } from '@zougui/auth.database';

export interface PublicUser extends Omit<UserObject, 'password'> {};

export interface CreatedUser extends Omit<PublicUser, 'platforms' | 'sessions'> {
  platforms: UserPlatformObject[];
  sessions: SessionObject[];
}
