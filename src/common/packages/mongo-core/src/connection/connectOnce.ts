import mongoose from 'mongoose';

import { connect } from './connect';
import type { ConnectOptions } from './types';

const preventConnectionStates = [mongoose.ConnectionStates.connected, mongoose.ConnectionStates.connecting];

export const connectOnce = async (options: ConnectOptions, mongoOptions?: mongoose.ConnectOptions | undefined): Promise<typeof mongoose> => {
  if (preventConnectionStates.includes(mongoose.connection.readyState)) {
    return mongoose;
  }

  return await connect(options, mongoOptions);
}
