import joi from 'joi';

import { Rule } from './Rule';
import { convertJoiSchema } from './convertJoiSchema';
import type { Schema } from './types';

export class MetadataSchemaBuilder<T = unknown> {
  #shape: Record<string, Rule> = {};
  #updated: boolean = true;
  #schema: Schema<T> | undefined;
  #options: joi.ValidationOptions = {};

  getRule(propertyKey: string): Rule {
    this.#updated = true;
    return this.#shape[propertyKey] ||= new Rule();
  }

  getSchema(): Schema<T> {
    if (this.#updated || !this.#schema) {
      this.#updated = false;
      this.#schema = convertJoiSchema(joi.object(this.buildSchemaShape()));
    }

    return this.#schema;
  }

  getOptions(): joi.ValidationOptions {
    return this.#options;
  }

  setOptions(options: joi.ValidationOptions): this {
    this.#options = options;
    return this;
  }

  clone(): MetadataSchemaBuilder<T> {
    const clonedSchemaBuilder = new MetadataSchemaBuilder<T>();

    clonedSchemaBuilder.#shape = Object.entries(this.#shape).reduce((shape, [name, rule]) => {
      shape[name] = rule.clone();
      return shape;
    }, {} as Record<string, Rule>);

    return clonedSchemaBuilder;
  }

  private buildSchemaShape() {
    return Object.entries(this.#shape).reduce((shape, [name, rule]) => {
      shape[name] = rule.getSchema();
      return shape;
    }, {} as Record<string, joi.Schema>);
  }
}
