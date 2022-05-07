process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

import { findSubmission } from './native';

(async () => {
  await findSubmission('ererterhgt').catch(() => {});
})().catch(err => console.error(err));

export {
  submission as findSubmission,
  ISubmission,
} from 'furaffinity-api';

export * from './submission';
export * from './native';
export * from './enums';
export * from './description/description.types';
