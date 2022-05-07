export const SHUTDOWN_SIGNALS: NodeJS.Signals[] = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
];

export const CRASH_SIGNALS = ['uncaughtException', 'unhandledRejection'];
export const EXIT_SIGNALS = ['beforeExit', 'exit'];
