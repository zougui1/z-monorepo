import { getType, Type } from 'tst-reflect';
import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

import type { AnyObject } from '@zougui/common.type-utils';
import { isThenable } from '@zougui/common.promise-utils';

import { Prop } from './decorators';

class Dummy {
  @Prop()
  dummy!: string;
}

const DummyModel = getModelForClass(Dummy, {
  options: {

  }
});

/*
export const getModel = <U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> => {
  const types = Reflect.getMetadata('tst-reflect:type', cl) as { type: Type; target: Object; propName: string; useAdvancedReflection: boolean }[];
  //console.log(types);

  const BasicModel = getModelForClass<U, QueryHelpers>(cl, options);
  let AdvancedModel: ReturnModelType<U, QueryHelpers> | undefined;

  const bufferProxyHandler: ProxyHandler<ReturnModelType<U, QueryHelpers>> = {
    get(target, propName) {
      const prop = (target as any)[propName];
      console.log({ propName });

      if (typeof prop !== 'function') {
        return prop;
      }

      if (resolved && AdvancedModel) {
        console.log('already resolved');
        return prop.bind(AdvancedModel);
      }

      console.log('unresolved yet');
      return (...args: any[]): any => {
        console.log('proxied function');
        const result = (DummyModel as any)[propName](...args);

        if (!isThenable(result)) {
          return result;
        }

        return new Promise((resolve, reject) => {
          buffer.push({
            target,
            fnName: propName,
            args,
            resolve, reject,
          });
        });
      }
    }
  }

  const promise = new Promise(r => setTimeout(r, 500));
  const buffer: { fnName: string | symbol; args: any[], target: any; resolve: Function; reject: Function }[] = [];
  let resolved = false;
  const promises: Promise<void>[] = [];

  promise.then(async () => {
    console.log('resolved');
    resolved = true;

    for (const { target, fnName, args, resolve, reject } of buffer) {
      await (AdvancedModel as any)[fnName].apply(AdvancedModel, args).then(resolve).catch(reject);
    }

    buffer.length = 0;
  });

  for (const { type, target, propName, useAdvancedReflection } of types) {
    if (!useAdvancedReflection) {
      continue;
    }

    if (type.isClass()) {
      type.getCtor().then(constructor => {
        Prop({ type: () => constructor })(target, propName);
      });
    }
  }

  Promise.all(promises).then(() => {
    console.log('all')
    AdvancedModel = getModelForClass<U, QueryHelpers>(cl, options);
  })

  const proxied = new Proxy(BasicModel, bufferProxyHandler);

  return proxied;
}
*/


export function getModel<U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> {
  const properties = (Reflect.getMetadata('custom-properties', cl) || []) as { target: Object; propName: string }[];
  const type = getType<U>();

  const BasicModel = getModelForClass<U, QueryHelpers>(cl, options);
  let AdvancedModel: ReturnModelType<U, QueryHelpers> | undefined;

  const bufferProxyHandler: ProxyHandler<ReturnModelType<U, QueryHelpers>> = {
    get(target, propName) {
      const prop = (target as any)[propName];

      if (typeof prop !== 'function') {
        return prop;
      }

      if (resolved && AdvancedModel) {
        return prop.bind(AdvancedModel);
      }

      return (...args: any[]): any => {
        const result = (DummyModel as any)[propName](...args);

        if (!isThenable(result)) {
          return result;
        }

        return new Promise((resolve, reject) => {
          buffer.push({
            fnName: propName,
            args,
            resolve,
            reject,
          });
        });
      }
    }
  }

  const promise = new Promise(r => setTimeout(r, 500));
  const buffer: { fnName: string | symbol; args: any[], resolve: Function; reject: Function }[] = [];
  let resolved = false;
  const promises: Promise<void>[] = [];

  promise.then(async () => {
    console.log('resolved');
    resolved = true;

    for (const { fnName, args, resolve, reject } of buffer) {
      await (AdvancedModel as any)[fnName].apply(AdvancedModel, args).then(resolve).catch(reject);
    }

    buffer.length = 0;
  });

  for (const { target, propName } of properties) {
    const property = type.getProperties().find(property => property.name === propName);

    // it should never happen, but for type safety
    if (!property) {
      throw new Error(`Could not find property "${propName}" on class "${cl.name}"`);
    }

    console.log(property)

    if (property.type.isClass()) {
      property.type.getCtor().then(constructor => {
        Prop({ type: () => constructor })(target, propName);
      });
    }
  }

  Promise.all(promises).then(() => {
    console.log('all')
    AdvancedModel = getModelForClass<U, QueryHelpers>(cl, options);
  })

  const proxied = new Proxy(BasicModel, bufferProxyHandler);

  return proxied;
}
