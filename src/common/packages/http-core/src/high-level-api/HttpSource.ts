import * as yup from 'yup';

import { Fetch } from './Fetch';
import { createHttp, CreateHttpOptions } from '../low-level-api';
import { HttpInstance, FetchFunction, HttpMethod } from '../types';


export class HttpSource {

  readonly baseURL: string;
  readonly http: HttpInstance;

  constructor(baseURL: string, options: CreateHttpOptions = {}) {
    this.http = createHttp({
      ...options,
      baseURL,
    });
    this.baseURL = baseURL;
  }

  static getURL<T extends ((...args: any[]) => Fetch<unknown>)>(fetch: T, ...args: Parameters<T>): string {
    return fetch(...args).getURL();
  }

  static getURLObject<T extends ((...args: any[]) => Fetch<unknown>)>(fetch: T, ...args: Parameters<T>): URL {
    return fetch(...args).getURLObject();
  }

  private fetch<T>(method: HttpMethod, fetch: FetchFunction, pathname: string): Fetch<T> {
    return new Fetch({
      method,
      fetch,
      url: pathname,
      baseURL: this.baseURL,
    });
  }

  protected get<T>(pathname: string): Fetch<T> {
    return this.fetch<T>('get', this.http.get, pathname);
  }

  protected delete<T>(pathname: string): Fetch<T> {
    return this.fetch<T>('delete', this.http.delete, pathname);
  }

  protected head<T>(pathname: string): Fetch<T> {
    return this.fetch<T>('head', this.http.head, pathname);
  }

  protected options<T>(pathname: string): Fetch<T> {
    return this.fetch('options', this.http.options, pathname);
  }

  protected post<
    TData,
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(pathname: string, { body, ...options }: BodyOptions<TBodySchema>): Fetch<TData, any, any, TBodySchema> {
    return this.fetch<TData>('post', this.http.post, pathname).body(body, options);
  }

  protected put<
    TData,
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(pathname: string, { body, ...options }: BodyOptions<TBodySchema>): Fetch<TData, any, any, TBodySchema> {
    return this.fetch<TData>('put', this.http.put, pathname).body(body, options);
  }

  protected patch<
    TData,
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(pathname: string, { body, ...options }: BodyOptions<TBodySchema>): Fetch<TData, any, any, TBodySchema> {
    return this.fetch<TData>('patch', this.http.patch, pathname).body(body, options);
  }
}

export interface BodyOptions<TSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema> {
  body: yup.InferType<TSchema>;
  schema?: TSchema | undefined;
}
