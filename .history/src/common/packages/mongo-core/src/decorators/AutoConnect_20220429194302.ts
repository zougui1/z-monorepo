import type mongoose from 'mongoose';

export const AutoConnect = (connect: () => Promise<typeof mongoose>): ClassDecorator => {
  return function AutoConnectDecorator(target: Function): void {
    Reflect.metadata('auto-connect', connect)(target);
  }
}
