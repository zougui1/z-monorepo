import chalk from 'chalk';

export const displayServerUrl = (port: number): void => {
  const verticalBar = chalk.green('|');

  console.log();
  console.log(chalk.green(' --------------------------------------'));
  console.log(chalk.green('|                                      |'));
  console.log(chalk.green('|                                      |'));
  console.log(chalk.green('|            Server started!           |'));
  console.log(chalk.green('|                                      |'));
  console.log(`${verticalBar}     Local: http://localhost:${port}     ${verticalBar}`)
  console.log(chalk.green('|                                      |'));
  console.log(chalk.green('|                                      |'));
  console.log(chalk.green(' -------------------------------------- '));
  console.log();
}
