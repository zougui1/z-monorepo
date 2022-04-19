import type { Media, MediaVariant } from './MediaModel';

export interface MediaCreation extends Omit<Media, 'createdAt' | 'updatedAt' | 'variants'> {
  variants: Omit<MediaVariant, 'createdAt' | 'updatedAt'>[];
}

export interface CreateFileData {
  hash: string;
  mimeType: string;
  fileName: string;
}
