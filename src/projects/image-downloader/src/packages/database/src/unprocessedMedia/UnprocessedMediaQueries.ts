import type { Types } from 'mongoose';

import { UnprocessedMediaModel, UnprocessedMediaDocument } from './UnprocessedMediaModel';
import { createMediaRefs } from './createMediaRefs';
import type { UnprocessedMediaCreation } from './types';

class UnprocessedMediaQueries {
  create = async (media: UnprocessedMediaCreation): Promise<UnprocessedMediaDocument> => {
    const mediaWithRefs = await createMediaRefs(media);

    return await UnprocessedMediaModel.create(mediaWithRefs);
  }

  deleteById = async (id: Types.ObjectId): Promise<void> => {
    await UnprocessedMediaModel.findByIdAndDelete(id);
  }
}

export const unprocessedMediaQueries = new UnprocessedMediaQueries();
