import * as commonEnv from '../common';
import { getEnvVar } from '../common/getEnvVar';

export default {
  ...commonEnv,
  get: getEnvVar,
};
