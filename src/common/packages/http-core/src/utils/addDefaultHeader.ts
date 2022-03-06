import { HttpRequestConfig } from '../types';

/**
 * @mutate this function mutates `config`
 */
export const addDefaultHeader = (config: HttpRequestConfig, headerName: string, headerValue: string): HttpRequestConfig => {
  config.headers = {
    [headerName]: headerValue,
    ...(config.headers || {}),
  };

  return config;
}
