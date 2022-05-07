import { createException } from './createException';

const MyError = createException<void, void>({
  code: 'toto',
  message: 'toto',
  version: 'v1',
});

console.log({ ...(new MyError({cause: void 0})) });

export * from './getErrorMessage';
export * from './isErrorMessageObject';
export * from './isMessageObject';
export * from './getErrorObject';
export * from './Exception';
export * from './createException';
export * from './getLimitedStackTrace';
