import * as yup from 'yup';

export class SchemaObject<TSchema extends yup.AnyObjectSchema = yup.AnyObjectSchema, TIn extends TSchema['__inputType'] = TSchema['__inputType']> {
  #values: TIn;
  #schema: TSchema;

  constructor(values: TIn, schema?: TSchema) {
    this.#values = { ...values };
    this.#schema = schema ?? yup.object() as TSchema;
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

  validate(): Promise<yup.InferType<TSchema>> {
    return this.#schema.validate(this.#values);
  }

  validateSync(): yup.InferType<TSchema> {
    return this.#schema.validateSync(this.#values);
  }

  cast(): yup.InferType<TSchema> {
    return this.#schema.cast(this.#values);
  }
  //#endregion

  async getValidValues(): Promise<yup.InferType<TSchema>> {
    await this.validate();
    return this.cast();
  }

  getValidValuesSync(): yup.InferType<TSchema> {
    this.validateSync();
    return this.cast();
  }
}
