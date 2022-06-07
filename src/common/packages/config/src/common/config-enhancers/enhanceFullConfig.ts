import type { UnknownObject } from '@zougui/common.type-utils';

import { parseVariableReferences } from './parseVariableReferences';
import { stripEnvFields } from './stripEnvFields';
import { removePrivateFields } from './removePrivateFields';
import { protectFields } from './protectFields';
import { validatePrivateConfig } from '../config-validators';

export const enhanceFullConfig = (fullConfig: UnknownObject, options?: EnhanceFullConfigOptions | undefined): UnknownObject => {
  const configWithVariableReferences = parseVariableReferences(fullConfig);
  const validFullConfig = validatePrivateConfig(configWithVariableReferences);

  const strippedEnvConfig = stripEnvFields(validFullConfig, options);

  const configWithoutPrivateFields = removePrivateFields(strippedEnvConfig);
  const protectedConfig = options?.protect ?? true
    ? protectFields(configWithoutPrivateFields)
    : configWithoutPrivateFields;

  return protectedConfig;
}

export interface EnhanceFullConfigOptions {
  /**
   *  @default true
   */
  protect?: boolean | undefined;
  allowedEnv?: string | undefined;
}
