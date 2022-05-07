import { unprocessedMediaQueries, UnprocessedMediaDocument } from '@zougui/image-downloader.database';

import { getMediaFileMetadata, FileMetadata } from './getMediaFileMetadata';
import { createOrAddMedia } from '../submission/createOrAddMedia';
import { getErrorObject } from '@zougui/common.error-utils';

export const saveMedia = async (unprocessedMediaDoc: UnprocessedMediaDocument) => {
  await unprocessedMediaQueries.startDownloading(unprocessedMediaDoc._id);
  let metadata: FileMetadata;

  try {
    metadata = await getMediaFileMetadata(unprocessedMediaDoc);
  } catch (error) {
    const errorObj = getErrorObject(error);
    console.log('image error', errorObj.message);
    await unprocessedMediaQueries.processingError(unprocessedMediaDoc._id, errorObj);
    return;
  }

  await createOrAddMedia(unprocessedMediaDoc, metadata as any);
  await unprocessedMediaQueries.deleteById(unprocessedMediaDoc._id);
}
