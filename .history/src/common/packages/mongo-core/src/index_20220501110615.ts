import 'reflect-metadata';
import { connect } from './connection';
import { Prop } from './decorators';
import { getModel } from './getModel';
import { prop } from '@typegoose/typegoose';
import { isThenable } from '@zougui/common.promise-utils';

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
    console.log('construct')
  }
}

(async () => {
  const bufferProxyHandler: ProxyHandler<typeof Test> = {
    get(target, propName) {
      const prop = (target as any)[propName];

      if (typeof prop !== 'function') {
        return prop;
      }

      return (...args: any[]): any => {
        console.log('proxied function');
        const result = prop(...args);

        if (!isThenable(result)) {
          return result;
        }

        console.log('proxied promise');
        return result;
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

    static modelName = 'Test';
    static getModelName() {
      return this.modelName;
    }

    static async resolveModelName() {
      return this.modelName;
    }
  }

  const proxied = new Proxy(Proxied, {
    get(target, propName) {
      return (target as any)[propName];
    }
  })

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
