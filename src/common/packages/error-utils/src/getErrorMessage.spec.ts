import { getErrorMessage } from './getErrorMessage';

describe('getErrorMessage()', () => {
  describe('when no default message is provided', () => {
    it('should return undefined when the value is null', () => {
      const value = null;

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(undefined);
    });

    it('should return undefined when the value is not an object', () => {
      const value = 69;

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(undefined);
    });

    it('should return undefined when the value is an object but does not have a property "message"', () => {
      const value = { msg: 'some message' };

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(undefined);
    });

    it('should return undefined when the value is an object and has a property "message" that is not a string', () => {
      const value = { message: true };

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(undefined);
    });

    it('should return the message when the value is an object and has a property "message" that is a string', () => {
      const value = { message: 'some message' };

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(value.message);
    });

    it('should return the value as is if it is a string', () => {
      const value = 'some message';

      const errorMessage = getErrorMessage(value);

      expect(errorMessage).toBe(value);
    });
  });

  describe('when a default message is provided', () => {
    it('should return the default message when the value is null', () => {
      const value = null;
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(defaultMessage);
    });

    it('should return the default message when the value is not an object', () => {
      const value = 69;
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(defaultMessage);
    });

    it('should return the default message when the value is an object but does not have a property "message"', () => {
      const value = { msg: 'some message' };
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(defaultMessage);
    });

    it('should return the default message when the value is an object and has a property "message" that is not a string', () => {
      const value = { message: true };
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(defaultMessage);
    });

    it('should return the message when the value is an object and has a property "message" that is a string', () => {
      const value = { message: 'some message' };
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(value.message);
    });

    it('should return the value as is if it is a string', () => {
      const value = 'some message';
      const defaultMessage = 'An error occurred';

      const errorMessage = getErrorMessage(value, defaultMessage);

      expect(errorMessage).toBe(value);
    });
  });
});
