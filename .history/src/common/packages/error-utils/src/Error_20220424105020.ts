const NativeError = global.Error;

export class Error extends NativeError {
  cause?: Error | undefined;

  constructor(message?: string | undefined, options?: ErrorOptions | undefined) {
    super(message);

    this.defineProperties();

    this.cause = options?.cause;
  }

  private defineProperties(): void {
    Object.defineProperty(this, 'cause', {
      enumerable: false,
    });
  }
}

export interface ErrorOptions {
  cause?: Error | undefined;
}
