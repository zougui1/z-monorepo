//import prettyMs from 'pretty-ms';

import { Stopwatch } from './Stopwatch';

describe('new Stopwatch()', () => {

  let hrtime: jest.SpyInstance<[number, number], [time?: [number, number]]>;

  beforeEach(() => {
    hrtime = jest.spyOn(process, 'hrtime');
  });

  afterEach(() => {
    hrtime.mockRestore();
  });

  it('should correctly start, lap and stop', () => {
    const stopwatch = new Stopwatch();

    hrtime.mockReturnValue([2, 45]);
    stopwatch.start();
    hrtime.mockReturnValue([3, 65]);
    stopwatch.lap('myLabel');
    hrtime.mockReturnValue([3, 75]);
    stopwatch.lap('mySecondLabel');
    hrtime.mockReturnValue([42, 69]);
    const timings = stopwatch.stop();

    expect(timings).toEqual({
      myLabel: '3s',
      mySecondLabel: '3s',
      total: '42s',
    });
  });

  it('should throw an error when calling lap before starting it', () => {
    const stopwatch = new Stopwatch();
    expect(() => stopwatch.lap('myLabel')).toThrowError();
  });

  it('should throw an error when calling stop before starting it', () => {
    const stopwatch = new Stopwatch();
    expect(() => stopwatch.stop()).toThrowError();
  });
});
