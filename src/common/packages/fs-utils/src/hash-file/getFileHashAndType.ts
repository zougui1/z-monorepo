import { hashFile } from './hashFile';
import { getFileType } from '../common-file';

export const getFileHashAndType = async (filePath: string, options?: GetFileHashAndTypeOptions | undefined): Promise<GetFileHashAndTypeResult> => {
  const contentType = await getFileType(filePath, options);

  if (!contentType) {
    throw new Error('No file content-type found');
  }

  const hashes = await hashFile(filePath);

  return {
    hashes,
    contentType,
  };
}

export interface GetFileHashAndTypeOptions {
  failsafePath?: string | undefined;
}

export interface GetFileHashAndTypeResult {
  hashes: string[];
  contentType: string;
}
