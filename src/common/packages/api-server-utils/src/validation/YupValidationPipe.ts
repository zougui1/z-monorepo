import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { AnyObjectSchema } from 'yup';
import type { ValidateOptions } from 'yup/lib/types';

const defaultOptions: ValidateOptions = {
  abortEarly: false,
};

@Injectable()
export class YupValidationPipe implements PipeTransform {
  private readonly schema: AnyObjectSchema;
  private readonly options: ValidateOptions;

  constructor(schema: AnyObjectSchema, options: ValidateOptions | undefined = defaultOptions) {
    this.schema = schema;
    this.options = options;
  }

  async transform(value: unknown) {
    try {
      const validValue = await this.schema.validate(value, this.options);
      return validValue;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
