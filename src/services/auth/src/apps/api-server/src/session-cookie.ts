import type { Request, Response } from 'express';

import { SessionObject } from '@zougui/auth.auth';
import config from '@zougui/common.config/node';
import env from '@zougui/common.env/node';

const sessionCookieName = config.auth.session.cookieName;

export const setSessionCookie = (res: Response, session: SessionObject) => {
  res.cookie(sessionCookieName, session.publicId.toString(), {
    expires: session.expiresAt,
    httpOnly: true,
    sameSite: 'strict',
    secure: env.isProd,
    signed: true,
  });
}

export const removeSessionCookie = (res: Response): void => {
  res.clearCookie(sessionCookieName);
}

export const getSessionCookie = (req: Request): string | undefined => {
  const sessionId = req.signedCookies[sessionCookieName];

  // if it is not a string (a session ID)
  // then it is not a valid session cookie
  if (typeof sessionId === 'string') {
    return sessionId;
  }
}
