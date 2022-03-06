import type { BaseSchema } from 'yup';
import type { Maybe } from 'yup/lib/types';
import type { MixedSchema } from 'yup/lib/mixed';
import { mixed } from 'yup';

// Two
export function union<
	T1,
	T2,
	TCast1 extends Maybe<T1>,
	TCast2 extends Maybe<T2>,
	C1,
	C2,
	O1 extends T1,
	O2 extends T2
>(
	...schemas: [BaseSchema<TCast1, C1, O1>, BaseSchema<TCast2, C2, O2>]
): MixedSchema<TCast1 | TCast2, C1 | C2, O1 | O2>;

// Three
export function union<
	T1,
	T2,
	T3,
	TCast1 extends Maybe<T1>,
	TCast2 extends Maybe<T2>,
	TCast3 extends Maybe<T3>,
	C1,
	C2,
	C3,
	O1 extends T1,
	O2 extends T2,
	O3 extends T3
>(
	...schemas: [BaseSchema<TCast1, C1, O1>, BaseSchema<TCast2, C2, O2>, BaseSchema<TCast3, C3, O3>]
): MixedSchema<TCast1 | TCast2 | TCast3, C1 | C2 | C3, O1 | O2 | O3>;

// Mix them all together
export function union<TCast extends Maybe<unknown>, C, O>(
	...schemas: Array<BaseSchema<TCast, C, O>>
): MixedSchema<TCast, C, O> {
	return mixed().test({
		name: 'union',
		// eslint-disable-next-line no-template-curly-in-string
		message: 'value did not match any schema: ${value}',
    test(value) {
			// The real magic
			return schemas.some(s => s.isValidSync(value));
		},
	}) as MixedSchema<TCast, C, O>;
}
