import chalk from 'chalk';

import { Spawn } from '@zougui/common.child-process';

import { MUSIC_OUTPUT } from '../../constants';

const rePercentage = /[0-9]+(\.[0-9]+)?%/;

export const downloadOneMusic = async (url: string): Promise<{ success: boolean }> => {
  console.group('URL:', url);

  const success = await downloadMusic(url)
    .then(() => {
      console.log(chalk.green('downloaded'));
      return true;
    })
    .catch(() => {
      console.log(chalk.red('failed to download'));
      return false;
    });

  console.groupEnd();

  return { success };
}

const downloadMusic = async (url: string): Promise<void> => {
  const youtubeDonwload = new Spawn(`youtube-dl`, {
    stdio: 'pipe',
    args: [url],
    flags: {
      extractAudio: true,
      audioFormat: 'mp3',
      audioQuality: 0,
      embedThumbnail: true,
      addMetadata: true,
      output: MUSIC_OUTPUT,
    },
  });

  let downloading = false;

  youtubeDonwload.on('stdout:data', data => {
    // there can be multiple messages sent into one message
    const messages = String(data)
      .replace(/\r/g, '')
      .split('\n')
      .filter(Boolean)
      .flatMap(line => {
        if (!line.includes('[download]')) {
          return line;
        }

        return line
          .split('[download]')
          .filter(Boolean)
          .map(line => `[download]${line}`);
      });

    for (const message of messages) {
      if (message.startsWith('[download]')) {
        console.log(message);

        if (!downloading) {
          downloading = rePercentage.test(message);
        }

        if (downloading) {
          process.stdout.clearLine(-1);
          process.stdout.moveCursor(0, -1);
          process.stdout.cursorTo(0);
        }
      } else {
        console.log(message);
      }
    }
  });

  await youtubeDonwload.exec();
  // final empty line
  console.log();
}
