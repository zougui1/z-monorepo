import urlJoin from 'url-join';
// FIXME: there is a type error from yum if these are not imported
import type { ObjectShape, TypeOfShape, AnyObject } from 'yup/lib/object';

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

  protected post<T>(pathname: string, body: any): Fetch<T> {
    return this.fetch<T>('post', this.http.post, pathname).setBody(body);
  }

  protected put<T>(pathname: string, body: any): Fetch<T> {
    return this.fetch<T>('put', this.http.put, pathname).setBody(body);
  }

  protected patch<T>(pathname: string, body: any): Fetch<T> {
    return this.fetch<T>('patch', this.http.patch, pathname).setBody(body);
  }

  getUsers = (params?: { page?: number }) => {
    return this
      .get('/users')
      .setQueryParams(params || {});
  }

  getSearchPage = <T>() => {
    return this.get<T>('/search');
  }
}
