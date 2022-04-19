import {
  validate as validate_,
  validateSync as validateSync_,
  validateOrReject as validateOrReject_,
} from 'class-validator';
import { ClassConstructor, plainToInstance, ClassTransformOptions } from 'class-transformer';
import type {
  ValidationError as ValidationError_,
  ValidatorOptions as ValidatorOptions_,
} from 'class-validator';

import { ValidationError } from './ValidationError';

export async function validate(constructor: ClassConstructor<any>, object: object, validatorOptions?: ValidatorOptions | undefined): Promise<ValidationError[]> {
  const classObject = plainToInstance(constructor, object);
  const errors = await validate_(classObject, validatorOptions);
  return transformValidationErrors(errors);
}

export function validateSync(constructor: ClassConstructor<any>, object: object, validatorOptions?: ValidatorOptions | undefined): ValidationError[] {
  const classObject = plainToInstance(constructor, object);
  const errors = validateSync_(classObject, validatorOptions);
  return transformValidationErrors(errors);
}

export async function validateOrReject(constructor: ClassConstructor<any>, object: object, validatorOptions?: ValidatorOptions | undefined): Promise<void> {
  const classObject = plainToInstance(constructor, object);

  try {
    await validateOrReject_(classObject, validatorOptions);
  } catch (errors) {
    if (Array.isArray(errors)) {
      throw transformValidationErrors(errors)
    }

    throw errors;
  }
}

const transformValidationErrors = (errors: ValidationError_[]): ValidationError[] => {
  return errors.map(error => new ValidationError(error));
}

export interface ValidatorOptions extends ValidatorOptions_ {
  classTransformerOptions?: ClassTransformOptions | undefined;
}
