import isBrower from 'is-browser';

export const getNow = (): NowObject => {
  if (isBrower) {
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
  return isBrower
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
