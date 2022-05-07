const rePercent = /^[0-9]+%$/;

export const parsePercent = (percent: string): number => {
  if (!rePercent.test(percent)) {
    throw new Error(`String is not a valid percent. Got "${percent}"`);
  }

  const percentNumber = Number(percent.slice(0, -1));
  const multiplier = percentNumber / 100;

  return multiplier;
}
