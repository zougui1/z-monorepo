import chalk from 'chalk';
import _ from 'lodash';

import env from '@zougui/common.env';
console.log(chalk.hex('#00ffdb')('gt'))
export const crossPlatformConsoleStyles = (inputs: Input[]): { message: string; styles: string[] } => {
  const messages: string[] = [];
  const styles: string[] = [];

  for (const input of inputs) {
    if (env.isBrowser) {
      const modifiers = input.styles
        ? Object.entries(input.styles).map(([name, value]) => `${_.kebabCase(name)}: ${value}`).join(';')
        : '';

      messages.push(`%c${input.message}`);
      styles.push(modifiers);
    } else {
      const styles: ((message: string) => string)[] = input.styles
        ? Object.entries(input.styles).map(([name, value]) => {
          const styler = typeof (chalk as any)[name] === 'function'
            ? (chalk as any)[name].bind(chalk)
            : chalk.hex.bind(chalk)


          return typeof value === 'string'
            ? styler(value)
            : styler
        })
        : [];

      const message = styles.reduce((message, chalk) => chalk(message), input.message);
      messages.push(message);
    }
  }

  return { message: messages.join(''), styles };
}

export type Input = {
  message: string;
  styles?: Record<string, string | boolean>;
}
