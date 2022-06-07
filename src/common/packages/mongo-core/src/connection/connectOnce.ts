import mongoose from 'mongoose';

import { connect } from './connect';
import type { ConnectOptions } from './types';

const preventConnectionStates = [mongoose.ConnectionStates.connected, mongoose.ConnectionStates.connecting];

export const connectOnce = async (options: ConnectOptions, mongoOptions?: mongoose.ConnectOptions | undefined): Promise<void> => {
  if (preventConnectionStates.includes(mongoose.connection.readyState)) {
    return;
  }

  await connect(options, mongoOptions);
}
