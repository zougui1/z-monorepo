import type { UnknownObject } from '@zougui/common.type-utils';

export class Exception extends Error {
  constructor() {
    super();
  }
}

export interface ErrorData<TData extends UnknownObject = UnknownObject> {
  name?: string | undefined;
  code: string;
  data: TData;
}
