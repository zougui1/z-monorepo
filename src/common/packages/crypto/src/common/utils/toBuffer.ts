export const toBuffer = (value: string | Buffer): Buffer => {
  return value instanceof Buffer ? value : Buffer.from(value);
}
