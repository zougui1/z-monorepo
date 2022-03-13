import React, { useEffect } from 'react';
import { useQuery, QueryKey, QueryClient } from 'react-query';
//import { ReactQueryDevtools } from 'react-query/devtools';
import _ from 'lodash';

import { HttpSource, Fetch } from '@zougui/common.http-core';

import { queryClient } from '../../queryClient';
import { useDevToolsActions } from './devtools.context';

// @zougui/common.swapi-http
class Swapi extends HttpSource {
  constructor() {
    super('https://catfact.ninja');
    //super('https://swapi.dev/api');
  }

  getPerson() {
    return this.get<any>('fact');
    /*return this.fetch<any>(this.http.get, {
      template: 'people/:id',
      schema: {},
      params: { id: 1 },
      query: { projection: { id: true, name: true } },
    })*/
    //return this.fetch<any>(this.http.get, 'people/1');
  }
}

const swapi = new Swapi();

// @zougui/common.react-http-core
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

  protected getReactQuery = <T extends any>(fetch: Fetch<T>) => {
    return new ReactQuery(fetch, this.queryClient);
  }
}

// @zougui/common.react-swapi-http
class ReactSwapi extends ReactHttp {
  /*usePerson = () => {
    return useHttp<any, any>(swapi.getPerson());
  }*/

  getPerson = () => {
    return this.getReactQuery(swapi.getPerson());
  }
}

const reactSwapi = new ReactSwapi(queryClient);

export function TestDevTools() {
  const devToolsActions = useDevToolsActions();

  const { data } = reactSwapi.getPerson().useQuery();
  const { data: data2 } = reactSwapi.getPerson().useQuery();
  //console.log('data', data?.data)

  useEffect(() => {
    devToolsActions.registerTab({
      name: 'test',
      Component: () => <React.Fragment />,
    });
  }, [devToolsActions]);

  return null;
}
