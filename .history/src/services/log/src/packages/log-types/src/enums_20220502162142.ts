export enum LogKind {
  console = 'console',
  file = 'file',
  http = 'http',
  email = 'email',
  discord = 'discord',
}

export enum LogLevel {
  debug = 'debug',
  info = 'info',
  success = 'success',
  warn = 'warn',
  error = 'error',
}

export enum LogLevelNumber {
  debug = 4,
  info = 3,
  success = 2,
  warn = 1,
  error = 0,
}

export enum LogColor {
  debug = '#1166ff',
  info = '#55aaff',
  success = '#22dd22',
  warn = '#ff8800',
  error = '#dd3333',
}

export enum LogType {
  simpleLog = 'simpleLog',
  taskLog = 'taskLog',
}
