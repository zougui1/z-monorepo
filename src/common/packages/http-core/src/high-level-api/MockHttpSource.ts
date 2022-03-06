import { rest } from 'msw';
import type { ResponseResolver, RestRequest, RestContext } from 'msw';
import type { ObjectShape, TypeOfShape, AnyObject } from 'yup/lib/object';

import { Fetch } from './Fetch';
import { HttpSource } from './HttpSource';

export type AsPathParam<T extends Record<string, any>> = {
  [K in keyof T]: string | ReadonlyArray<string>;
}

export class MockHttpSource<T extends HttpSource> {
  protected readonly http: T;

  constructor(http: T) {
    this.http = http;
  }

  protected mock<
    TResponse,
    TQueryParamsShape extends ObjectShape = AnyObject,
    TBody = any,
    TQueryParamsIn extends TypeOfShape<TQueryParamsShape> = TypeOfShape<TQueryParamsShape>,
  >(
    fetch: Fetch<TResponse, any, any, TQueryParamsShape, Partial<TQueryParamsIn>, TBody>,
    resolver: ResponseResolver<RestRequest<TBody, AsPathParam<TQueryParamsIn>>, RestContext, TResponse>
  ) {
    return rest[fetch.method](fetch.getRoute(), resolver);
  }
}
