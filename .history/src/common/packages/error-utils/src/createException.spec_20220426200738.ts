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
{
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  const MyError = createException({ code, message, name });
  // @ts-expect-erro
  new MyError({});
}
//#endregion
