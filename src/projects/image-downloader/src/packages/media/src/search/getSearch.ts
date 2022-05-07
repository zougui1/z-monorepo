import { searchQueries, SearchDocument } from '@zougui/image-downloader.database';
import { createException } from '@zougui/common.error-utils';
import { createLog, createTaskLogs, logger } from '@zougui/log.logger/node';

import { furaffinityQuerySearch } from '../furaffinityQuerySearch';

//#region find search logging
const FindSearchError = createException<void, Error>({
  name: 'FindSearchError',
  code: 'error.image-downloader.media.findSearch',
  message: ({ cause }) => `An error occured while looking for a search: ${cause.message}`,
  version: 'v1',
});

const FindSearchErrorLog = createLog<void, InstanceType<typeof FindSearchError>>({
  code: 'image-downloader.media.findSearch.error',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
  message: ({ cause }) => cause.message,
});
//#endregion

//#region create search logging
const CreateSearchError = createException<void, unknown>({
  name: 'CreateSearchError',
  code: 'error.image-downloader.media.createSearch',
  message: ({ cause }) => `An error occured while creating a search: ${cause.message}`,
  version: 'v1',
});
//#endregion

//#region get search logging
const GetSearchTaskLog = createTaskLogs<{ args: [] }, { result: SearchDocument }, Error>({
  baseCode: 'image-downloader.media.getSearch',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
  messages: {
    start: 'Looking for a search...',
    success: ({ data }) => `Found search with query "${data.result.query}".`,
    error: ({ cause }) => `An error occured while trying to find a search: ${cause.message}`,
  },
});
//#endregion

export const getSearch = GetSearchTaskLog.wrap(async (): Promise<SearchDocument> => {
  const [searchMaybe] = await searchQueries
    .findMany({}, { query: 1, options: 1 })
    .catch(cause => {
      const error = new FindSearchError({ cause });
      logger.warn(new FindSearchErrorLog({ cause: error }));
      return [];
    });

  if (searchMaybe) {
    return searchMaybe;
  }

  try {
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
  } catch (cause) {
    throw new CreateSearchError({ cause });
  }
});
