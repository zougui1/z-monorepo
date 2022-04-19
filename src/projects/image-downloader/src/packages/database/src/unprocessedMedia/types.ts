import type { UnprocessedMedia } from './UnprocessedMediaModel';
import type { User, UserOrigin } from '../user';

export interface UnprocessedMediaCreation extends Omit<UnprocessedMedia, 'createdAt' | 'updatedAt' | 'author'> {
  author: Omit<User, 'origins'> & { origin: UserOrigin };
}
