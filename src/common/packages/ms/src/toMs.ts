import ms from 'ms';

import type { DurationString } from './types';

export const toMs = (time: number | DurationString): number => {
  return Number.isFinite(time) ? (time as number) : ms(time as DurationString);
}
