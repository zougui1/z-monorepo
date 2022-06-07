import type { SearchObject } from '@zougui/image-downloader.database';

import { searchNewSubmissions, SearchNewSubmissionsResults } from './searchNewSubmissions';

export const searchSubmissionsFromToday = async (search: SearchObject): Promise<SearchNewSubmissionsResults> => {
  const [lastCursor] = search.cursors;
  const newSubmissions = await searchNewSubmissions(search, {
    page: lastCursor.currentPage,
    orderBy: 'date',
    range: '3days',
  });

  return newSubmissions;
}
