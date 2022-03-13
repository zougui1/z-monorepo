import prettyMs from 'pretty-ms';

import { getNow, getRelativeTime, NowObject } from './utils';

export class Stopwatch<TLabels extends string = string> {

  //#region properties
  private starts: Record<string, NowObject> = {};
  public timings: Record<string, number> = {};
  //#endregion

  //#region methods
  start<TLabel2 extends string = string>(...labels: (TLabels | TLabel2)[]): Stopwatch<TLabels & TLabel2> {
    const now = getNow();

    for (const label of labels) {
      this.starts[label] = now;
    }

    return this;
  }

  stop(...labels: TLabels[]): this {
    const formattedTimings = Object
      .entries<NowObject>(this.starts as Record<TLabels, NowObject>)
      .filter(([label]) => !labels || labels.includes(label as TLabels))
      .reduce((timings, [label, timing]) => {
        this.timings[label] = getRelativeTime(timing);
        return timings;
      }, this.timings);

    this.timings = formattedTimings;

    return this;
  }

  getTimings(options?: { raw?: false }): Record<TLabels, string>;
  getTimings(options: { raw: true }): Record<TLabels, number>;
  getTimings(options?: { raw?: boolean }): Record<TLabels, string | number>;
  getTimings(options?: { raw?: boolean }): Record<TLabels, string | number> {
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
