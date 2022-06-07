import { Injectable, ExecutionContext, CanActivate, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { findUserByPublicSessionId } from '@zougui/auth.auth';

import { getSessionCookie } from './session-cookie';
import { getUserRole, Roles } from './getUserRole';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private options: AuthGuardOptions) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const sessionId = getSessionCookie(request);

    const user = sessionId && await findUserByPublicSessionId(sessionId);
    const userRole = getUserRole(user);

    if (user) {
      (request as any).user = user;
    }

    const hasRole = this.options.roles.includes(userRole);

    if (!hasRole && userRole === 'guest') {
      throw new UnauthorizedException();
    }

    return hasRole;
  }
}

export interface AuthGuardOptions {
  roles?: Roles[] | undefined;
}
