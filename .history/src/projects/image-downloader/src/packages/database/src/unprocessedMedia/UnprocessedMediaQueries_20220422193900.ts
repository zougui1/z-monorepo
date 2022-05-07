import type { Types } from 'mongoose';

import {
  UnprocessedMediaModel,
  UnprocessedMediaDocument,
  UnprocessedMediaStatus,
} from './UnprocessedMediaModel';
import { createMediaRefs, UnprocessedMediaCreationOutput } from './createMediaRefs';
import type { UnprocessedMediaCreation } from './types';

class UnprocessedMediaQueries {
  create = async (media: UnprocessedMediaCreation): Promise<UnprocessedMediaDocument> => {
    const mediaWithRefs = await createMediaRefs(media);

    return await UnprocessedMediaModel.create(mediaWithRefs);
  }

  createMany = async (medias: UnprocessedMediaCreation[]): Promise<UnprocessedMediaDocument[]> =>  {
    const mediasWithRefs: UnprocessedMediaCreationOutput[] = [];

    for (const media of medias) {
      mediasWithRefs.push(await createMediaRefs(media));
    }

    return await UnprocessedMediaModel.create(mediasWithRefs);
  }

  deleteById = async (id: Types.ObjectId): Promise<void> => {
    await UnprocessedMediaModel.findByIdAndDelete(id);
  }

  findByUrl = async (url: string): Promise<UnprocessedMediaDocument | null> => {
    return await UnprocessedMediaModel.findOne({ url });
  }

  processingError = async (id: Types.ObjectId): Promise<void> => {
    await UnprocessedMediaModel.updateOne(
      { _id: id },
      { status: UnprocessedMediaStatus.error },
    );
  }
}

export const unprocessedMediaQueries = new UnprocessedMediaQueries();