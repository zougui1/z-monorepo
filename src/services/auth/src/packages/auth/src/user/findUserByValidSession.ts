import { userQueries, PublicUserObject, SessionObject } from '@zougui/auth.database';

import { hasSessionExpired } from '../session';

export const findUserByValidSession = async (session: SessionObject): Promise<PublicUserObject | undefined> => {
  if(hasSessionExpired(session)) {
    return;
  }

  const user = await userQueries.findBySessionId(session._id);

  return user;
}
