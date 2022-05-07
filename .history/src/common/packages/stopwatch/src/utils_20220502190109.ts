import env from '@zougui/common.env';

export const getNow = (): NowObject => {
  if (env.isBrowser) {
    const now = performance.now();

    return {
      now,
      hrtime: [0, 0],
    };
  }

  const now = process.hrtime();

  return {
    now: getMilliseconds(now),
    hrtime: now,
  };
}

export const getRelativeTime = (start: NowObject): number => {
  return env.isBrowser
    ? performance.now() - start.now
    : getMilliseconds(process.hrtime(start.hrtime));
}

const getMilliseconds = ([seconds, nanoseconds]: [number, number]): number => {
  return (seconds * 1000) + (nanoseconds / 1e+6);
}

export interface NowObject {
  now: number;
  hrtime: [number, number];
}
