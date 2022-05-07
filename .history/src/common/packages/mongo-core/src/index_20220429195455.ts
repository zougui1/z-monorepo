import 'reflect-metadata';
import { connect } from './connection';
import { AutoConnect } from './decorators';
import { getModel } from './getModel';
import { prop } from '@typegoose/typegoose';

const dbName = 'media';

const doConnect = async () => {
  return connect({ dbName });
}

@AutoConnect(doConnect)
class Message {
  @prop()
  message!: string;
}

const MessageModel = getModel(Message);

(async () => {
  const message = new MessageModel({
    message: 'some message',
  });

  await message.save();
})();

export default {
  connect,
};

export * from './connection';
export * from './DocumentType';
