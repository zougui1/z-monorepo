import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

import { getErrorMessage } from './getErrorMessage';

export class Exception<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | unknown | undefined = Cause | undefined,
> extends Error {
  cause?: TCause;
  code: string;
  data: TData;
  date = new Date();
  version: SimpleVersion;

  constructor(error: ExceptionData<TData, TCause>) {
    super(toFunction(error.message)({ data: error.data, cause: getCause(error.cause) as TCause }));

    this.name = error.name || this.constructor.name;
    this.code = error.code;
    this.data = error.data;
    this.cause = getCause(error.cause);
    this.version = error.version;

    Error.captureStackTrace(this, this.constructor);
  }
}

const getCause = <TCause extends Cause | unknown | undefined>(error: TCause): TCause => {
  if (error instanceof Exception) {
    return error;
  }

  if (isNativeError(error)) {
    return getEnumerableError(error);
  }

  // happens only when `TCause` is unknown
  return {
    name: 'UnknownError',
    message: getErrorMessage(error, 'An unknown error occurred.'),
    stack: undefined,
  } as TCause;
}

const isNativeError = (error: unknown): error is Error => {
  return error instanceof Error && !(error instanceof Exception);
}

const getEnumerableError = <TCause extends Error>(error: TCause): TCause => {
  const enumerableError = {
    ...error,
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  return enumerableError;
}

export interface ExceptionData<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | unknown | undefined = Cause | undefined,
> {
  name?: string | undefined;
  code: string;
  data: TData;
  message: string | ((context: { data: TData; cause: TCause; }) => string);
  version: SimpleVersion;
  cause?: TCause | undefined;
}

export type Cause<
  TData extends UnknownObject = UnknownObject,
  TCause extends Exception | Error | undefined = Exception<UnknownObject, any> | Error | undefined,
> = Exception<TData, TCause> | Error;
