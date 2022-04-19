import type { UnprocessedMedia } from './UnprocessedMediaModel';
import type { UnprocessedMediaCreation } from './types';
import { userQueries } from '../user';
import { createRef } from '../createRef';

/**
 * create all references of the media
 * @param media
 * @returns
 */
export const createMediaRefs = async (media: UnprocessedMediaCreation): Promise<UnprocessedMediaCreationOutput> => {
  return await createMediaAuthorRef(media);
}

/**
 * create references to the collection 'users' for the authors
 * @param media
 * @returns
 */
const createMediaAuthorRef = async (media: UnprocessedMediaCreation): Promise<UnprocessedMediaCreationOutput> => {
  const authorData = {
    id: media.author.id,
    name: media.author.name,
    origins: [media.author.origin],
  };

  const author = await createRef(
    authorData,
    userQueries.findOrUpsert,
  );

  return {
    ...media,
    author,
  };
}

export interface UnprocessedMediaCreationOutput extends Omit<UnprocessedMedia, 'createdAt' | 'updatedAt'> {

}
