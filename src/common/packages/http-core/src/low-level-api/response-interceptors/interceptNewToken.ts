import { isHttpError } from '../isHttpError';
import { ResponseInterceptor } from '../../types';

export const interceptNewToken = (options: InterceptNewTokenOptions): ResponseInterceptor => {
  return {
    onResolved: response => {
      const newToken = response.headers['access-token'];

      if (newToken) {
        options.onAuthorized(newToken);
      }

      return response;
    },

    onRejected: async error => {
      if (isHttpError(error) && error.response?.data.code === 401) {
        options.onUnauthorized();
      }

      return error;
    },
  };
};

export interface InterceptNewTokenOptions {
  onAuthorized: (newToken: string) => void;
  onUnauthorized: () => void;
}
