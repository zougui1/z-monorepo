import axios, { Canceler } from 'axios';

import {
  HttpInstance,
  CancellablePromise,
  HttpRequestConfigOptions,
  HttpResponse,
} from '../../types';

export const overrideCancellableMethods = (http: HttpInstance): HttpInstance => {
  const httpGet = http.get;
  const httpDelete = http.delete;
  const httpHead = http.head;
  const httpOptions = http.options;
  const httpPost = http.post;
  const httpPut = http.put;
  const httpPatch = http.patch;

  const cancellableGet = (url: string, config?: HttpRequestConfigOptions) => toCancellable(httpGet, url, undefined, config);
  const cancellableDelete = (url: string, config?: HttpRequestConfigOptions) => toCancellable(httpDelete, url, undefined, config);
  const cancellableHead = (url: string, config?: HttpRequestConfigOptions) => toCancellable(httpHead, url, undefined, config);
  const cancellableOptions = (url: string, config?: HttpRequestConfigOptions) => toCancellable(httpOptions, url, undefined, config);
  const cancellablePost = (url: string, data: any, config?: HttpRequestConfigOptions) => toCancellable(httpPost, url, data, config);
  const cancellablePut = (url: string, data: any, config?: HttpRequestConfigOptions) => toCancellable(httpPut, url, data, config);
  const cancellablePatch = (url: string, data: any, config?: HttpRequestConfigOptions) => toCancellable(httpPatch, url, data, config);

  (http.get as ((url: string, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellableGet;
  (http.delete as ((url: string, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellableDelete;
  (http.head as ((url: string, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellableHead;
  (http.options as ((url: string, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellableOptions;
  (http.post as ((url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellablePost;
  (http.put as ((url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellablePut;
  (http.patch as ((url: string, data: any, config?: HttpRequestConfigOptions) => CancellablePromise<HttpResponse>)) = cancellablePatch;

  return http;
}

const toCancellable = (doRequest: Requester, url: string, data: any, config?: HttpRequestConfigOptions): CancellablePromise<HttpResponse> => {
  const cancellable = config?.cancellable ?? true;
  const source = cancellable ? axios.CancelToken.source() : undefined;

  const cancellableConfig: HttpRequestConfigOptions = {
    cancelToken: source?.token,
    ...(config || {}),
  };

  const request = doRequest(url, data ?? cancellableConfig, cancellableConfig);
  request.cancel = (reason?: string): Canceler | undefined | void => {
    return source?.cancel(reason);
  }

  return request;
}

type Requester = HttpInstance['get']
  | HttpInstance['delete']
  | HttpInstance['head']
  | HttpInstance['options']
  | HttpInstance['post']
  | HttpInstance['put']
  | HttpInstance['patch']
