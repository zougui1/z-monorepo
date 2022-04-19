import 'reflect-metadata';
import joi from 'joi';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import * as yup from 'yup';

//import './joi-based';
import { IsString, IsNumber, IsByteLength } from './i18-validations';
import { validate } from './validators';

class SubObject {
  @IsString()
  @IsByteLength(5)
  subString!: string;
}

class Validator {
  @IsString()
  string!: string;

  @IsNumber()
  number!: number;

  @ValidateNested()
  @Type(() => SubObject)
  object!: SubObject;
}

const schema = joi.object({
  string: joi.string().required(),
  number: joi.number().required(),
  object: joi.object({
    subString: joi.string().min(5).required(),
  }).required(),
});

(async () => {
  const value = {
    number: 45,
    object: {
      subString: '1',
    },
  }

  const errors = await validate(Validator, value, {
    stopAtFirstError: false
  });

  console.group('class-validator');
  /*if (errors.length) {
    console.log('error:');
    console.log(JSON.stringify(errors, null, 2));
  } else {
    console.log('valid');
  }*/
  console.groupEnd();
});

(() => {
  const value = {
    number: 45,
    object: {
      subString: '1',
    },
  }

  const schemaDesc = schema.describe()
  console.log(JSON.stringify(schemaDesc, null, 2))
  const { error } = joi.compile(schema.describe()).validate(value, { abortEarly: false });

  console.group('joi');
  /*if (error) {
    console.log('error:');
    console.log(JSON.stringify(error, null, 2));
  } else {
    console.log('valid');
  }*/
  console.groupEnd();
});

(async () => {
  const schema = yup.object({
    str: yup.string().required(),
    num: yup.number().optional(),
    user: yup.object({
      name: yup.string().required()
    })
  });

  const value = {
    num: true,
    user: {}
  };

  try {
    const valid = await schema.validate(value, { abortEarly: false });
    console.log('valid', valid);
  } catch (error) {
    console.log('error', JSON.stringify(error, null, 2));
  }
})();
