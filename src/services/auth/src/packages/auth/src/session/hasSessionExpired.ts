import { SessionObject } from '@zougui/auth.database';

export const hasSessionExpired = (session: SessionObject): boolean => {
  return session.expiresAt.getTime() <= Date.now();
}
