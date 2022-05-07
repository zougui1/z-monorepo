export * from './common';
import chalk from 'chalk';
import { LogColor } from '@zougui/log.log-types';

const colors = [
  '#a5f454',
];

const reservedColors = [
  {
    label: (LogColor as any)[LogColor.debug],
    color: LogColor.debug,
  },
  {
    label: (LogColor as any)[LogColor.error],
    color: LogColor.error,
  },
  {
    label: (LogColor as any)[LogColor.info],
    color: LogColor.info,
  },
  {
    label: (LogColor as any)[LogColor.success],
    color: LogColor.success,
  },
  {
    label: (LogColor as any)[LogColor.warn],
    color: LogColor.warn,
  },
  {
    label: 'token',
    color: '#888',
  },
  {
    label: 'date',
    color: '#fff',
  },
  {
    label: 'timing',
    color: '#ffdd00',
  },
  {
    label: 'namespace',
    color: '#ff39b2',
  },
];

console.group('reserved colors');
for (const { label, color } of reservedColors) {
  const styler = typeof (chalk as any)[color] === 'function'
    ? (chalk as any)[color].bind(chalk)
    : chalk.hex(color);

  console.log(`${label}:`, styler(color));
}
console.groupEnd();
