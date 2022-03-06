import { createAction } from '@reduxjs/toolkit';

import { createAutoDispatchedActions } from './createAutoDispatchedActions';

describe('createAutoDispatchedActions()', () => {
  it('should return an object', () => {
    const actions = {
      myAction: createAction('someAction'),
    };
    const dispatch = jest.fn();

    const dispatchedActions = createAutoDispatchedActions(actions, dispatch);

    expect(dispatchedActions).toMatchObject({
      myAction: expect.any(Function),
    });
  });

  it('should not call the dispatch function if none of the actions are called', () => {
    const actions = {
      myAction: createAction('someAction'),
    };
    const dispatch = jest.fn();

    createAutoDispatchedActions(actions, dispatch);

    expect(dispatch).not.toBeCalled();
  });

  it('should call the dispatch function with the result of the action called without payload', () => {
    const actions = {
      myAction: createAction('someAction'),
    };
    const dispatch = jest.fn();

    const dispatchedActions = createAutoDispatchedActions(actions, dispatch);

    dispatchedActions.myAction();

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith({
      type: actions.myAction.type,
    });
  });

  it('should call the dispatch function with the result of the action called with a payload', () => {
    const actions = {
      myAction: createAction<string>('someAction'),
    };
    const dispatch = jest.fn();

    const dispatchedActions = createAutoDispatchedActions(actions, dispatch);

    const payload = 'my payload';
    dispatchedActions.myAction(payload);

    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith({
      type: actions.myAction.type,
      payload,
    });
  });
});
