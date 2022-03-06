import Emittery from 'emittery';
import urlJoin from 'url-join';
import QS from 'qs';
import { Cancel } from 'axios';
import * as yup from 'yup';
import type { ObjectShape, TypeOfShape, AnyObject } from 'yup/lib/object';

import { union, SchemaObject } from '@zougui/common.yup-utils';

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
  TPathParamsShape extends ObjectShape = AnyObject,
  TPathParamsIn extends Partial<TypeOfShape<TPathParamsShape>> = Partial<TypeOfShape<TPathParamsShape>>,
  TQueryParamsShape extends ObjectShape = AnyObject,
  TQueryParamsIn extends Partial<TypeOfShape<TQueryParamsShape>> = Partial<TypeOfShape<TQueryParamsShape>>,
  TBody = any,
> implements Promise<HttpResponse<TData>> {
  [Symbol.toStringTag]: '[object Fetch]';
  #promise: CancellablePromise<HttpResponse<TData>> | undefined;
  #fetch: FetchFunction;
  #body: TBody | undefined;
  #config: HttpRequestConfigOptions = {};
  #queryParams: SchemaObject<TQueryParamsShape>;
  #emitter: Emittery = new Emittery();
  #baseURL: string;
  #url: string;
  #route: RouteTemplate<TPathParamsShape, TPathParamsIn>;
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
  setQueryParam<TKey extends keyof TypeOfShape<TQueryParamsShape> & string>(name: TKey, value: TypeOfShape<TQueryParamsShape>[TKey]): this {
    this.#queryParams.setValue(name, value);
    return this;
  }

  setQueryParams(params: TQueryParamsIn): this {
    this.#queryParams.setValues(params);
    return this;
  }

  setPathParam<TKey extends keyof TypeOfShape<TPathParamsShape> & string>(name: TKey, value: TypeOfShape<TPathParamsShape>[TKey]): this {
    this.#route.setParam(name, value);
    return this;
  }

  setPathParams(params: TPathParamsIn): this {
    this.#route.setParams(params);
    return this;
  }

  setBody(body: TBody): this {
    this.#body = body;
    return this;
  }

  getBody(): TBody | undefined {
    return this.#body;
  }

  getPathParams(): TPathParamsIn {
    return this.#route.getParams();
  }
  //#endregion

  //#region schema
  setPathSchema<
    TPathParamsShape extends ObjectShape = AnyObject,
    TPathParamsIn extends Partial<TypeOfShape<TPathParamsShape>> = Partial<TypeOfShape<TPathParamsShape>>,
  >(schema: yup.ObjectSchema<TPathParamsShape>): Fetch<TData, TPathParamsShape, TPathParamsIn, TQueryParamsShape, TQueryParamsIn> {
    this.#route = new RouteTemplate(this.#url, schema as any);
    return this as any;
  }

  setQuerySchema<
    TQueryParamsShape extends ObjectShape = AnyObject,
    TQueryParamsIn extends Partial<TypeOfShape<TQueryParamsShape>> = Partial<TypeOfShape<TQueryParamsShape>>,
  >(schema: yup.ObjectSchema<TQueryParamsShape>): Fetch<TData, TPathParamsShape, TPathParamsIn, TQueryParamsShape, TQueryParamsIn> {
    this.#queryParams = new SchemaObject({} as any, schema as any);
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
  //#endregion

  cleanup = (): void => {
    this.#emitter.clearListeners();
  }

  exec = () => {
    // if there is no data then this means it's a fetch that does not take a body
    // in which case the second parameter is the config
    // if there is any data then this means it's a fetch that takes a body
    // in which case the second parameter is the body and the thirs is the config
    const bodyOrConfig = this.#body ?? this.#config;
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
