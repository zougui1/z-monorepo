import { search as faSearch, IPagingResults } from 'furaffinity-api';

import type { WeakEnum } from '@zougui/common.type-utils';

import { login } from '../login';
import type { OrderBy, OrderDirection, RangeType } from '../enums';

export const searchSubmissions = async (query: string, options?: DownloadPageOptions | undefined): Promise<IPagingResults> => {
  login();
  const submissions = await faSearch(query, options);

  return submissions;
}

export interface DownloadPageOptions {
  orderBy?: WeakEnum<OrderBy> | undefined;
  orderDirection?: WeakEnum<OrderDirection> | undefined;
  page?: number | undefined;
  range?: WeakEnum<RangeType> | undefined;
  rangeFrom?: Date | undefined;
  rangeTo?: Date | undefined;
}
