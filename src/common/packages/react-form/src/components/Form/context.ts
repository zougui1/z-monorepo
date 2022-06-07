import type { UseFormRegisterReturn, UseFormRegister, FormState as ReactFormState, Control } from 'react-hook-form';
import * as yup from 'yup';
import type { AnyObjectSchema, InferType } from 'yup';

import { createSliceContext, PayloadAction } from '@zougui/common.react-store';
import type { UnknownObject } from '@zougui/common.type-utils';

export const {
  Provider: FormProvider,
  slice,
  useActions: useFormActions,
  useSelector: useFormSelector,
} = createSliceContext<FormState>({
  name: 'Form',
  initialState: {
    schema: yup.object(),
    register: throwInitError,
    formState: {} as any,
    getControl: () => undefined as any,
    defaultValues: {},
  },
  reducers: {
    updateForm: (state, action: PayloadAction<Pick<typeof state, 'register' | 'formState' | 'getControl'>>) => {
      state.register = action.payload.register;
      state.formState = action.payload.formState;
      state.getControl = action.payload.getControl;
    },

    updateSchema: (state, action: PayloadAction<{ schema: typeof state['schema'] }>) => {
      state.schema = action.payload.schema;
    },

    updateDefaultValues: (state, action: PayloadAction<{ defaultValues: UnknownObject }>) => {
      state.defaultValues = action.payload.defaultValues;
    },
  },
});

function throwInitError(): UseFormRegisterReturn {
  throw new Error('Form uninitialized');
}

export interface FormState<TSchema extends AnyObjectSchema = AnyObjectSchema> {
  register: UseFormRegister<InferType<TSchema>>;
  formState: ReactFormState<InferType<TSchema>>;
  getControl: () => Control<InferType<TSchema>>;
  schema: TSchema;
  defaultValues: UnknownObject;
}

export type { } from '@reduxjs/toolkit';
