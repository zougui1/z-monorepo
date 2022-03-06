import * as yup from 'yup';
import type { ObjectShape, TypeOfShape, AnyObject } from 'yup/lib/object';

export class SchemaObject<TShape extends ObjectShape = AnyObject, TIn extends TypeOfShape<TShape> = TypeOfShape<TShape>> {
  #values: TIn;
  #schema: yup.ObjectSchema<TShape>;

  constructor(values: TIn, schema?: yup.ObjectSchema<TShape>) {
    this.#values = { ...values };
    this.#schema = schema ?? yup.object();
  }

  //#region value setters
  setValue<TKey extends keyof TIn = keyof TIn>(name: TKey, value: TIn[TKey]): this {
    this.#values[name] = value;
    return this;
  }

  setValues(values: Partial<TIn>): this {
    this.#values = {
      ...this.#values,
      ...values,
    };
    return this;
  }

  getValues(): TIn {
    return this.#values;
  }
  //#endregion

  //#region schema handlers
  isValid(): Promise<boolean> {
    return this.#schema.isValid(this.#values);
  }

  isValidSync(): boolean {
    return this.#schema.isValidSync(this.#values);
  }

  validate(): Promise<yup.ObjectSchema<TShape>['__outputType']> {
    return this.#schema.validate(this.#values);
  }

  validateSync(): yup.ObjectSchema<TShape>['__outputType'] {
    return this.#schema.validateSync(this.#values);
  }

  cast(): TypeOfShape<TShape> {
    return this.#schema.cast(this.#values);
  }
  //#endregion

  async getValidValues(): Promise<yup.ObjectSchema<TShape>['__outputType']> {
    await this.validate();
    return this.cast();
  }

  getValidValuesSync(): yup.ObjectSchema<TShape>['__outputType'] {
    this.validateSync();
    return this.cast();
  }
}

export {
  ObjectShape,
  TypeOfShape,
  AnyObject,
}
