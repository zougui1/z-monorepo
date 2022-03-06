import * as yup from 'yup';
import type { ObjectShape, TypeOfShape, AnyObject } from 'yup/lib/object';

import { union, SchemaObject } from '@zougui/common.yup-utils';

import { processRouteTemplate } from '../utils';
import { RouteComponent } from '../types';

const getDefaultPathParamSchema = () => union(yup.string().strict(), yup.number());

export class RouteTemplate<
  TParamsShape extends ObjectShape = AnyObject,
  TParamsIn extends Partial<TypeOfShape<TParamsShape>> = Partial<TypeOfShape<TParamsShape>>,
> {
  #components: RouteComponent[];
  #params: SchemaObject<TParamsShape>;

  constructor(route: string, schema?: yup.ObjectSchema<TParamsShape>) {
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

  setParam<TKey extends keyof TypeOfShape<TParamsShape> & string>(name: TKey, value: TypeOfShape<TParamsShape>[TKey]): this {
    this.#params.setValue(name, value);
    return this;
  }

  setParams(values: TParamsIn): this {
    this.#params.setValues(values);
    return this;
  }

  getParams(): TParamsIn {
    return this.#params.getValues() as TParamsIn;
  }
}
