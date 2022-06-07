import fs from 'fs-extra';

import { UnknownObject } from '@zougui/common.type-utils';

export const readJsonObjectSync = (filePath: string): ReadJsonObjectResult => {
  if (!fs.pathExistsSync(filePath)) {
    return { object: {}, exists: false };
  }

  const json = fs.readJsonSync(filePath);

  if (typeof json !== 'object' || !json) {
    throw new Error(`Config at path "${filePath}" must be an object. Got: ${json}`);
  }

  return { object: json, exists: true };
}

export interface ReadJsonObjectResult {
  object: UnknownObject;
  exists: boolean;
}
