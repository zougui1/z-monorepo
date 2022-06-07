import { useQuery, QueryKey, QueryClient, UseQueryOptions, UseQueryResult } from 'react-query';

import { Fetch } from '@zougui/common.http-core';

import { getQueryKey } from './utils';

export class ReactQuery<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData> {
  readonly #fetch: Fetch<TQueryFnData>;
  readonly #queryClient: QueryClient;
  readonly #queryKey: Readonly<QueryKey>;

  constructor(fetch: Fetch<TQueryFnData>, queryClient: QueryClient) {
    this.#fetch = fetch;
    this.#queryClient = queryClient;
    this.#queryKey = getQueryKey(fetch);
  }

  private getQueryData = (): TQueryFnData | undefined => {
    return this.#queryClient.getQueryData<TQueryFnData>(this.#queryKey);
  }

  private queryFunction = (): Promise<TQueryFnData> => {
    return this.#fetch.then();
  }

  private fetchQuery = (): Promise<TQueryFnData> => {
    return this.#queryClient.fetchQuery({
      queryKey: this.#queryKey,
      queryFn: this.queryFunction,
    });
  }

  query = async () => {
    return this.getQueryData() ?? await this.fetchQuery();
  }

  useQuery = (
    options?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'> | undefined,
  ): UseQueryResult<TData, TError> => {
    const query = useQuery({
      ...options,
      queryKey: this.#queryKey,
      queryFn: this.queryFunction,
    });

    return query;
  }
}
