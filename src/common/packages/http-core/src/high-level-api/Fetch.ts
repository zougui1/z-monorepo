import Emittery from 'emittery';
import urlJoin from 'url-join';
import QS from 'qs';
import { Cancel } from 'axios';
import * as yup from 'yup';

import { SchemaObject } from '@zougui/common.yup-utils';

import { RouteTemplate } from './RouteTemplate';
import { isHttpError, isCancel } from '../low-level-api';
import {
  FetchFunction,
  HttpMethod,
  HttpRequestConfigOptions,
  HttpResponse,
  CancellablePromise,
  HttpError,
} from '../types';

export class Fetch<
  TData,
  TPathParamsSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  TQueryParamsSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
> implements Promise<HttpResponse<TData>> {
  [Symbol.toStringTag]: '[object Fetch]';
  #promise: CancellablePromise<HttpResponse<TData>> | undefined;
  #fetch: FetchFunction;
  #body: SchemaObject<TBodySchema> | undefined;
  #config: HttpRequestConfigOptions = {};
  #queryParams: SchemaObject<TQueryParamsSchema>;
  #emitter: Emittery = new Emittery();
  #baseURL: string;
  #url: string;
  #route: RouteTemplate<TPathParamsSchema, yup.InferType<TPathParamsSchema>>;
  readonly method: HttpMethod;

  constructor({ method, fetch, url, baseURL }: FetchOptions) {
    this.method = method;
    this.#fetch = fetch;
    this.#url = url;
    this.#baseURL = baseURL;
    this.#route = new RouteTemplate(url);
    this.#queryParams = new SchemaObject({} as any);

    // to prevent error emitions from throwing an error
    // when no listeners are bound to the event 'error'
    this.#emitter.on('error', () => { });
  }

  //#region url methods
  getURL(): string {
    const paramsString = QS.stringify(this.#queryParams.getValidValuesSync());
    // avoid empty query string
    const queryString = paramsString ? `?${paramsString}` : '';
    const path = this.#route.getPath();

    return urlJoin(this.#baseURL, path, queryString);
  }

  getURLObject(): URL {
    return new URL(this.getURL());
  }

  getRoute(): string {
    return urlJoin(this.#baseURL, this.#url);
  }
  //#endregion

  //#region request state handlers
  onExec = (onExec: ((fetcher: this) => void)): this => {
    this.#emitter.on('exec', onExec);
    return this;
  }

  onSuccess = (onSuccess: (data: HttpResponse<TData>) => void): this => {
    this.#emitter.on('success', onSuccess);
    return this;
  }

  onError = (onError: (error: unknown) => void): this => {
    this.#emitter.on('error', onError);
    return this;
  }

  onHttpError = (onError: (error: HttpError<TData>) => void): this => {
    this.#emitter.on('error', error => {
      if (isHttpError(error)) {
        onError(error);
      }
    });

    return this;
  }

  onCancel = (onCancel: (cancel: Cancel) => void): this => {
    this.#emitter.on('error', error => {
      if (isCancel(error)) {
        onCancel(error);
      }
    });

    return this;
  }
  //#endregion

  //#region params
  setQueryParam<TKey extends keyof TQueryParamsSchema & string>(name: TKey, value: TQueryParamsSchema[TKey]): this {
    this.#queryParams.setValue(name, value);
    return this;
  }

  setQueryParams(params: TQueryParamsSchema['__inputType']): this {
    this.#queryParams.setValues(params);
    return this;
  }

  setPathParam<TKey extends keyof TPathParamsSchema & string>(name: TKey, value: TPathParamsSchema[TKey]): this {
    this.#route.setParam(name, value);
    return this;
  }

  setPathParams(params: TPathParamsSchema['__inputType']): this {
    this.#route.setParams(params);
    return this;
  }

  body<
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(body: yup.InferType<TBodySchema>, options?: FetchBodyOptions<TBodySchema>): Fetch<TData, TPathParamsSchema, TQueryParamsSchema, TBodySchema> {
    this.#body = new SchemaObject(body, options?.schema);
    return this;
  }

  getPathParams(): TPathParamsSchema['__inputType'] {
    return this.#route.getParams();
  }
  //#endregion

  //#region schema
  setPathSchema<
    TPathParamsSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(schema: TPathParamsSchema): Fetch<TData, TPathParamsSchema, TQueryParamsSchema, TBodySchema> {
    this.#route = new RouteTemplate(this.#url, schema as any);
    return this as any;
  }

  setQuerySchema<
    TQueryParamsSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(schema: TQueryParamsSchema): Fetch<TData, TPathParamsSchema, TQueryParamsSchema, TBodySchema> {
    this.#queryParams = new SchemaObject({} as any, schema as any);
    return this as any;
  }

  setBodySchema<
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(schema: TBodySchema): Fetch<TData, TPathParamsSchema, TQueryParamsSchema, TBodySchema> {
    this.#body = new SchemaObject({} as any, schema as any);
    return this as any;
  }
  //#endregion

  //#region config builder
  setConfig(config: HttpRequestConfigOptions): this {
    this.#config = config;
    return this;
  }

  setTimeout(timeout: HttpRequestConfigOptions['timeout']): this {
    this.#config.timeout = timeout;
    return this;
  }

  onDownloadProgress(onDownloadProgress: HttpRequestConfigOptions['onDownloadProgress']): this {
    this.#config.onDownloadProgress = onDownloadProgress;
    return this;
  }

  withCredentials(withCredentials: boolean = true): this {
    this.#config.withCredentials = withCredentials;
    return this;
  }
  //#endregion

  cleanup = (): void => {
    this.#emitter.clearListeners();
  }

  exec = () => {
    // if there is no data then this means it's a fetch that does not take a body
    // in which case the second parameter is the config
    // if there is any data then this means it's a fetch that takes a body
    // in which case the second parameter is the body and the thirs is the config
    const bodyOrConfig = this.#body?.getValidValuesSync() ?? this.#config;
    this.#promise = this.#fetch(this.getURL(), bodyOrConfig, this.#config);

    this.#emitter.emit('exec', this);

    return this.#promise
      .then(this.#onResolve)
      .catch(this.#onReject)
      .finally(this.#onFulfilled);
  }

  //#region internal promise handlers
  #onResolve = (response: HttpResponse<TData>): HttpResponse<TData> => {
    this.#emitter.emit('success', response);

    return response;
  }

  #onReject = (error: unknown): never => {
    this.#emitter.emit('error', error);

    // re-throw the error to let the user of the class to handle the error themselves
    throw error;
  }

  #onFulfilled = () => {
    this.cleanup();
    this.#emitter.emit('fulfilled');
  }
  //#endregion

  //#region promise handlers
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onResolved The callback to execute when the Promise is resolved.
   * @param onRejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then = <TResult = HttpResponse<TData>, TResult2 = never>(
    onResolved?: ((value: HttpResponse<TData>) => TResult | PromiseLike<TResult>) | undefined | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult | TResult2> => {
    return this.exec().then(onResolved, onRejected);
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onRejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onRejected: ((reason: any) => TResult | PromiseLike<TResult>)): Promise<HttpResponse<TData> | TResult> {
    return this.exec().catch(onRejected);
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onFinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onFinally?: (() => void) | undefined | null): Promise<HttpResponse<TData>> {
    return this.exec().finally(onFinally);
  }

  cancel(reason?: string | undefined) {
    if (!this.#promise) {
      console.log('no promise')
      this.exec();
    }

    this.#promise?.cancel(reason);
    return this.#promise;
  }
  //#endregion
}

export interface FetchOptions {
  method: HttpMethod,
  fetch: FetchFunction,
  url: string;
  baseURL: string;
}

export interface FetchBodyOptions<TSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema> {
  schema?: TSchema | undefined;
}
