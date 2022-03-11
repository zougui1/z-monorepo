import joi from 'joi';
import * as yup from 'yup';

const joiUserSchema = joi.object({
  name: joi.string().required().min(3).max(40),
  email: joi.string().email({ tlds: { allow: false } }).required(),
  password: joi.string().required().min(8).max(1000),
  role: joi.valid('user', 'admin'),
  age: joi.number().positive().integer(),
});

yup.setLocale({
  array: {
    length: values => ({ key: 'errors.validations.length', values }),
  },
  mixed: {
    required: values => ({ key: 'errors.validations.required', values }),
  },
});

const yupUserSchema = yup.object({
  name: yup.string().required().min(3).max(40),
  email: yup.string().email().required(),
  password: yup.string().required().min(8).max(1000),
  role: yup.string().oneOf(['user', 'admin']),
  age: yup.number().positive().integer(),
  music: yup.object({
    name: yup.string().required(),
  }),
}).noUnknown();

const validEmail = 'zougui@gmail.com';
const validName = 'zougui';
const validPassword = 'some password';

const users = {
  empty: { music: {} },
  missingName: {
    email: validEmail,
    password: validPassword,
  },
  invalidRole: {
    name: validName,
    email: validEmail,
    password: validPassword,
    role: 'inexistent'
  },
  invalidProperties: {
    name: validName,
    email: validEmail,
    password: validPassword,
    age: '56',
    unexpectedProperty: 'value',
  },
  valid: {
    name: validName,
    email: validEmail,
    password: validPassword,
    age: '56',
  },
};

const joiValidate = async (user: any) => {
  return await joiUserSchema.validateAsync(user, { abortEarly: false });
}

const yupValidate = async (user: any) => {
  return await yupUserSchema.validate(user, { abortEarly: false });
}

const commonValidate = async (label: string, validate: (() => Promise<any>)) => {
  console.groupCollapsed(label);
  try {
    const user = await validate();
    console.log('user:', user);
  } catch (error: any) {
    console.error('invalid');
    console.log('error:', {...error})
    console.log('error message:', error.message);
    console.groupCollapsed('full error');
    console.log(error);
    console.groupEnd();
  } finally {
    console.groupEnd();
  }
}

const validate = async (user: any) => {
  await commonValidate('joi', () => joiValidate(user));
  await commonValidate('yup', () => yupValidate(user));
}

const validateAll = async () => {
  for (const [userType, user] of Object.entries(users)) {
    console.groupCollapsed(userType);
    await validate(user);
    console.groupEnd();
  }
}

const typeTest = async () => {
  const joiUser = await joiValidate(users.valid);
  const yupUser = await yupValidate(users.valid);

  console.groupCollapsed('type testing');

  console.group('joi');
  console.log('name:', joiUser.name);
  console.log('email:', joiUser.email);
  console.log('password:', joiUser.password);
  console.log('age:', joiUser.age);
  console.log('role:', joiUser.role);
  console.groupEnd();

  console.group('yup');
  console.log('name:', yupUser.name);
  console.log('email:', yupUser.email);
  console.log('password:', yupUser.password);
  console.log('age:', yupUser.age);
  console.log('role:', yupUser.role);
  console.groupEnd();

  console.groupEnd();
}

const perfTestSync = (label: string, validate: (() => any), iter: number) => {
  console.time(label);
  while (iter--) try { validate() } catch (e) {};
  console.timeEnd(label);
}

const perfTestAsync = async (label: string, validate: (() => Promise<any>), iter: number) => {
  console.time(label);
  await Promise.all(new Array(iter).fill(0).map(() => validate().catch(() => {}))).catch(() => {});
  console.timeEnd(label);
}

const perfTest = async () => {
  const iter = 1;

  console.group('sync');
  perfTestSync('joi', () => joiUserSchema.validate(users.empty, { abortEarly: false }), iter);
  perfTestSync('yup', () => yupUserSchema.validateSync(users.empty, { abortEarly: false }), iter);
  console.groupEnd();

  console.group('async');
  await perfTestAsync('joi', () => joiValidate(users.empty), iter);
  await perfTestAsync('yup', () => yupValidate(users.empty), iter);
  console.groupEnd();
}

const validateYup = async <TOut = any>(validate: (() => Promise<TOut>)): Promise<TOut> => {
  return await validate();
}

(async () => {
  console.clear();

  console.groupCollapsed('validations');
  //await validateAll().catch(() => {});
  console.groupEnd();

  console.groupCollapsed('types');
  //await typeTest().catch(() => {});
  console.groupEnd();

  console.groupCollapsed('perf');
  //await perfTest().catch(() => {});
  console.groupEnd();

  try {
    const user = await validateYup(() => yupUserSchema.validate(users.empty, { abortEarly: false }));
    console.log(user.name);
  } catch (error: any) {
    const innerErrors = error.inner;

    console.log('error message:', error.message);
    console.log('inner error message:');
    console.log(innerErrors.map((err: any) => err.message));

    console.log({ ...error });
  }
})();
