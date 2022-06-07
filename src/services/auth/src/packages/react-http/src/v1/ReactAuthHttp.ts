import { ReactHttp, ReactMutation } from '@zougui/common.react-http-core';
import { authHttp, HttpResponse } from '@zougui/auth.http/browser/v1';
import type {
  loginBodySchema,
  LoginResponse,
  signupBodySchema,
  SignupResponse,
} from '@zougui/auth.dto/v1';

export class ReactAuthHttp extends ReactHttp {
  signup = (): ReactMutation<HttpResponse<SignupResponse>, unknown, typeof signupBodySchema> => {
    return this.getMutation<HttpResponse<SignupResponse>, unknown, typeof signupBodySchema>(body => {
      return authHttp.signup(body).withCredentials();
    });
  }

  login = (): ReactMutation<HttpResponse<LoginResponse>, unknown, typeof loginBodySchema> => {
    return this.getMutation<HttpResponse<SignupResponse>, unknown, typeof loginBodySchema>(body => {
      return authHttp.login(body).withCredentials();
    });
  }
}

export const reactAuthHttp = new ReactAuthHttp();
reactAuthHttp.login()
