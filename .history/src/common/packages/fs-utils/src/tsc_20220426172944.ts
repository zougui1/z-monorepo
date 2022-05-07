import { spawn } from 'child_process';

(async () => {
  /*const dir = '/mnt/Dev/Code/javascript/zougui/src/common/packages/fs-utils';
  const childProcess = spawn('tsc', ['--project', dir], {
    stdio: 'pipe',
  });

  childProcess.stdout?.on('data', (message) => {
    console.log('stdout')
    console.log(String(message));
  });

  childProcess.stderr?.on('data', (message) => {
    console.error(String(message));
  });*/
  const childProcess = spawn('npm', ['run', 'compile:watch'], {
    stdio: 'inherit',
  });
})();
