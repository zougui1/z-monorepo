import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

export class Exception<
  TData extends UnknownObject = UnknownObject,
  TCause extends Exception | Error | undefined = Exception<UnknownObject, any> | Error | undefined,
> extends Error {
  cause?: TCause;
  code: string;
  data: TData;

  constructor(error: ErrorData<TData, TCause>) {
    super(toFunction(error.message)(error.data));

    this.name = error.name || this.constructor.name;
    this.code = error.code;
    this.data = error.data;
    this.cause = error.cause;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ErrorData<
  TData extends UnknownObject = UnknownObject,
  TCause extends Exception | Error | undefined = Exception<UnknownObject, any> | Error | undefined,
> {
  name?: string | undefined;
  code: string;
  data: TData;
  message: string | ((data: TData) => string);
  cause: TCause;
}
