import { sessionQueries, PublicUserObject } from '@zougui/auth.database';

import { findUserByValidSession } from './findUserByValidSession';

export const findUserByPublicSessionId = async (publicId: string): Promise<PublicUserObject | undefined> => {
  const session = await sessionQueries.findByPublicId(publicId);
  const user = session && await findUserByValidSession(session);

  return user;
}
