import mongoose from 'mongoose';

import { processOptions } from './processOptions';
import type { ConnectOptions } from './types';

export const createConnection = (options: ConnectOptions, mongoOptions: mongoose.ConnectOptions | undefined = {}): mongoose.Connection => {
  const { connectionUri, mongoOptions: actualMongoOptions } = processOptions(options, mongoOptions);

  return mongoose.createConnection(connectionUri, actualMongoOptions);
}
