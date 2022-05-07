import { searchQueries, SearchDocument } from '@zougui/image-downloader.database';

import { downloadPage } from './downloadPage';
import { furaffinityQuerySearch } from './furaffinityQuerySearch';

export const downloadFuraffinity = async (): Promise<void> => {
  let hasMoreCommissions = true;

  while (hasMoreCommissions) {
    const search = await getSearch();
    console.group('downloading page', search.options?.page);
    const medias = await downloadPage(search);
    console.groupEnd();

    hasMoreCommissions = medias.length > 0;
  }

  console.log('No more commission to download.');
}

const getSearch = async (): Promise<SearchDocument> => {
  const [searchMaybe] = await searchQueries.findMany({}, { options: 1 });

  const search = searchMaybe || await searchQueries.create({
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

  return search;
}
