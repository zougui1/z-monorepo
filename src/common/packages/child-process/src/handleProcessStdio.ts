import { Readable, Writable } from 'node:stream';

import { SpawnStdio } from './SpawnStdio';

export const handleProcessStdio = (source: SourceStdio, dest: DestStdio, type: SpawnStdio): void => {
  switch (type) {
    case SpawnStdio.inherit:
      source.stdout.pipe(dest.stdout);
      source.stderr.pipe(dest.stderr);
      dest.stdin.pipe(source.stdin);
      break;

    case SpawnStdio.inheritInput:
      dest.stdin.pipe(source.stdin);
      break;

    case SpawnStdio.inheritOutput:
      source.stdout.pipe(dest.stdout);
      source.stderr.pipe(dest.stderr);
      break;
  }
}

export type SourceStdio = {
  stdout: Readable;
  stderr: Readable;
  stdin: Writable;
}

export type DestStdio = {
  stdout: Writable;
  stderr: Writable;
  stdin: Readable;
}
