import { QueryKey } from 'react-query';
import _ from 'lodash';

import { Fetch } from '@zougui/common.http-core';

export const getQueryKey = (fetch: Fetch<unknown>): QueryKey => {
  const urlObject = fetch.getURLObject();
  const url = `${urlObject.origin}${urlObject.pathname}`;
  const searchKeys = urlObject.searchParams.keys();
  const searchValues = urlObject.searchParams.values();
  const queryObject = _.zipObject(Array.from(searchKeys), Array.from(searchValues));

  return [{ url, query: queryObject }];
}
