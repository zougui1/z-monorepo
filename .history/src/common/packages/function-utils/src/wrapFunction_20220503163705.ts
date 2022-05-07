function wrapFunction<T>(func: (() => T), options: WrapFunctionOptions<T>): T;
function wrapFunction<T>(func: (() => Promise<T>), options: WrapFunctionOptions<T>): Promise<T>;
function wrapFunction<T>(func: (() => T | Promise<T>), options: WrapFunctionOptions<T>): T | Promise<T>;
function wrapFunction<T>(func: (() => T | Promise<T>), options: WrapFunctionOptions<T>): T | Promise<T> {
  try {
    const result = func();

    if (!(result instanceof Promise)) {
      options.onResolve?.(result);
      return result;
    }

    return result
      .then(res => {
        options.onResolve?.(res);
        return res;
      })
      .catch(error => {
        if (!options.onReject) {
          throw error;
        }

        return options.onReject(error);
      })
      .finally(() => options.onFinally?.());
  } catch (error) {
    options.onReject?.(error);
    throw error;
  } finally {
    options.onFinally?.();
  }
}

interface WrapFunctionOptions<T> {
  onResolve?: ((value: T) => void) | undefined;
  onReject?: ((error: unknown) => T | never) | undefined;
  onFinally?: (() => void) | undefined;
}
