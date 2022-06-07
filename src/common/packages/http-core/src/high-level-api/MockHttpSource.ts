import { rest } from 'msw';
import type { ResponseResolver, RestRequest, RestContext } from 'msw';
import * as yup from 'yup';

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
    TQueryParamsSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  >(
    fetch: Fetch<TResponse, any, TQueryParamsSchema, TBodySchema>,
    resolver: ResponseResolver<RestRequest<yup.InferType<TBodySchema>, AsPathParam<TQueryParamsSchema['__inputType']>>, RestContext, TResponse>
  ) {
    return rest[fetch.method](fetch.getRoute(), resolver);
  }
}
