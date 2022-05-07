import { spawn } from 'child_process';

(async () => {
  const dir = '/mnt/Dev/Code/javascript/zougui/src/common/packages/fs-utils';
  const childProcess = spawn('tsc', ['--project', dir], {
    stdio: 'inherit',
  });

  childProcess.stdout?.on('data', (message) => {
    console.log(String(message));
  });

  childProcess.stderr?.on('data', (message) => {
    console.error(String(message));
  });
})();
