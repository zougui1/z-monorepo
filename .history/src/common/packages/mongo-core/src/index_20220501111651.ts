import 'reflect-metadata';
import { connect } from './connection';
import { Prop } from './decorators';
import { getModel } from './getModel';
import { prop } from '@typegoose/typegoose';
import { isThenable } from '@zougui/common.promise-utils';
import { AnyBulkWriteOperation } from '.pnpm/mongodb@4.3.1/node_modules/mongodb';

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

class Test {
  constructor() {
    console.log('construct');
  }

  static modelName = 'Test';
  static getModelName() {
    return this.modelName;
  }

  static async resolveModelName() {
    return this.modelName;
  }
}

(async () => {
  const promise = new Promise(r => setTimeout(r, 500));
  const buffer: { fnName: string | symbol; args: any[], target: any; }[] = [];
  let resolved = false;

  promise.then(async () => {
    resolved = true;

    for (const { target, fnName, args } of buffer) {
      await target[fnName].apply(target, args);
    }

    buffer.length = 0;
  });

  const bufferProxyHandler: ProxyHandler<typeof Test> = {
    get(target, propName) {
      const prop = (target as any)[propName];

      if (typeof prop !== 'function') {
        return prop;
      }

      if (resolved) {
        return prop.bind(target);
      }

      return (...args: any[]): any => {
        console.log('proxied function');

        buffer.push({
          target,
          fnName: propName,
          args,
        });
      }
    }
  }

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
  console.log(proxied.getModelName());
  console.log(await proxied.resolveModelName());

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
