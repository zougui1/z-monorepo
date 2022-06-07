import { unprocessedMediaQueries, UnprocessedMediaDocument } from '@zougui/image-downloader.database';
import { Exception } from '@zougui/common.error-utils';

import { getMediaFileMetadata, FileMetadata } from './getMediaFileMetadata';
import { createOrAddMedia } from '../submission';

export const saveMedia = async (unprocessedMediaDoc: UnprocessedMediaDocument): Promise<void> => {
  await unprocessedMediaQueries.startDownloading(unprocessedMediaDoc._id);
  let metadata: FileMetadata;

  try {
    metadata = await getMediaFileMetadata(unprocessedMediaDoc);
  } catch (error) {
    const errorObj = Exception.getErrorObject(error);
    await unprocessedMediaQueries.processingError(unprocessedMediaDoc._id, errorObj);
    return;
  }

  await createOrAddMedia(unprocessedMediaDoc, metadata as any);
  await unprocessedMediaQueries.deleteById(unprocessedMediaDoc._id);
}
