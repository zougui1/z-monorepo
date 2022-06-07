import * as yup from 'yup';
import validator from 'validator';
import _ from 'lodash';
import type { CamelCasedProperties } from 'type-fest';

import { snakeCaseProperties } from '@zougui/common.object-utils';
import type { AnyObject } from '@zougui/common.type-utils';

export function url(
  options?: CamelCasedProperties<validator.IsURLOptions>,
): yup.StringSchema<string | undefined, AnyObject, string | undefined> {
  const snakeCaseOptions = snakeCaseProperties(options || {});

	return yup.string().test({
		name: 'url',
		message: 'this must be a valid URL',
    test(value) {
      if (value === undefined) {
        return true;
      }

			return validator.isURL(value, snakeCaseOptions);
		},
	});
}
