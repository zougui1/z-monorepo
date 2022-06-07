import type { PublicUserObject } from '@zougui/auth.database';

export type Roles = 'guest' | 'user' | 'admin';

export const getUserRole = (user: PublicUserObject | undefined): Roles => {
  if (!user) {
    return 'guest';
  }

  return user.isAdmin ? 'admin' : 'user';
}
