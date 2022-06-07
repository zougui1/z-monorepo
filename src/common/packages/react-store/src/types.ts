import { SliceCaseReducers, PayloadActionCreator, ActionCreatorWithoutPayload, CaseReducerActions, Slice } from '@reduxjs/toolkit';

import { OverridenActions } from './utils';

export type ActionCreatorForCaseReducer<CR> = CR extends (state: any, action: infer Action) => any ? Action extends {
  payload: infer P;
} ? PayloadActionCreator<P> : ActionCreatorWithoutPayload : ActionCreatorWithoutPayload;

export type CaseReducerActionsForDispatch<CaseReducers extends SliceCaseReducers<any>> = {
  [Type in keyof CaseReducers]: CaseReducers[Type] extends {
      prepare: any;
  } ? never : ActionCreatorForCaseReducer<CaseReducers[Type]>;
};

export type SliceContextDispatch<
  State = any,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
  Actions extends CaseReducerActionsForDispatch<CaseReducers> = CaseReducerActionsForDispatch<CaseReducers>,
> = (action: ReturnType<Actions[keyof Actions]>) => void;

export interface InternalSliceState<
  State extends Record<string, any> = Record<string, any>,
  CaseReducers extends SliceCaseReducers<State> = SliceCaseReducers<State>,
> {
  actions: OverridenActions<Slice<State, CaseReducers>>;
  dispatch: SliceContextDispatch<State, CaseReducers>;
  getState: () => State;
  subscribe: (listener: () => void) => (() => void);
}
