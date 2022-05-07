import 'reflect-metadata';
import { connect } from './connection';
import { Prop } from './decorators';
import { getModel } from './getModel';
import { prop } from '@typegoose/typegoose';

const dbName = 'media';
const host = '127.0.0.1';

const doConnect = async () => {
  return await connect({ dbName, host });
}

class Message {
  @Prop()
  message!: string;
}

const MessageModel = getModel(Message);

(async () => {
  await doConnect();
  const message = new MessageModel({
    //message: 'some message',
  });

  await message.save();
})();

export default {
  connect,
};

export * from './connection';
export * from './DocumentType';