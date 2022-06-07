import { createHash } from './createHash';

export const deriveKey = async (plain: string, options: { saltLength: number }): Promise<DerivedKey> => {
  const hashResult = await createHash(plain, options);
  return hashResult;
}

export const hashPassword = async (plain: string): Promise<string> => {
  const { hash } = await createHash(plain);
  return hash;
}


export interface DerivedKey {
  salt: Buffer;
  hash: string;
}
