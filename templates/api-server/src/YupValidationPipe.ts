import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { AnyObjectSchema } from 'yup';

import fs from 'fs-extra';

const json =
  '/mnt/Dev/Code/javascript/zougui/src/projects/image-downloader/src/apps/api-server/validation-error.json';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  private readonly schema: AnyObjectSchema;

  constructor(schema: AnyObjectSchema) {
    this.schema = schema;
  }

  async transform(value: unknown) {
    try {
      const validValue = await this.schema.validate(value);
      return validValue;
    } catch (error) {
      await fs.writeJson(json, error, { spaces: 2 });
      console.log('validation error');
      throw new BadRequestException(error);
    }
  }
}
