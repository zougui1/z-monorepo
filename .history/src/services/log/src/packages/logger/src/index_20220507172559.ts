export * from './common';
import chalk from 'chalk';
import { LogColor } from '@zougui/log.log-types';

const colors = [
  '#a5f454',
  '#00ffdb',
  '#d174a6',
  '#88d',
];

const reservedColors = [
  {
    label: 'debug',
    color: LogColor.debug,
  },
  {
    label: 'error',
    color: LogColor.error,
  },
  {
    label: 'info',
    color: LogColor.info,
  },
  {
    label: 'success',
    color: LogColor.success,
  },
  {
    label: 'warn',
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

console.log();

console.group('ID colors');
for (const color of colors) {
  const styler = typeof (chalk as any)[color] === 'function'
    ? (chalk as any)[color].bind(chalk)
    : chalk.hex(color);

  console.log('ID:', styler(color));
}
console.groupEnd();
