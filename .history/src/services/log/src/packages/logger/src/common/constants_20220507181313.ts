import env from '@zougui/common.env';
import type { DurationString } from '@zougui/common.ms';

export const defaultBatchInterval: DurationString = env.isDev ? '1 seconds' : '1 min';
