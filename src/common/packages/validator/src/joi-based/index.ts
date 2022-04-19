import joi from 'joi';

import { toSchema } from './toSchema';
import { ExtendsClassSchema } from './ExtendsClassSchema';
import { PropertyRule } from './PropertyRule';

const IsString = () => {
  return PropertyRule(rule => rule.setSchema(joi.number().required()));
}

const IsOptional = () => {
  return PropertyRule(rule => rule.optional());
}

class Value {
  @IsString()
  @IsOptional()
  string!: string;
}

@ExtendsClassSchema(() => Value)
class Test extends Value {}

const valueSchema = toSchema(Test);

(async () => {
  console.group('decorated joi');
  //const value = new Value();
  const value = {
    string: 45
  }
  //value.string = 'string';

  //console.log(mergeSchemas(joi.any(), joi.string()).describe());
  //console.log(joi.any().required().$_compile(joi.string()).describe())

  console.log(valueSchema.describe())

  const { error, value: validatedValue } = await valueSchema.validate(value);

  if (error) {
    console.log('error:');
    console.log(JSON.stringify(error, null, 2));
  } else {
    console.log('valid', validatedValue);
  }
  console.groupEnd();
})();

(async () => {
  console.group('joi');

  const schema = joi.object({
    string: joi.string().required(),
  });

  const value = {

  };

  const { error } = schema.validate(value, { abortEarly: false });

  if (error) {
    console.log('error:');
    console.log(JSON.stringify(error, null, 2));
  } else {
    console.log('valid');
  }
  console.groupEnd();
});
