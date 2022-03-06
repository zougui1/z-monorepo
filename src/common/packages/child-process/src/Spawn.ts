import {
  spawn,
  SpawnOptions as ChildProcessSpawnOptions,
  ChildProcessWithoutNullStreams,
} from 'node:child_process';
import { EventEmitter } from 'node:events';

import { DurationString } from '@zougui/common.ms';

import { processSpawnOptions } from './processSpawnOptions';
import { handleProcessStdio } from './handleProcessStdio';
import { SpawnStdio } from './SpawnStdio';

export class Spawn implements Promise<SpawnResult> {
  [Symbol.toStringTag]: '[object Spawn]';
  #command: string;
  #args: readonly string[];
  #frozenArgs: readonly string[];
  #options: Readonly<InternalSpawnOptions>;
  #frozenOptions: Readonly<InternalSpawnOptions>;
  #process: ChildProcessWithoutNullStreams | undefined;
  #status: SpawnStatus = SpawnStatus.idle;
  #emitter: EventEmitter = new EventEmitter();
  #restarted: number = 0;
  #startTimeout: NodeJS.Timeout | undefined;
  #restartTimeout: NodeJS.Timeout | undefined;
  #startTime: Date | undefined;
  /**
   * data received from the process' stdout
   */
  #data: string[] = [];

  //#region getters
  get command(): string {
    return this.#command;
  }

  get args(): ReadonlyArray<string> {
    return this.#frozenArgs;
  }

  get options(): Readonly<InternalSpawnOptions> {
    return this.#frozenOptions;
  }

  get process(): Readonly<ChildProcessWithoutNullStreams> | undefined {
    return this.#process;
  }

  get pid(): number | undefined {
    return this.#process?.pid;
  }

  get status(): SpawnStatus {
    return this.#status;
  }

  /**
   * data received from the process' stdout
   */
  get data(): readonly string[] {
    return this.#data;
  }

  get uptime(): number {
    if(!this.#startTime) {
      return 0;
    }

    return Date.now() - this.#startTime.valueOf();
  }
  //#endregion

  constructor(command: string, options?: SpawnOptions) {
    this.#command = command;
    this.#options = processSpawnOptions(options);
    this.#args = this.#options.args;

    this.#frozenArgs = Object.freeze(this.#args);
    this.#frozenOptions = Object.freeze(this.#options);
  }

  //#region process life methods
  start = (): ChildProcessWithoutNullStreams => {
    this.#cleanup();
    return this.#start();
  }

  restart = (): ChildProcessWithoutNullStreams => {
    this.stop();
    return this.start();
  }

