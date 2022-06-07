import { useQuery, QueryKey, QueryClient } from 'react-query';
import _ from 'lodash';

import { mediaHttp, Fetch, PopulatedMedia, HttpResponse } from '@zougui/image-downloader.http/v1';

import { queryClient } from '~/queryClient';

class ReactQuery<T = unknown> {
  private readonly fetch: Fetch<T>;
  private readonly queryClient: QueryClient;
  private readonly queryKey: Readonly<QueryKey>;

  constructor(fetch: Fetch<T>, queryClient: QueryClient) {
    this.fetch = fetch;
    this.queryClient = queryClient;
    this.queryKey = ReactQuery.getQueryKey(fetch);
  }

  static getQueryKey = (fetch: Fetch<unknown>): QueryKey => {
    const urlObject = fetch.getURLObject();
    const url = `${urlObject.origin}${urlObject.pathname}`;
    const searchKeys = urlObject.searchParams.keys();
    const searchValues = urlObject.searchParams.values();
    const queryObject = _.zipObject(Array.from(searchKeys), Array.from(searchValues));

    return [{ url, query: queryObject }];
  }

  private getQueryData = (): T | undefined => {
    return this.queryClient.getQueryData<T>(this.queryKey);
  }

  private queryFunction = (): Promise<T> => {
    return this.fetch.then();
  }

  private fetchQuery = (): Promise<T> => {
    return this.queryClient.fetchQuery({
      queryKey: this.queryKey,
      queryFn: this.queryFunction,
    });
  }

  query = async () => {
    return this.getQueryData() ?? await this.fetchQuery();
  }

  useQuery = () => {
    const query = useQuery<T>({
      queryKey: this.queryKey,
      queryFn: this.queryFunction,
    });

    return query;
  }
}

class ReactHttp {
  private readonly queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  protected getReactQuery = <T extends any>(fetch: Fetch<T>): ReactQuery<T> => {
    return new ReactQuery(fetch, this.queryClient);
  }
}

export class ReactMediaHttp extends ReactHttp {
  getMedias = (): ReactQuery<HttpResponse<PopulatedMedia[]>> => {
    return this.getReactQuery(mediaHttp.getMedias());
  }
}

export const reactMediaHttp = new ReactMediaHttp(queryClient);
