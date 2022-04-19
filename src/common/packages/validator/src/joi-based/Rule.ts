import _ from 'lodash';
import joi from 'joi';
import type { Schema } from 'joi';

export class Rule {
  #schema: Schema | undefined;
  #presence: 'optional' | 'required' = 'required';
  #modifiers: Record<string, Modifier> = {};
  #arrayModifiers: Record<string, Modifier> = {};
  #isArray: boolean = false;

  setSchema(schema: Schema): this {
    if (this.#schema) {
      throw new Error('A schema is already set');
    }

    // everything is required by default
    this.#schema = schema.required();
    return this;
  }

  private addMofifier(modifier: Modifier, options?: { array?: boolean | undefined } | undefined): this {
    if (options?.array) {
      this.#arrayModifiers[modifier.type] = modifier;
    } else {
      this.#modifiers[modifier.type] = modifier;
    }

    return this;
  }

  //#region presence
  presence(presence: 'optional' | 'required'): this {
    this.#presence = presence;
    return this;
  }

  required(): this {
    this.presence('required');
    return this;
  }

  optional(): this {
    this.presence('optional');
    return this;
  }
  //#endregion

  //#region array
  isArray(isArray: boolean | undefined = false): this {
    this.#isArray = isArray;
    return this;
  }
  //#endregion

  //#region modifiers
  //#region truthiness modifiers
  truthy(args: TruthinessModifier['args']): this {
    return this.addMofifier({
      type: 'truthy',
      args,
    });
  }

  falsy(args: TruthinessModifier['args']): this {
    return this.addMofifier({
      type: 'falsy',
      args,
    });
  }
  //#endregion

  //#region case sensitivity modifiers
  sensitive(enabled: boolean): this {
    return this.addMofifier({
      type: 'sensitive',
      args: [enabled],
    });
  }
  //#endregion

  //#region default value modifiers
  default(defaultValue: unknown): this {
    if (defaultValue === undefined) {
      return this;
    }

    return this.addMofifier({
      type: 'default',
      args: [defaultValue],
    });
  }
  //#endregion

  //#region number modifiers
  precision(limit?: number | undefined): this {
    if (typeof limit !== 'number') {
      return this;
    }

    return this.addMofifier({
      type: 'precision',
      args: [limit],
    });
  }

  unsafe(enabled: boolean): this {
    return this.addMofifier({
      type: 'unsafe',
      args: [enabled],
    });
  }

  sign(sign: 'positive' | 'negative'): this {
    return this.addMofifier({
      type: 'sign',
      args: [sign],
    });
  }
  //#endregion

  //#region object modifiers
  unknown(enabled: boolean): this {
    return this.addMofifier({
      type: 'unknown',
      args: [enabled],
    });
  }
  //#endregion

  //#region length modifiers
  min(limit?: number | undefined, options?: { array?: boolean | undefined } | undefined): this {
    if (limit === undefined) {
      return this;
    }

    return this.addMofifier({
      type: 'min',
      args: [limit],
    }, options);
  }

  max(limit?: number | undefined, options?: { array?: boolean | undefined } | undefined): this {
    if (limit === undefined) {
      return this;
    }

    return this.addMofifier({
      type: 'max',
      args: [limit],
    }, options);
  }
  //#endregion

  //#region simple modifiers
  strict(): this {
    return this.addMofifier({
      type: 'strict',
      args: [],
    });
  }

  strip(): this {
    return this.addMofifier({
      type: 'strip',
      args: [],
    });
  }
  //#endregion
  //#endregion

  getSchema(): Schema {
    if (!this.#schema) {
      throw new Error('No schema defined');
    }

    const schema = this.#schema.presence(this.#presence);

    const modifiedSchema = Object.values(this.#modifiers).reduce((schema, modifier) => {
      return applyModifier(schema, modifier);
    }, schema);

    const finalSchema = this.#isArray
      ? joi.array().items(modifiedSchema)
      : modifiedSchema;

    return finalSchema;
  }

  clone(): Rule {
    const clonedRule = new Rule();
    clonedRule.#schema = this.#schema;
    clonedRule.#modifiers = _.cloneDeep(this.#modifiers);

    return clonedRule;
  }
}

const applyModifier = (schema: Schema, modifier: Modifier) => {
  return (schema as any)[modifier.type]?.(...(modifier.args || []));
}

export type Modifier =
  | TruthinessModifier
  | SensitiveModifier
  | DefaultValueModifier
  | SimpleModifier
  | PrecisionModifier
  | UnsafeModifier
  | SignModifier
  | UnknownModifier
  | LengthModifier;

interface TruthinessModifier {
  type: 'truthy' | 'falsy';
  args?: (string | number)[] | undefined;
}

interface SensitiveModifier {
  type: 'sensitive';
  args: [boolean];
}

interface DefaultValueModifier {
  type: 'default';
  args: [unknown];
}

interface SimpleModifier {
  type: 'strict' | 'strip';
  args: [];
}

export interface PrecisionModifier {
  type: 'precision';
  args: [number];
}

export interface UnsafeModifier {
  type: 'unsafe';
  args: [boolean];
}

export interface SignModifier {
  type: 'sign';
  args: ['positive' | 'negative'];
}

export interface UnknownModifier {
  type: 'unknown';
  args: [boolean];
}

export interface LengthModifier {
  type: 'min' | 'max';
  args: [number];
}

export interface BaseModifier {
  type: ModifierType;
  args: any[] | undefined;
}

export type ModifierType = 'required' | 'optional';
