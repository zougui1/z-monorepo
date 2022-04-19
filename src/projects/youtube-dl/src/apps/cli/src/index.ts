import { Command } from 'commander';

import { download } from './commands/download';

const program = new Command();

program.command('listen').action(async () => {
  console.log('listen');
});

program
  .command('* <url...>')
  .action(async (urls) => {
    console.log('download', urls)
    //await download(urls);
  });

program.parseAsync();
