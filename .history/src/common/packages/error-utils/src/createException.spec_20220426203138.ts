import { Exception } from './Exception';
import { createException } from './createException';

describe('createException()', () => {
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  it('should be an instance of Exception', () => {
    const MyError = createException({ code, message });
    const error = new MyError();

    expect(error).toBeInstanceOf(Exception);
  });

  it('should have the correct properties defined', () => {
    const MyError = createException({ code, message, name });
    const error = new MyError();

    expect(error).toHaveProperty('code', code);
    expect(error).toHaveProperty('message', message);
    expect(error).toHaveProperty('name', name);
    expect(error).toHaveProperty('data', {});
    expect(error).toHaveProperty('cause', undefined);
  });

  it('should give a custom data object', () => {
    const data = { myString: 'some string' };
    const MyError = createException<{ myString: string }>({ code, message, name });
    const error = new MyError({ data });

    expect(error).toHaveProperty('code', code);
    expect(error).toHaveProperty('message', message);
    expect(error).toHaveProperty('name', name);
    expect(error).toHaveProperty('data', data);
    expect(error).toHaveProperty('cause', undefined);
  });

  it('should give a custom cause', () => {
    const cause = new Error('something happened!');
    const MyError = createException<void, Error>({ code, message, name });
    const error = new MyError({ cause });

    expect(error).toHaveProperty('code', code);
    expect(error).toHaveProperty('message', message);
    expect(error).toHaveProperty('name', name);
    expect(error).toHaveProperty('data', {});
    expect(error).toHaveProperty('cause', cause);
  });

  it('should take the name of the class when extended', () => {
    class MyError extends createException({ code, message }) {}
    const error = new MyError();

    expect(error).toHaveProperty('name', MyError.name);
  });
});

//#region type tests
// test when an exception is not supposed to have arguments
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const MyError = createException({ code, message, name });

  // @ts-expect-error when an empty object is given
  new MyError({});
  // @ts-expect-error when an empty object with any data is given
  new MyError({
    data: {} as any,
  });
  // @ts-expect-error when an empty object with any cause is given
  new MyError({
    cause: {} as any,
  });
  // @ts-expect-error when an empty object with any data and any cause is given
  new MyError({
    data: {} as any,
    cause: {} as any,
  });
}

// test when an exception is supposed to have data only
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const MyError = createException<{ myString: string }>({ code, message, name });

  // @ts-expect-error when no arguments are given
  new MyError();
  // @ts-expect-error when an empty object is given
  new MyError({});
  new MyError({
    // @ts-expect-error when an empty object is given
    data: {},
  });
  new MyError({
    data: {
      // @ts-expect-error when a value of the wrong type is given
      myString: 0,
    },
  });

  // should be ok when the value has the correct type
  new MyError({
    data: {
      myString: '',
    },
  });

  // should be ok when the value has the correct type even with cause given undefined
  new MyError({
    data: {
      myString: '',
    },
    cause: undefined,
  });

  new MyError({
    // @ts-expect-error when a cause is given
    cause: new Error(),
  });
}

// test when an exception is supposed to have a cause only
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const MyError = createException<void, Error>({ code, message, name });

  // @ts-expect-error when no arguments are given
  new MyError();
  // @ts-expect-error when an empty object is given
  new MyError({});
  // @ts-expect-error when any data is given
  new MyError({
    data: {} as any,
  });
  new MyError({
    // @ts-expect-error when the cause is of the wrong type
    cause: {},
  });

  // should be ok when the cause has the correct type
  new MyError({
    cause: new Error(),
  });

  // should be ok when the cause has the correct type even with data given undefined
  new MyError({
    data: undefined,
    cause: new Error(),
  });
}

// test when an exception is supposed to have both data and a cause
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const MyError = createException<{ myString: string }, Error>({ code, message, name });

  // @ts-expect-error when no arguments are given
  new MyError();
  // @ts-expect-error when an empty object is given
  new MyError({});
  // @ts-expect-error when data is given but not cause
  new MyError({
    data: {} as any,
  });
  new MyError({
    // @ts-expect-error when an empty object is given
    data: {},
    // @ts-expect-error when the cause is of the wrong type
    cause: {},
  });
  new MyError({
    data: {
      // @ts-expect-error when a value of the wrong type is given
      myString: 0,
    },
    cause: new Error(),
  });

  // should be ok when both the data and the cause have the correct type
  new MyError({
    data: {
      myString: '',
    },
    cause: new Error(),
  });
}

// test when an exception is supposed to have a custom exception as cause
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const SomeError = createException<{ str: string }>({ code, message, name });
  const MyError = createException<void, InstanceType<typeof SomeError>>({ code, message, name });

  // @ts-expect-error when no arguments are given
  new MyError();
  // @ts-expect-error when an empty object is given
  new MyError({});
  // @ts-expect-error when any data is given
  new MyError({
    data: {} as any,
  });
  new MyError({
    // @ts-expect-error when the cause is of the wrong type
    cause: {},
  });

  new MyError({
    // @ts-expect-error when the cause is of the wrong type even if it is an Error
    cause: new Error(),
  });

  new MyError({
    // @ts-expect-error when Exception is directly given as cause
    cause: new Exception({
      data: { str: '' },
    }),
  });

  // should be ok when the cause has the correct type
  new MyError({
    cause: new SomeError({
      data: { str: '' },
    }),
  });

  // should be ok when the cause has the correct type even with data given undefined
  new MyError({
    data: undefined,
    cause: new SomeError({
      data: { str: '' },
    }),
  });
}
//#endregion
