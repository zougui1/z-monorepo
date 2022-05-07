export const indent = (text: string): string => {
  const indentedText = text.split('\n').map(line => `  ${line}`).join('\n');
  return indentedText;
}
