import * as commonEnv from '../common';
import * as nodeEnv from './nodeBaseEnv';
import { get } from './get';

export default {
  ...commonEnv,
  ...nodeEnv,
  get,
}
