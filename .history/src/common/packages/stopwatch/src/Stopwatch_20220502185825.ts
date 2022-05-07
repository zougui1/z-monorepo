import prettyMs from 'pretty-ms';

import { getNow, getRelativeTime, NowObject } from './utils';

export class Stopwatch {

  //#region properties
  private _start: NowObject | undefined;
  private _current: NowObject | undefined;
  public timings: Record<string, number> = {};
  //#endregion

  //#region methods
  start(): this {
    this._start = this._current = getNow();
    return this;
  }

  lap(label: string): this {
    if (!this._current) {
      throw new Error('The stopwatch can only lap when running.');
    }

    const hrtime = getRelativeTime(this._current);
    this._current = getNow();
    this.timings[label] = hrtime;

    return this;
  }

  stop(options?: { raw?: false }): Record<string, string>;
  stop(options: { raw: true }): Record<string, number>;
  stop(options?: { raw?: boolean }): Record<string, string | number> {
    if (!this._start) {
      throw new Error('The stopwatch can only stop when running.');
    }

    this.timings.total = getRelativeTime(this._start);

    if (options?.raw) {
      return this.timings;
    }

    const formattedTimings = Object.entries(this.timings).reduce((timings, [key, timing]) => {
      timings[key] = prettyMs(timing);
      return timings;
    }, {} as Record<string, string>);

    return formattedTimings;
  }
  //#endregion
}
