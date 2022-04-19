import { isErrorMessageObject } from './isErrorMessageObject';

describe('isErrorMessageObject()', () => {
  it('should return false when the value is null', () => {
    const value = null;

    const isMsgObject = isErrorMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return false when the value is not an object', () => {
    const value = 'my string';

    const isMsgObject = isErrorMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return false when the value is an object but does not have a property "message"', () => {
    const value = { msg: 'some message' };

    const isMsgObject = isErrorMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return false when the value is an object and has a property "message" that is not a string', () => {
    const value = { message: true };

    const isMsgObject = isErrorMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return true when the value is an object and has a property "message" that is a string', () => {
    const value = { message: 'some message' };

    const isMsgObject = isErrorMessageObject(value);

    expect(isMsgObject).toBe(true);
  });
});
