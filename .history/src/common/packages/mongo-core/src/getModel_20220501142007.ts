import { getType, Type } from 'tst-reflect';
import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import type { Constructor } from 'type-fest';

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
  console.log({properties})
  const type = getType<U>();

  const BasicModel = getModelForClass<U, QueryHelpers>(cl, options);
  let AdvancedModel: ReturnModelType<U, QueryHelpers> | undefined;

  class Custom {}

  const bufferProxyHandler: ProxyHandler<ReturnModelType<U, QueryHelpers>> = {
    get(target, propName) {
      const prop = (target as any)[propName];

      console.log([[[prop]]])

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
  const promises: Promise<void>[] = decorateType(type, cl, Custom);

  promise.then(async () => {
    console.log('resolved');
    resolved = true;

    for (const { fnName, args, resolve, reject } of buffer) {
      console.log('from AdvancedModel', fnName)
      await (AdvancedModel as any)[fnName].apply(AdvancedModel, args).then(resolve).catch(reject);
    }

    buffer.length = 0;
  });
  const typeProperties = type.getProperties();

  /*
  for (const { target, propName } of properties) {
    console.log({propName})
    const property = typeProperties.find(property => property.name === propName);

    // it should never happen, but for type safety
    if (!property) {
      throw new Error(`Could not find property "${propName}" on class "${cl.name}"`);
    }

    //console.log(property)

    if (property.type.isClass()) {
      const promise = new Promise(r => setTimeout(r, 500))
        .then(() => property.type.getCtor())
        .then(constructor => {
          // should not happen. for type safety
          if (!constructor) {
            throw new Error(`constructor not found for property "${propName}"`);
          }

          console.log('sub props:', constructor.name, (Reflect.getMetadata('custom-properties', constructor) || []))

          __decorate([
            // @ts-ignore
            Prop({ type: () => constructor }),
          ], Custom.prototype, propName, void 0);

          const props = getType<U>().getProperties();
          //console.log('pppppppppp', props.find(p => p.name === 'name'))
        });

      promises.push(promise);
    }
  }
  */

  Promise.all(promises).then(() => {
    console.log('all')
    AdvancedModel = getModelForClass<U, QueryHelpers>(Custom as any, options);
    //console.log((AdvancedModel as any).schema.obj.name)
  })

  const proxied = new Proxy(BasicModel, bufferProxyHandler);

  return proxied;
}

const decorateType = (type: Type, origin: Constructor<unknown>, target: Constructor<unknown>): Promise<void>[] => {
  const promises: Promise<void>[] = [];
  const typeProperties = type.getProperties();
  const propertiesNames = (Reflect.getMetadata('custom-properties', origin) || []) as { target: Object; propName: string }[];

  for (const { propName } of propertiesNames) {
    console.log({propName})
    const property = typeProperties.find(property => property.name === propName);

    // it should never happen, but for type safety
    if (!property) {
      throw new Error(`Could not find property "${propName}" on class "${origin.name}"`);
    }

    if (property.type.isClass()) {
      const promise = new Promise(r => setTimeout(r, 500))
        .then(() => property.type.getCtor())
        .then(async constructor => {
          // should not happen. for type safety
          if (!constructor) {
            throw new Error(`constructor not found for property "${propName}"`);
          }

          console.log(property.type.getProperties())
          console.log(getType(constructor).getProperties())
          console.log('sub props:', constructor.name, (Reflect.getMetadata('custom-properties', constructor) || []))

          __decorate([
            // @ts-ignore
            Prop({ type: () => constructor }),
          ], target.prototype, propName, void 0);

          await Promise.all(decorateType(getType(constructor), constructor, target));
        });

      promises.push(promise);
    }
  }

  return promises;
}

var __decorate = (this && (this as any).__decorate) || function (decorators: any, target: any, key: any, desc: any) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
