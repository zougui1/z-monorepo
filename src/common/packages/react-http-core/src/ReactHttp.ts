import { QueryClient } from 'react-query';
import * as yup from 'yup';

import { Fetch } from '@zougui/common.http-core';

import { ReactQuery } from './ReactQuery';
import { ReactMutation } from './ReactMutation';
import { queryClient } from './queryClient';

export class ReactHttp {
  readonly #queryClient: QueryClient = queryClient;

  protected getQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
    fetch: Fetch<TQueryFnData>,
  ): ReactQuery<TQueryFnData, TError, TData> => {
    return new ReactQuery(fetch, this.#queryClient);
  }

  protected getMutation = <
    TData = unknown,
    TError = unknown,
    TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
    TContext = unknown,
  >(
    getFetch: (body: yup.InferType<TBodySchema>) => Fetch<TData, any, any, TBodySchema>,
  ): ReactMutation<TData, TError, TBodySchema, TContext> => {
    return new ReactMutation(getFetch);
  }
}

export type { } from 'yup';
