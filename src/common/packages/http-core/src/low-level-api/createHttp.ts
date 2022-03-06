import axios, { AxiosRequestConfig } from 'axios';
import urlJoin from 'url-join';

import { addInterceptorsMethods, overrideCancellableMethods } from './overrides';
import { defaultRequestInterceptors, defaultResponseInterceptors } from './default-interceptors';
import { RequestInterceptor, ResponseInterceptor, HttpInstance } from '../types';

export const createHttp = (options?: CreateHttpOptions): HttpInstance => {
  const http = axios.create(options) as HttpInstance;

  addInterceptorsMethods(http);
  overrideCancellableMethods(http);

  http.addRequestInterceptors(...defaultRequestInterceptors, ...(options?.interceptors?.request ?? []));
  http.addResponseInterceptors(...defaultResponseInterceptors, ...(options?.interceptors?.response ?? []));

  http.baseUrl = options?.baseURL;

  return http;
}

export interface CreateHttpOptions extends Omit<AxiosRequestConfig, 'requestId'> {
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
}
