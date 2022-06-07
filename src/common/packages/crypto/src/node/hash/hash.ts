import crypto from 'node:crypto';

export function hash(plain: string | Buffer): Buffer;
export function hash(plain: string | Buffer, encoding: 'hex' | 'base64'): string;
export function hash(plain: string | Buffer, encoding?: 'hex' | 'base64'): string | Buffer;
export function hash(plain: string | Buffer, encoding?: 'hex' | 'base64'): string | Buffer {
  const hash = crypto.createHash('sha3-256').update(plain);

  return encoding
    ? hash.digest(encoding)
    : hash.digest();
}
