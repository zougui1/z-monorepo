import { createHashV1 } from './createHashV1';
import type { Hasher } from '../types';

export const hashers: Record<number, Hasher> = {
  '1': createHashV1,
};
