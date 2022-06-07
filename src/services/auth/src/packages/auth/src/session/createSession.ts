import { nanoid } from 'nanoid';

import { sessionQueries, SessionObject, UserPlatformObject } from '@zougui/auth.database';
import { ms } from '@zougui/common.ms';
import config from '@zougui/common.config/node';

export const createSession = async (options: CreateSessionOptions): Promise<SessionObject> => {
  const expiresAt = new Date(Date.now() + ms(config.auth.session.duration));

  const session = await sessionQueries.create({
    ...options,
    publicId: nanoid(),
    expiresAt,
    lastVisitDate: new Date(),
    openedPages: 0,
  });

  return session;
}

export interface CreateSessionOptions {
  platform: UserPlatformObject;
  ip: string;
}
