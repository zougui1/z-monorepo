import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

export class Exception<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | undefined = Cause | undefined,
> extends Error {
  cause?: TCause;
  code: string;
  data: TData;
  date = new Date();
  version: SimpleVersion;

  constructor(error: ExceptionData<TData, TCause>) {
    super(toFunction(error.message)(error.data));

    this.name = error.name || this.constructor.name;
    this.code = error.code;
    this.data = error.data;
    this.cause = isNativeError(error.cause)
      ? getEnumerableError(error.cause) as TCause
      : error.cause;

    this.version = error.version;

    Error.captureStackTrace(this, this.constructor);
  }
}

const isNativeError = (error: unknown): error is Error => {
  return error instanceof Error && !(error instanceof Exception);
}

const getEnumerableError = (error: Error): Error => {
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
  TCause extends Cause | undefined = Cause | undefined,
> {
  name?: string | undefined;
  code: string;
  data: TData;
  message: string | ((data: TData) => string);
  version: SimpleVersion;
  cause?: TCause | undefined;
}

export type Cause<
  TData extends UnknownObject = UnknownObject,
  TCause extends Exception | Error | undefined = Exception<UnknownObject, any> | Error | undefined,
> = Exception<TData, TCause> | Error;
