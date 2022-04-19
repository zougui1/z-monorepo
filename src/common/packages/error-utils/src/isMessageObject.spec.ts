import { isMessageObject } from './isMessageObject';

describe('isMessageObject()', () => {
  it('should return false when the value is null', () => {
    const value = null;

    const isMsgObject = isMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return false when the value is not an object', () => {
    const value = 'my string';

    const isMsgObject = isMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return false when the value is an object but does not have a property "message"', () => {
    const value = { msg: 'some message' };

    const isMsgObject = isMessageObject(value);

    expect(isMsgObject).toBe(false);
  });

  it('should return true when the value is an object and has a property "message"', () => {
    const value = { message: 'some message' };

    const isMsgObject = isMessageObject(value);

    expect(isMsgObject).toBe(true);
  });
});
