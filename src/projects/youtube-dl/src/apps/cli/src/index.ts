import { Command } from 'commander';

import { download } from './commands/download';

const program = new Command();

program.argument('<url...>');

program
  .command('*')
  .action(async () => {
    const [...urls] = program.args;
    await download(urls);
  });

program.parseAsync();
