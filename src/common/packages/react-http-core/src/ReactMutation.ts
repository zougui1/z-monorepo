import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import * as yup from 'yup';

import { Fetch } from '@zougui/common.http-core';

export class ReactMutation<
  TData = unknown,
  TError = unknown,
  TBodySchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  TContext = unknown,
> {
  readonly #getFetch: (body: yup.InferType<TBodySchema>) => Fetch<TData>;

  constructor(fetch: (body: yup.InferType<TBodySchema>) => Fetch<TData>) {
    this.#getFetch = fetch;
  }

  private queryFunction = (body: yup.InferType<TBodySchema>): Promise<TData> => {
    return this.#getFetch(body).then();
  }

  useMutation = (
    options?: Omit<UseMutationOptions<TData, TError, yup.InferType<TBodySchema>, TContext>, "mutationFn"> | undefined,
  ): UseMutationResult<TData, TError, yup.InferType<TBodySchema>, TContext> => {
    return useMutation(this.queryFunction, options);
  }
}
