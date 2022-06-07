import type { InferType } from 'yup';

import type { DurationString } from '@zougui/common.ms';

import type { nodeConfigSchema } from '../schemas';

export type NodeConfigType = InferType<typeof nodeConfigSchema>;
export type ConfigType = NodeConfigType & DurationTypes;
export type DurationTypes = {
  auth: {
    session: {
      duration: DurationString;
    };
  };
};
