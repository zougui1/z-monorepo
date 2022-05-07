import { SHUTDOWN_SIGNALS, CRASH_SIGNALS, EXIT_SIGNALS } from './signals';

export const onShutdown = (callback: (...args: any[]) => any): void => {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.on(signal, callback);
  }
}

export const onCrash = (callback: (...args: any[]) => any): void => {
  for (const signal of CRASH_SIGNALS) {
    process.on(signal, callback);
  }
}

export const onExit = (callback: (...args: any[]) => any): void => {
  for (const signal of EXIT_SIGNALS) {
    process.on(signal, callback);
  }
}

export const onForcedExit = (callback: (...args: any[]) => any): void => {
  onShutdown(callback);
  onCrash(callback);
  onExit(callback);
}

export const onceShutdown = (callback: (...args: any[]) => any): void => {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.once(signal, callback);
  }
}

export const onceCrash = (callback: (...args: any[]) => any): void => {
  for (const signal of CRASH_SIGNALS) {
    process.once(signal, callback);
  }
}

export const onceExit = (callback: (...args: any[]) => any): void => {
  for (const signal of EXIT_SIGNALS) {
    process.once(signal, callback);
  }
}

export const onceForcedExit = (callback: (...args: any[]) => any): void => {
  onceShutdown(callback);
  onceCrash(callback);
  onceExit(callback);
}

export const offShutdown = (callback: (...args: any[]) => any): void => {
  for (const signal of SHUTDOWN_SIGNALS) {
    process.off(signal, callback);
  }
}

export const offCrash = (callback: (...args: any[]) => any): void => {
  for (const signal of CRASH_SIGNALS) {
    process.off(signal, callback);
  }
}

export const offExit = (callback: (...args: any[]) => any): void => {
  for (const signal of EXIT_SIGNALS) {
    process.off(signal, callback);
  }
}

export const offForcedExit = (callback: (...args: any[]) => any): void => {
  offShutdown(callback);
  offCrash(callback);
  offExit(callback);
}
