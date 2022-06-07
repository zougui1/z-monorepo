import { HttpSource, Fetch, HttpResponse } from '@zougui/common.http-core';
import {
  loginBodySchema,
  LoginBody,
  LoginResponse,
  signupBodySchema,
  SignupBody,
  SignupResponse,
} from '@zougui/auth.dto/v1';

export class AuthHttp extends HttpSource {
  constructor(baseUrl: string) {
    super(`${baseUrl}/api/v1`);
  }

  signup = (body: SignupBody): Fetch<HttpResponse<SignupResponse>, any, any, typeof signupBodySchema> => {
    return this.post<HttpResponse<SignupResponse>, typeof signupBodySchema>('auth/signup', { body, schema: signupBodySchema });
  }

  login = (body: LoginBody): Fetch<HttpResponse<LoginResponse>, any, any, typeof loginBodySchema> => {
    return this.post<HttpResponse<LoginResponse>, typeof loginBodySchema>('auth/login', { body, schema: loginBodySchema });
  }
}
