import { Controller, Post, Body, Ip, Res, UsePipes, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';

import { signup, login } from '@zougui/auth.auth';
import { YupValidationPipe } from '@zougui/common.api-server-utils';
import { loginBodySchema, signupBodySchema, LoginBody, SignupBody } from '@zougui/auth.dto/v1';

import { setSessionCookie, removeSessionCookie } from '../session-cookie';

// --------------------------------------------------------
//TODO-----------------------------------------------------
//* -------------------------------------------------------
//? -------------------------------------------------------
//! -------------------------------------------------------
//! need a route to get the user by a valid public session ID
//! that will be used by other services
//! -------------------------------------------------------
//? -------------------------------------------------------
//* -------------------------------------------------------
//TODO-----------------------------------------------------
// --------------------------------------------------------

// TODO schemas

@Controller('api/v1/auth')
export class AuthControllerV1 {
  @Post('signup')
  @UsePipes(new YupValidationPipe(signupBodySchema))
  async signup(
    @Body() body: SignupBody,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const result = await signup({
      ...body,
      ip,
    });
    setSessionCookie(res, result?.session);

    return result?.user;
  }

  @Post('login')
  @UsePipes(new YupValidationPipe(loginBodySchema))
  async login(
    @Body() body: LoginBody,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const result = await login({
      ...body,
      ip,
    });

    if (!result) {
      removeSessionCookie(res);
      throw new UnauthorizedException();
    }

    setSessionCookie(res, result?.session);

    return result.user;
  }
}
