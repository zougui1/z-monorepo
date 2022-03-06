export const removeEscapes = (str: string): string => {
  return  str
    .replace(/\\/g, '')
    .replace(/'/g, '')
    .replace(/\f/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\t/g, '')
    .replace(/\v/g, '')
    .replace(/\0/g, '');
}
