import { addDefaultHeader } from '../../utils';
import { RequestInterceptor } from '../../types';

export const interceptLanguage = (options: InterceptLanguageOptions): RequestInterceptor => {
  return {
    onResolved: config => {
      const language = options.getDefaultLanguage();

      return addDefaultHeader(config, 'Content-Language', language);
    },
  };
};

export interface InterceptLanguageOptions {
  getDefaultLanguage: () => string;
}
