export class Lazy<TReturn = unknown> {
  readonly #loader: (() => TReturn);
  readonly #isAsync: boolean;

  constructor(loader: (() => TReturn), isAsync: boolean | undefined = false) {
    this.#loader = loader;
    this.#isAsync = isAsync;
  }

  async(): Lazy<Promise<TReturn>> {
    // async/await are here to ensure that the loader
    // is asynchronous whether it actually is synchronous or not
    const asyncLoader = async () => await this.#loader();
    return new Lazy(asyncLoader, true);
  }

  getLoader(): (() => TReturn) {
    return this.#loader;
  }

  isAsync(): boolean {
    return this.#isAsync;
  }
}

export const lazy = <TReturn>(lazy: (() => TReturn)): Lazy<TReturn> => {
  return new Lazy(lazy);
}

export const isLazy = <TReturn = unknown>(value: unknown): value is Lazy<TReturn> => {
  return value instanceof Lazy;
}

export const isSyncLazy = <TReturn = unknown>(value: unknown): value is Lazy<TReturn> => {
  return isLazy(value) && !value.isAsync();
}

export const isAsyncLazy = <TReturn = unknown>(value: unknown): value is Lazy<Promise<TReturn>> => {
  return isLazy(value) && value.isAsync();
}
