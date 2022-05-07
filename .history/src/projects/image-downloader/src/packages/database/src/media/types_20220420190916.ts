import type { Media, MediaPost } from './MediaModel';

export interface MediaCreation extends Omit<Media, 'createdAt' | 'updatedAt' | 'variants'> {
  posts: Omit<MediaPost, 'createdAt' | 'updatedAt'>[];
}

export interface CreateFileData {
  hashes: string[];
  contentType: string;
  width?: number | undefined;
  height?: number | undefined;
  extension: string;
  type: string;
  size: number;
  fileName: string;
}