  stop = (signal?: number | NodeJS.Signals | undefined): this => {
    this.#status = SpawnStatus.stopping;
    this.#cancelRestart();
    if (this.#startTimeout !== undefined) clearTimeout(this.#startTimeout);
    this.#process?.kill(signal);
    this.#process?.off('error', this.#handleSpawnError);
    this.#process?.stderr.off('data', this.#handleProcessError);
    this.#data = [];
    this.#process = undefined;
    this.#status = SpawnStatus.idle;

    return this;
  }

  //#region internal methods
  #start = (): ChildProcessWithoutNullStreams => {
    this.#status = SpawnStatus.starting;
    this.#cancelRestart();

    this.#process = spawn(this.#command, this.#args, {
      ...this.#options,
      stdio: 'pipe',
    });

    handleProcessStdio(this.#process, process, this.#options.stdio);

    this.#process.on('exit', (code, signal) => {
      // get the reference to the data before it is
      // cleared by `this.stop`
      const data = this.#data;
      this.stop();
      this.#emit('exit', { data, code, signal });
    });
    this.#process.stdout.on('data', (chunk: Buffer) => {
      this.#emit('stdout:data', chunk);
      this.#data.push(String(chunk));
    });
    this.#process.on('error', this.#handleSpawnError);
    this.#process.stderr.on('data', this.#handleProcessError);

    this.#process.on('spawn', () => {
      this.#status = SpawnStatus.running;
      this.#startTime = new Date();

      this.#startTimeout = setTimeout(() => {
        this.#restarted = 0;
      }, this.#options.minUptime);
    });

    return this.#process;
  }

  #restart = (): ChildProcessWithoutNullStreams => {
    this.stop();
    return this.#start();
  }

  #cleanup = () => {
    this.#restarted = 0;
  }
  //#endregion
  //#endregion

  //#region error handling methods
  #handleSpawnError = (error: Error): void => {
    this.#status = SpawnStatus.spawnError;
    this.#handleError(error);
    this.#emit('spawn-error', error);
  }

  #handleProcessError = (error: any): void => {
    const err = new Error(String(error));

    this.#status = SpawnStatus.processError;
    this.#handleError(err);
    this.#emit('process-error', err);
  }

  #handleError = (error: Error): void => {
    this.#startTimeout && clearTimeout(this.#startTimeout);

    if (this.options.maxRestarts > this.#restarted) {
      this.#restarted++;
      this.#status = SpawnStatus.awaitingRestart;

      this.#restartTimeout = setTimeout(() => {
        this.#restart();
      }, this.#options.restartDelay);
    }

    // emit an error only when listening for them
    // otherwise we don't as it will crash the main process
    if (this.#emitter.listeners('error').length > 0) {
      this.#emit('error', error);
    }

    if (!this.isAwaitingRestart()) {
      this.stop();
    }
  }
  //#endregion

  //#region internal promise handlers
  exec = (): Promise<SpawnResult> => {
    if (!this.isRunning()) {
      this.start();
    }

    return new Promise<SpawnResult>((resolve, reject) => {
      this.once('exit', resolve);
      this.on('error', error => {
        if (!this.isAwaitingRestart()) {
          reject(error);
        }
      });
    });
  }

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onResolved The callback to execute when the Promise is resolved.
   * @param onRejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then = <TResult = SpawnResult, TResult2 = never>(
    onResolved?: ((value: SpawnResult) => TResult | PromiseLike<TResult>) | undefined | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult | TResult2> => {
    return this.exec().then(onResolved, onRejected);
  }

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onRejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onRejected: ((reason: unknown) => TResult | PromiseLike<TResult>)): Promise<SpawnResult | TResult> {
    return this.exec().catch(onRejected);
  }

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onFinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onFinally?: (() => void) | undefined | null): Promise<SpawnResult> {
    return this.exec().finally(onFinally);
  }
  //#endregion

  //#region status methods
  isIdle = (): boolean => {
    return this.#status === SpawnStatus.idle;
  }

  isStarting = (): boolean => {
    return this.#status === SpawnStatus.starting;
  }

  isRunning = (): boolean => {
    return this.#status === SpawnStatus.running;
  }

  isStopping = (): boolean => {
    return this.#status === SpawnStatus.stopping;
  }

  isAwaitingRestart = (): boolean => {
    return this.#status === SpawnStatus.awaitingRestart;
  }

  isSpawnError = (): boolean => {
    return this.#status === SpawnStatus.spawnError;
  }

  isProcessError = (): boolean => {
    return this.#status === SpawnStatus.processError;
  }

  isError = (): boolean => {
    return this.isSpawnError() || this.isProcessError();
  }
  //#endregion

  //#region event emitter methods
  on(event: 'stdout:data', listener: ((data: Buffer) => void)): this;
  on(event: 'exit', listener: ((data: SpawnResult) => void)): this;
  on(event: 'error', listener: ((error: Error) => void)): this;
  on(event: 'spawn-error', listener: ((error: Error) => void)): this;
  on(event: 'process-error', listener: ((error: Error) => void)): this;
  on(event: string, listener: ((data: any) => void)): this {
    this.#emitter.on(event, listener);
    return this;
  }

  once(event: 'stdout:data', listener: ((data: Buffer) => void)): this;
  once(event: 'exit', listener: ((data: SpawnResult) => void)): this;
  once(event: 'error', listener: ((error: Error) => void)): this;
  once(event: 'spawn-error', listener: ((error: Error) => void)): this;
  once(event: 'process-error', listener: ((error: Error) => void)): this;
  once(event: string, listener: ((data: any) => void)): this {
    this.#emitter.once(event, listener);
    return this;
  }

  off(event: 'stdout:data', listener: ((data: Buffer) => void)): this;
  off(event: 'exit', listener: ((data: SpawnResult) => void)): this;
  off(event: 'error', listener: ((error: Error) => void)): this;
  off(event: 'spawn-error', listener: ((error: Error) => void)): this;
  off(event: 'process-error', listener: ((error: Error) => void)): this;
  off(event: string, listener: ((data: any) => void)): this {
    this.#emitter.off(event, listener);
    return this;
  }

  removeAllListeners = (event?: string): this => {
    this.#emitter.removeAllListeners(event);
    return this;
  }

  #emit(event: 'stdout:data', data: Buffer): void;
  #emit(event: 'exit', data: SpawnResult): void;
  #emit(event: 'error', error: Error): void;
  #emit(event: 'spawn-error', error: Error): void;
  #emit(event: 'process-error', error: Error): void;
  #emit(event: string, data: any): void {
    this.#emitter.emit(event, data);
  }
  //#endregion

  //#region private methods
  #cancelRestart = (): void => {
    this.#restartTimeout && clearTimeout(this.#restartTimeout);
  }
  //#endregion
}

export enum SpawnStatus {
  idle = 'idle',
  starting = 'starting',
  running = 'running',
  stopping = 'stopping',
  awaitingRestart = 'awaitingRestart',
  spawnError = 'spawnError',
  processError = 'processError',
}

export interface SpawnOptions extends Omit<ChildProcessSpawnOptions, 'stdio'> {
  args?: readonly string[];
  flags?: Record<string, string | number | boolean>;
  stdio?: 'ignore' | 'pipe' | 'inherit' | 'inherit-output' | 'inherit-input';
  stopOnError?: boolean;
  restartDelay?: DurationString | number;
  maxRestarts?: number;
  minUptime?: DurationString | number;
}

export interface InternalSpawnOptions extends Omit<ChildProcessSpawnOptions, 'stdio'> {
  args: readonly string[];
  stdio: SpawnStdio;
  stopOnError?: boolean;
  restartDelay: number;
  maxRestarts: number;
  minUptime: number;
}

export type SpawnResult = {
  data: readonly string[];
  code: number | null;
  signal: NodeJS.Signals | null;
}
