import type { InferType } from 'yup';

import type { browserConfigSchema } from '../schemas';

export type ConfigType = InferType<typeof browserConfigSchema>;
