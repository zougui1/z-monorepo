import type { ValidationError, Schema as JoiSchema, ValidationOptions } from 'joi';

export interface ValidationResultsSuccess<T = unknown> {
  error: undefined;
  warning?: ValidationError | undefined;
  value: T;
}

export interface ValidationResultsError {
  error: ValidationError;
  warning?: ValidationError | undefined;
  value: undefined;
}

export type ValidationResults<T = unknown> = ValidationResultsSuccess<T> | ValidationResultsError;

export interface Schema<T = unknown> {
  validate: (value: unknown, options?: ValidationOptions | undefined) => Promise<ValidationResults<T>>;
  validateSync: (value: unknown, options?: ValidationOptions | undefined) => ValidationResults<T>;
  describe: JoiSchema['describe'];
}
