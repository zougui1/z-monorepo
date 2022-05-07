import { searchQueries, SearchDocument } from '@zougui/image-downloader.database';

import { furaffinityQuerySearch } from '../furaffinityQuerySearch';

export const getSearch = async (): Promise<SearchDocument> => {
  const [searchMaybe] = await searchQueries.findMany({}, { options: 1 });

  if (searchMaybe) {
    return searchMaybe;
  }

  const newSearch = await searchQueries.create({
    options: {
      page: 1,
      orderBy: 'relevancy',
      range: 'all',
    },
    origin: {
      name: 'furaffinity',
      url: 'https://www.furaffinity.net/search',
    },
    query: furaffinityQuerySearch,
  });

  return newSearch;
}
