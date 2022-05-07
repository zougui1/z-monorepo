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

function wrap<T>(func: (() => T), options: WrapOptions<T>): T;
function wrap<T>(func: (() => Promise<T>), options: WrapOptions<T>): Promise<T>;
function wrap<T>(func: (() => T | Promise<T>), options: WrapOptions<T>): T | Promise<T>;
function wrap<T>(func: (() => T | Promise<T>), options: WrapOptions<T>): T | Promise<T> {
  try {
    const result = func();

    if (!(result instanceof Promise)) {
      options.onResolve?.(result);
      return result;
    }

    return result
      .then(res => {
        options.onResolve?.(res);
        return res;
      })
      .catch(error => {
        if (!options.onReject) {
          throw error;
        }

        return options.onReject(error);
      })
      .finally(() => options.onFinally?.());
  } catch (error) {
    options.onReject?.(error);
    throw error;
  } finally {
    options.onFinally?.();
  }
}

interface WrapOptions<T> {
  onResolve?: ((value: T) => void) | undefined;
  onReject?: ((error: unknown) => T | never) | undefined;
  onFinally?: (() => void) | undefined;
}

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

const classes: any = {}

const json = '/mnt/Dev/Code/javascript/zougui/src/common/packages/mongo-core/dump.json';

export function getModel<U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> {
  const type = getType<U>();

  const BasicModel = getModelForClass<U, QueryHelpers>(cl, options);
  let AdvancedModel: ReturnModelType<U, QueryHelpers> | undefined;

  const Custom = classes[cl.name] ||= class Custom { };
  (Custom as any).actualName = cl.name;

  const bufferProxyHandler: ProxyHandler<ReturnModelType<U, QueryHelpers>> = {
    get(target, propName) {
      const Model = AdvancedModel || target;
      //require('fs').writeFileSync(json, JSON.stringify(Model.schema.obj, null, 2));
      //console.log('use:', AdvancedModel ? 'AdvancedModel' : 'BasicModel');
      //console.log('obj', (Model as any).schema.obj)
      const anyModel = Model as any;
      console.log('message:', Object.keys(anyModel.schema.obj));
      console.log('message.name:', Object.keys(anyModel.schema.obj.name.type.obj));
      console.log('message.name.some:', Object.keys(anyModel.schema.obj.name.type.obj.some.type.obj));
      //console.log('name', (Model as any).schema.obj.name.type.constructor.name)
      //console.log('name.some', (Model as any).schema.obj.name.type.obj.some.type?.constructor.name)
      //console.log('name.some.number', (Model as any).schema.obj.name.type.obj.some.type?.obj.number.type?.constructor.name)
      //console.log('name.some.some.number', (Model as any).schema.obj.name.type.obj.some.type?.obj.some.type?.obj/*.number/*.type?.constructor.name*/)
      const prop = (Model as any)[propName];

      if (typeof prop !== 'function') {
        return prop;
      }

      if (resolved && AdvancedModel) {
        return prop.bind(AdvancedModel);
      }

      return (...args: any[]): any => {
        const result = wrap(() => (DummyModel as any)[propName](...args), {
          onReject: () => { },
        });

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

  const buffer: { fnName: string | symbol; args: any[], resolve: Function; reject: Function }[] = [];
  let resolved = false;
  const promises: Promise<void>[] = decorateType(type, cl, Custom);

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

  Promise.all(promises).then(async () => {
    console.log('classes', classes);
    console.log('prototypes', Object.entries(classes).reduce((prototypes, [name, constructor]) => {
      prototypes[name] = (constructor as any).prototype;
      return prototypes;
    }, {} as any));
    console.log(classes.Name.prototype === classes.Some.prototype)
    console.log('resolved');
    resolved = true;
    AdvancedModel = getModelForClass<U, QueryHelpers>(Custom as any, options);
    //console.log((AdvancedModel as any).schema.obj.name)

    for (const { fnName, args, resolve, reject } of buffer) {
      console.log('from AdvancedModel', fnName)
      await (AdvancedModel as any)[fnName].apply(AdvancedModel, args).then(resolve).catch(reject);
    }

    buffer.length = 0; })

  const proxied = new Proxy(BasicModel, bufferProxyHandler);

  return proxied;
}

const decorateType = (type: Type, origin: Constructor<unknown>, target: Constructor<unknown>): Promise<void>[] => {
  //console.log('decorate:', type.name);
  //console.log('properties', type.getProperties().map(p => p.name))
  const promises: Promise<void>[] = [];
  const typeProperties = type.getProperties();
  const propertiesNames = (Reflect.getMetadata('custom-properties', origin) || []) as { target: Object; propName: string; basicType: Function; isPrimitiveType: boolean }[];

  for (const { propName, isPrimitiveType, basicType } of propertiesNames) {
    if (isPrimitiveType) {
      console.log(
        `${(target as any).actualName}.${propName}: ${basicType.name}`
      );
      __decorate([
        // @ts-ignore
        Prop({ type: basicType }),
      ], target.prototype, propName, void 0);
      continue;
    }

    const property = typeProperties.find(property => property.name === propName);

    // it should never happen, but for type safety
    if (!property) {
      throw new Error(`Could not find property "${propName}" on class "${origin.name}"`);
    }

    if (!property.type) {
      throw new Error(`No type found for property "${propName}" on class "${type.name}"`);
    }

    const propertyType = property.type.name === 'Array'
      ? property.type.getTypeArguments()[0]
      : property.type;

    if (propertyType.isClass()) {
      const promise = propertyType.getCtor()
        .then(async constructor => {
          // should not happen. for type safety
          if (!constructor) {
            throw new Error(`constructor not found for property "${propName}"`);
          }

          /*console.group(propertyType.name);
          console.log(
            'propertyType props',
            propertyType.getProperties().map(p => p.name),
          )
          console.log(
            'sub props:',
            constructor.name,
            (Reflect.getMetadata('custom-properties', constructor) || []).map((p: any) => p.propName),
          )
          console.groupEnd();*/

          const CustomSub = classes[constructor.name] ||= class CustomSub { };
          (CustomSub as any).actualName = propertyType.name;

          await Promise.all(decorateType(propertyType, constructor, CustomSub));

          /*console.log(
            `${constructor.name}${CustomSub.name}`,
            'has the properties:',
            propertyType.getProperties().map(p => `${p.name}: ${p.type.name}`)
          )
          console.log(
            'decorate type',
            `${constructor.name}${CustomSub.name}`,
            'on property',
            `${target.name}.${propName}`
          )*/

          console.log(
            `${(target as any).actualName}.${propName}: ${(CustomSub as any).actualName}`
          );
          __decorate([
            // @ts-ignore
            Prop({ type: () => CustomSub }),
          ], target.prototype, propName, void 0);
        });

      promises.push(promise);
    }
  }

  return promises;
}

const factory = () => {
  return class Something {}
}

var __decorate = (this && (this as any).__decorate) || function (decorators: any, target: any, key: any, desc: any) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

const SomethingA = factory();
const SomethingB = factory();

console.log('SomethingA', SomethingA);
console.log('SomethingB', SomethingB);

process.exit();

/*
class Some {
  number!: number;
}

class Name {
  name!: string;
  some!: Some;
}

class Message {
  message!: string;
  name!: Name;
}
*/
