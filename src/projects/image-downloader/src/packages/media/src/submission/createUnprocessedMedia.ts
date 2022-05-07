import { URL } from 'node:url';

import { unprocessedMediaQueries, UnprocessedMediaDocument } from '@zougui/image-downloader.database';
import { toArray } from '@zougui/common.array';
import type { Submission } from '@zougui/image-downloader.furaffinity';

export const createUnprocessedMedia = async (submission: Submission | Submission[]): Promise<UnprocessedMediaDocument[]> => {
  const formattedSubmissions = toArray(submission).map(submission => {
    const originUrlObject = new URL(submission.author.url);

    return {
      ...submission,
      species: submission.species,
      categories: submission.categories,
      genders: submission.genders,
      originalFileName: submission.fileName,
      author: {
        id: submission.author.id,
        name: submission.author.name,
        origin: {
          name: originUrlObject.hostname,
          url: originUrlObject.origin,
          profileUrl: submission.author.url,
          avatar: submission.author.avatar,
        },
      },
      status: 'idle' as const,
    };
  });

  const unprocessedMediaDoc = await unprocessedMediaQueries.createMany(formattedSubmissions);

  return unprocessedMediaDoc
}
