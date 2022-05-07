import './initReflect';
import 'reflect-metadata';
import { connect } from '../connection';
import { SuperProp } from './decorators';
import { getModel } from './getModel';
import { reflect } from 'tst-reflect';

const dbName = 'media';
const host = '127.0.0.1';

const doConnect = async () => {
  return await connect({ dbName, host });
}

@reflect()
class Some {
  @SuperProp()
  number!: number;
}

@reflect()
class Name {
  @SuperProp()
  name!: string;

  @SuperProp()
  some!: Some;
}

@reflect()
class Nyeh {
  @SuperProp()
  lul!: string;
}

class Message {
  @SuperProp()
  message!: string;

  @SuperProp()
  name!: Name[];

  @SuperProp()
  nyeh!: Nyeh;
}

const MessageModel = getModel(Message);

(async () => {
  try {
    await doConnect();
    await new Promise(r => setTimeout(r, 1000));
    console.log('connected')

    await MessageModel.create({
      message: 'some message',
      name: {
        //name: 'some name',
        some: {
          number: 69,
        }
      }
    });
  } catch (error: any) {
    console.log(error.message)
  }
})();
