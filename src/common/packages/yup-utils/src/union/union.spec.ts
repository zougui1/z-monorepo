import * as yup from 'yup';

import { union } from './union';

describe('union()', () => {
  describe('when the schema is number or boolean', () => {
    const schema = union(yup.number(), yup.boolean());

    describe('when in strict mode', () => {
      const options = {
        strict: true,
      };

      it('should be invalid when the value is a string', async () => {
        const value = 'my string';

        const result = await schema.isValid(value, options);

        expect(result).toBe(false);
      });

      it('should be valid when the value is a number', async () => {
        const value = 45;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });

      it('should be valid when the value is a boolean', async () => {
        const value = false;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });

      it('should be valid when the value is undefined', async () => {
        const value = undefined;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });
    });

    describe('when not in strict mode', () => {
      const options = {
        strict: false,
      };

      it('should be invalid when the value is a string', async () => {
        const value = 'my string';

        const result = await schema.isValid(value, options);

        expect(result).toBe(false);
      });

      it('should be valid when the value is a number', async () => {
        const value = 45;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });

      it('should be valid when the value is a boolean', async () => {
        const value = false;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });

      it('should be valid when the value is undefined', async () => {
        const value = undefined;

        const result = await schema.isValid(value, options);

        expect(result).toBe(true);
      });
    });

    describe('when value is required', () => {
      const requiredSchema = schema.required();

      it('should be invalid when the value is a string', async () => {
        const value = 'my string';

        const result = await requiredSchema.isValid(value);

        expect(result).toBe(false);
      });

      it('should be invalid when the value is undefined', async () => {
        const value = undefined;

        const result = await requiredSchema.isValid(value);

        expect(result).toBe(false);
      });

      it('should be valid when the value is a number', async () => {
        const value = 45;

        const result = await requiredSchema.isValid(value);

        expect(result).toBe(true);
      });

      it('should be valid when the value is a boolean', async () => {
        const value = false;

        const result = await requiredSchema.isValid(value);

        expect(result).toBe(true);
      });
    });
  });
});
