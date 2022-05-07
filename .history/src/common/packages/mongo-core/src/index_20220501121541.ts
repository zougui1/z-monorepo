import './initReflect';
import 'reflect-metadata';
import { connect } from './connection';
import { Prop, SuperProp } from './decorators';
import { getModel } from './getModel';
import { prop, getModelForClass } from '@typegoose/typegoose';
import { isThenable } from '@zougui/common.promise-utils';
import { AnyBulkWriteOperation } from '.pnpm/mongodb@4.3.1/node_modules/mongodb';

const dbName = 'media';
const host = '127.0.0.1';

const doConnect = async () => {
  return await connect({ dbName, host });
}

class Name {
  @Prop()
  name!: string;
}

class Message {
  @SuperProp<Message>()
  message!: string;
}

const MessageModel = getModel(Message);

/*class Test {
  constructor() {
    console.log('construct');
  }

  static modelName = 'Test';
  static getMaxListeners() {
    return 5554;
  }

  static async find() {
    return { _id: '74547544re54grergz' };
  }
}*/

(async () => {
  /*class Dummy {
    @prop()
    dummy!: string;
  }

  const DummyModel = getModelForClass(Dummy);

  const promise = new Promise(r => setTimeout(r, 500));
  const buffer: { fnName: string | symbol; args: any[], target: any; resolve: Function; reject: Function }[] = [];
  let resolved = false;

  promise.then(async () => {
    console.log('resolved');
    resolved = true;

    for (const { target, fnName, args, resolve, reject } of buffer) {
      await target[fnName].apply(target, args).then(resolve).catch(reject);
    }

    buffer.length = 0;
  });

  class Proxied {
    proxy: typeof Test;

    constructor() {
      this.proxy = new Proxy(Test, {
        get(target, propName) {
          console.log(propName);

          return new Proxy(new Test(), {});
        }
      });
    }
  }

  const proxied = new Proxy(Test, bufferProxyHandler);

  console.log(proxied.modelName);
  console.log(proxied.getMaxListeners());
  console.log(await proxied.find());*/

  console.log('obj', MessageModel.schema.obj);
  await new Promise(r => setTimeout(r, 500))
  console.log('obj', MessageModel.schema.obj);

  /*await doConnect();
  const message = new MessageModel({
    message: 'some message',
  });

  await message.save();*/
})();

export default {
  connect,
};

export * from './connection';
export * from './DocumentType';
