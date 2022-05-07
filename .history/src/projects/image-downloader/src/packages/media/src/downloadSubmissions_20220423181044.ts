import {
  unprocessedMediaQueries,
  mediaQueries,
  searchQueries,
  SearchDocument,
} from '@zougui/image-downloader.database';
import {
  searchSubmissions,
  downloadSubmissions as faDownloadSubmissions,
  SearchResult,
  findSubmission,
} from '@zougui/image-downloader.furaffinity';

import { furaffinityQuerySearch } from './furaffinityQuerySearch';

export const downloadSubmissions = async (search: SearchDocument): Promise<SearchResult> => {
  console.log('downloading submissions...');
  console.time('submissions downloaded');
  await searchQueries.startDownloading({ id: search._id });
  const submissions = await searchSubmissions(furaffinityQuerySearch, {
    page: search.options.page || 1,
    orderBy: 'date',
  });

  const existingSubmissions = await Promise.all(submissions.map(async submission => {
    const unprocessedMediaDoc = await unprocessedMediaQueries.findByUrl(submission.url);

    if (unprocessedMediaDoc) {
      return [unprocessedMediaDoc.url];
    }

    const mediaDoc = await mediaQueries.findByUrl(submission.url);

    if (mediaDoc) {
      return mediaDoc.posts.map(post => post.urls).flat();
    }

    return [];
  }));
  const existingSubmissionsFlat = existingSubmissions.flat();

  const newSubmissions = submissions.filter(submission => {
    return !existingSubmissionsFlat.includes(submission.url);
  });

  const downloadResult = await faDownloadSubmissions([await findSubmission('27390235')] || newSubmissions);

  await searchQueries.downloadedPage(
    { id: search._id },
    { failedToDownload: downloadResult.errored.map(err => err.url) },
  );
  console.timeEnd('submissions downloaded');

  return downloadResult;
}
