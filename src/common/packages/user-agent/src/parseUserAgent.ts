import { UAParser, IResult } from 'ua-parser-js';

export const parseUserAgent = (userAgentString: string): IResult => {
  const parser = new UAParser(userAgentString);
  return parser.getResult();
}
