import * as yup from 'yup';
import type { ObjectShape } from 'yup/lib/object';

import { union, SchemaObject } from '@zougui/common.yup-utils';

import { processRouteTemplate } from '../utils';
import { RouteComponent } from '../types';

const getDefaultPathParamSchema = () => union(yup.string().strict(), yup.number());

export class RouteTemplate<
  TSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema,
  TIn extends TSchema['__inputType'] = TSchema['__inputType'],
> {
  #components: RouteComponent[];
  #params: SchemaObject<TSchema>;

  constructor(route: string, schema?: TSchema) {
    this.#params = new SchemaObject({} as any, schema as any);
    this.#components = processRouteTemplate(route);
  }

  private isParametized = () => {
    return this.#components.some(comp => comp.isParam);
  }

  private buildDefaultSchema = (): yup.AnyObjectSchema => {
    const baseSchema = yup.object(this.#components.reduce((acc, comp) => {
      const { name, isParam, isOptional } = comp;

      if (isParam) {
        const paramSchema = getDefaultPathParamSchema();
        acc[name] = isOptional ? paramSchema.optional() : paramSchema.required();
      }

      return acc;
    }, {} as ObjectShape)) as yup.AnyObjectSchema;

    const defaultSchema = this.isParametized()
      ? baseSchema.required()
      : baseSchema.optional();

    return defaultSchema;
  }

  getPath = () => {
    const params = this.buildDefaultSchema().validateSync(this.#params.getValidValuesSync());
    const pathComponents = this.#components.map(comp => {
      const { name, isParam } = comp;

      return isParam ? params[name] : name;
    });

    return pathComponents.join('/');
  }

  setParam<TKey extends keyof TIn & string>(name: TKey, value: TIn[TKey]): this {
    this.#params.setValue(name, value);
    return this;
  }

  setParams(values: TIn): this {
    this.#params.setValues(values);
    return this;
  }

  getParams(): TIn {
    return this.#params.getValues() as TIn;
  }
}
