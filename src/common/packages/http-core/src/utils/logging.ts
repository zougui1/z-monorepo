import urlJoin from 'url-join';
import _ from 'lodash';

import { HttpRequestConfig, HttpResponse, HttpError } from '../types';

export const getPublicConfig = (config: HttpRequestConfig) => {
  const method = config.method || 'get';

  const defaultHeaders = config.headers || {};
  // TODO check if those properties exist
  const commonHeaders = (config.headers as any)?.common || defaultHeaders;
  const methodHeaders = (config.headers as any)?.[method.toLowerCase()] || defaultHeaders;
  const headers = sanitizeHeaders({
    ...commonHeaders,
    ...methodHeaders,
  });

  const data = sanitizeObject(config.data, config.secrets?.data || []);
  const params = sanitizeObject(config.params, config.secrets?.params || []);

  return {
    requestId: config.requestId,
    url: urlJoin(config.baseURL || '', config.url || ''),
    method: method.toUpperCase(),
    headers,
    params,
    data,
    cancellable: config.cancellable || !!config.cancelToken,
    timeout: config.timeout,
    xsrfCookieName: config.xsrfCookieName,
    xsrfHeaderName: config.xsrfHeaderName,
    maxContentLength: config.maxContentLength,
    maxBodyLength: config.maxBodyLength,
    secrets: config.secrets,
  };
}

export const getPublicResponse = (response: HttpResponse) => {
  return {
    status: response.status,
    statusText: response.statusText,
    headers: sanitizeHeaders(response.headers || {}),
  };
}

export const getPublicError = (error: HttpError) => {
  const { config, ...errorJson } = error.toJSON() as any;

  return {
    ...errorJson,
    url: config.url,
    method: config.method,
    requestId: config.requestId,
  };
}

const sanitizeObject = (data: any, excludes: string[] = []): any => {
  return _.isObject(data)
    ? _.omit(data, excludes)
    : data;
}

const deleteHeader = (headers: Record<string, string>, headerName: string) => {
  delete headers[headerName];
  delete headers[headerName.toLowerCase()];
}

const sanitizeHeaders = (headers: Record<string, string>): Record<string, string> => {
  headers = { ...headers };

  // delete headers that may contain sensitive information
  deleteHeader(headers, 'Authorization');
  deleteHeader(headers, 'Access-Token');

  return headers;
}
