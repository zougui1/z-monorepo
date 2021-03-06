import type { Media, MediaPost, OptimizedMedia } from './MediaModel';

export interface MediaCreation extends Omit<Media, 'createdAt' | 'updatedAt' | 'posts'> {
  posts: Omit<MediaPost, 'createdAt' | 'updatedAt'>[];
}

export interface CreateFileData {
  hashes: string[];
  contentType: string;
  width: number;
  height: number;
  extension: string;
  type: string;
  size: number;
  fileName: string;
  optimizedMedias: OptimizedMedia[];
}
