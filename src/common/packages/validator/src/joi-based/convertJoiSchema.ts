import joi from 'joi';

import { Schema } from './types';

export const convertJoiSchema = <T = unknown>(joiSchema: joi.Schema<T>): Schema<T> => {
  const schema: Schema<T> = {
    validate: async (...args: any[]) => {
      try {
        // @ts-ignore
        const value = await joiSchema.validateAsync.bind(joiSchema)(...args);
        return {
          value,
          error: undefined,
        };
      } catch (error) {
        if (error instanceof joi.ValidationError) {
          return {
            value: undefined,
            error,
          };
        }

        throw error;
      }
    },
    validateSync: joiSchema.validate.bind(joiSchema),
    describe: joiSchema.describe.bind(joiSchema),
  };

  return schema;
}
