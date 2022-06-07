import { verifyHashV1 } from './verifyHashV1';
import type { Verifier } from '../types';

export const verifiers: Record<number, Verifier> = {
  '1': verifyHashV1,
};
