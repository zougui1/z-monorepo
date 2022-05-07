process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

import { browse } from './native/browse';

(async () => {
  await browse({page: 64});
})().catch(err => console.error(err));

export {
  submission as findSubmission,
  ISubmission,
} from 'furaffinity-api';

export * from './submission';
export * from './enums';
export * from './description/description.types';
