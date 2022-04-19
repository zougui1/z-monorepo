const wait = (timeout: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export const waitFor = async (condition: (() => any)): Promise<void> => {
  while (!condition()) {
    await wait(500);
  }
}
