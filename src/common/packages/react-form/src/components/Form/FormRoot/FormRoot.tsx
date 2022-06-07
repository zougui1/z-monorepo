import React, { useEffect } from 'react';
import type { UseFormRegister, FormState as ReactFormState, Control } from 'react-hook-form';
import type { AnyObjectSchema, InferType } from 'yup';

import type { UnknownObject } from '@zougui/common.type-utils';

import { useFormActions } from '../context';

export const FormRoot = <TSchema extends AnyObjectSchema = AnyObjectSchema>(props: FormRootProps<TSchema>) => {
  const { register, formState, getControl, defaultValues, schema, children, ...formProps } = props;
  const actions = useFormActions();

  useEffect(() => {
    actions.updateForm?.({ register, formState, getControl, defaultValues });
  }, [register, formState, getControl, defaultValues]);

  useEffect(() => {
    actions.updateSchema?.({ schema });
  }, [schema]);

  return (
    <form {...formProps}>
      {children}
    </form>
  );
}

export interface FormRootProps<TSchema extends AnyObjectSchema = AnyObjectSchema> {
  register: UseFormRegister<InferType<TSchema>>;
  formState: ReactFormState<InferType<TSchema>>;
  getControl: () => Control<InferType<TSchema>>;
  onSubmit: (event: React.BaseSyntheticEvent<object, any, any> | undefined) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | undefined;
  schema: TSchema;
  defaultValues: UnknownObject;
}
