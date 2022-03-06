import { addDefaultHeader } from '../../utils';
import { RequestInterceptor } from '../../types';

export const interceptToken = (options: InterceptTokenOptions): RequestInterceptor => {
  return {
    onResolved: config => {
      const token = options.getDefaultToken();

      return addDefaultHeader(config, 'Authorization', `Bearer ${token}`);
    },
  };
};

export interface InterceptTokenOptions {
  getDefaultToken: () => string;
}
