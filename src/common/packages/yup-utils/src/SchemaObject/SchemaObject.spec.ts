import * as yup from 'yup';

import { SchemaObject } from './SchemaObject';

describe('new SchemaObject()', () => {
  describe('when no schema is provided', () => {
    const schema = undefined;

    describe('when the value is an empty object', () => {
      const value = {};

      describe('isValidSync()', () => {
        it('should return true', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.isValidSync();

          expect(result).toBe(true);
        });
      });

      describe('isValid()', () => {
        it('should return true', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.isValid();

          expect(result).toBe(true);
        });
      });

      describe('validateSync()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.validateSync();

          expect(result).toEqual({});
        });
      });

      describe('validate()', () => {
        it('should return an empty object', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.validate();

          expect(result).toEqual({});
        });
      });

      describe('cast()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.cast();

          expect(result).toEqual({});
        });
      });

      describe('getValues()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValues();

          expect(result).toEqual({});
        });
      });

      describe('getValidValuesSync()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValidValuesSync();

          expect(result).toEqual({});
        });
      });

      describe('getValidValues()', () => {
        it('should return an empty object', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.getValidValues();

          expect(result).toEqual({});
        });
      });
    });

    describe('when the value is an object with properties', () => {
      const value = {
        some: 'value',
      };

      describe('isValidSync()', () => {
        it('should return true', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.isValidSync();

          expect(result).toBe(true);
        });
      });

      describe('isValid()', () => {
        it('should return true', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.isValid();

          expect(result).toBe(true);
        });
      });

      describe('validateSync()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.validateSync();

          expect(result).toEqual({ some: 'value' });
        });
      });

      describe('validate()', () => {
        it('should return an empty object', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.validate();

          expect(result).toEqual({ some: 'value' });
        });
      });

      describe('cast()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.cast();

          expect(result).toEqual({ some: 'value' });
        });
      });

      describe('getValues()', () => {
        it('should return the value object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValues();

          expect(result).toEqual(value);
        });
      });

      describe('getValidValuesSync()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValidValuesSync();

          expect(result).toEqual({ some: 'value' });
        });
      });

      describe('getValidValues()', () => {
        it('should return an empty object', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.getValidValues();

          expect(result).toEqual({ some: 'value' });
        });
      });
    });
  });

  describe('when a schema is provided', () => {
    const schema = yup.object({
      some: yup.string(),
      requiredString: yup.string().required(),
    });

    describe('when the value is an empty object', () => {
      const value = {} as any;

      describe('isValidSync()', () => {
        it('should return false', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.isValidSync();

          expect(result).toBe(false);
        });
      });

      describe('isValid()', () => {
        it('should return false', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.isValid();

          expect(result).toBe(false);
        });
      });

      describe('validateSync()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.validateSync();

          expect(result).toThrowError();
        });
      });

      describe('validate()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.validate();

          expect(result).rejects.toThrowError();
        });
      });

      describe('cast()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.cast();

          expect(result).toEqual({});
        });
      });

      describe('getValues()', () => {
        it('should return an empty object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValues();

          expect(result).toEqual({});
        });
      });

      describe('getValidValuesSync()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.getValidValuesSync();

          expect(result).toThrowError();
        });
      });

      describe('getValidValues()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.getValidValues();

          expect(result).rejects.toThrowError();
        });
      });
    });

    describe('when the value is valid', () => {
      const value = {
        some: undefined,
        requiredString: 'my string',
      };

      describe('isValidSync()', () => {
        it('should return true', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.isValidSync();

          expect(result).toBe(true);
        });
      });

      describe('isValid()', () => {
        it('should return true', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.isValid();

          expect(result).toBe(true);
        });
      });

      describe('validateSync()', () => {
        it('should return the value', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.validateSync();

          expect(result).toEqual(value);
        });
      });

      describe('validate()', () => {
        it('should return the value', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.validate();

          expect(result).toEqual(value);
        });
      });

      describe('cast()', () => {
        it('should return the value', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.cast();

          expect(result).toEqual(value);
        });
      });

      describe('getValues()', () => {
        it('should return the value object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValues();

          expect(result).toEqual(value);
        });
      });

      describe('getValidValuesSync()', () => {
        it('should return the value', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValidValuesSync();

          expect(result).toEqual(value);
        });
      });

      describe('getValidValues()', () => {
        it('should return the value', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.getValidValues();

          expect(result).toEqual(value);
        });
      });
    });

    describe('when the value is invalid', () => {
      const value = {
        some: 45,
        requiredString: undefined,
      } as any;
      const validValue = {
        some: 'some value',
        requiredString: 'my string',
      };

      describe('isValidSync()', () => {
        it('should return false', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.isValidSync();

          expect(result).toBe(false);
        });

        describe('using setValue()', () => {
          it('should return true', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = schemaObject.isValidSync();

            expect(result).toBe(true);
          });
        });

        describe('using setValues()', () => {
          it('should return true', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = schemaObject.isValidSync();

            expect(result).toBe(true);
          });
        });
      });

      describe('isValid()', () => {
        it('should return false', async () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = await schemaObject.isValid();

          expect(result).toBe(false);
        });

        describe('using setValue()', () => {
          it('should return true', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = await schemaObject.isValid();

            expect(result).toBe(true);
          });
        });

        describe('using setValues()', () => {
          it('should return true', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = await schemaObject.isValid();

            expect(result).toBe(true);
          });
        });
      });

      describe('validateSync()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.validateSync();

          expect(result).toThrowError();
        });

        describe('using setValue()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = schemaObject.validateSync();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = schemaObject.validateSync();

            expect(result).toEqual(validValue);
          });
        });
      });

      describe('validate()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.validate();

          expect(result).rejects.toThrowError();
        });

        describe('using setValue()', () => {
          it('should return the valid value', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = await schemaObject.validate();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = await schemaObject.validate();

            expect(result).toEqual(validValue);
          });
        });
      });

      describe('cast()', () => {
        it('should return the value casted', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.cast();

          expect(result).toEqual({
            some: '45',
          });
        });

        describe('using setValue()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = schemaObject.cast();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = schemaObject.cast();

            expect(result).toEqual(validValue);
          });
        });
      });

      describe('getValues()', () => {
        it('should return the value object', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = schemaObject.getValues();

          expect(result).toEqual(value);
        });

        describe('using setValue()', () => {
          it('should return the valid value object', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = schemaObject.getValues();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value object', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = schemaObject.getValues();

            expect(result).toEqual(validValue);
          });
        });
      });

      describe('getValidValuesSync()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.getValidValuesSync();

          expect(result).toThrowError();
        });

        describe('using setValue()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = schemaObject.getValidValuesSync();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value', () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = schemaObject.getValidValuesSync();

            expect(result).toEqual(validValue);
          });
        });
      });

      describe('getValidValues()', () => {
        it('should throw an error', () => {
          const schemaObject = new SchemaObject(value, schema);

          const result = () => schemaObject.getValidValues();

          expect(result).rejects.toThrowError();
        });

        describe('using setValue()', () => {
          it('should return the valid value', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValue('some', validValue.some);
            schemaObject.setValue('requiredString', validValue.requiredString);

            const result = await schemaObject.getValidValues();

            expect(result).toEqual(validValue);
          });
        });

        describe('using setValues()', () => {
          it('should return the valid value', async () => {
            const schemaObject = new SchemaObject(value, schema);
            schemaObject.setValues(validValue);

            const result = await schemaObject.getValidValues();

            expect(result).toEqual(validValue);
          });
        });
      });
    });
  });
});
