import 'reflect-metadata';
import { connect } from './connection';
import { Prop } from './decorators';
import { getModel } from './getModel';
import { prop } from '@typegoose/typegoose';

const dbName = 'media';

const doConnect = async () => {
  return connect({ dbName });
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
