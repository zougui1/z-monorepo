import imgHash from 'imghash';

const hashBitSize = 16;

export const hashImage = async (filePath: string): Promise<string> => {
  return await imgHash.hash(filePath, hashBitSize);
}
