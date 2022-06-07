import { DateTime } from 'luxon';

import type { SearchObject } from '@zougui/image-downloader.database';

import { searchNewSubmissions, SearchNewSubmissionsResults } from './searchNewSubmissions';

const dayThreshold = 1;

export const searchSubmissionsFromDateRange = async (search: SearchObject): Promise<SearchNewSubmissionsResults> => {
  const [lastCursor] = search.cursors;
  const date = DateTime.fromJSDate(lastCursor.date);
  const rangeFrom = date.minus({ days: dayThreshold }).toJSDate();
  const rangeTo = date.plus({ days: dayThreshold }).toJSDate();

  const newSubmissions = await searchNewSubmissions(search, {
    page: lastCursor.currentPage,
    orderBy: 'date',
    range: 'manual',
    rangeFrom,
    rangeTo,
  });

  return newSubmissions;
}
