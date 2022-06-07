import mongoose from 'mongoose';

import { processOptions } from './processOptions';
import type { ConnectOptions } from './types';

export const connect = async (options: ConnectOptions, mongoOptions: mongoose.ConnectOptions | undefined = {}): Promise<void> => {
  const { connectionUri, mongoOptions: actualMongoOptions } = processOptions(options, mongoOptions);

  console.log({connectionUri})
  await mongoose.connect(connectionUri, actualMongoOptions);
}
