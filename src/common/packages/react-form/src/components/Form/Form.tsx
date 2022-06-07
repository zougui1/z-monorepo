import React, { useMemo } from 'react';
import { useForm, UnpackNestedValue, DeepPartial } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { AnyObjectSchema, InferType } from 'yup';

import { FormRoot } from './FormRoot';
import { FormTextField } from './compounds/TextField';
import { FormCheckbox } from './compounds/Checkbox';
import { FormSelect } from './compounds/Select';
import { FormDatePicker } from './compounds/DatePicker';
import { FormTimePicker } from './compounds/TimePicker';
import { FormDateTimePicker } from './compounds/DateTimePicker';
import { FormField } from './compounds/Field';
import { FormProvider, FormState } from './context';
import { getFieldsDefaultValue } from './utils';

export const Form = <TSchema extends AnyObjectSchema = AnyObjectSchema>(props: FormProps<TSchema>) => {
  const { onSubmit, schema, defaultValues, ...formProps } = props;

  const generatedDefaultValues = useMemo(() => {
    return getFieldsDefaultValue(schema);
  }, [schema]);

  const actualDefaultValues = {
    ...generatedDefaultValues,
    ...defaultValues,
  };

  const { handleSubmit, register, formState, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: actualDefaultValues,
  });

  const getControl = () => control;
  const defaultState: FormState = {
    register,
    formState,
    schema,
    getControl,
    defaultValues: actualDefaultValues,
  };

  return (
    <FormProvider defaultState={defaultState}>
      <FormRoot
        {...formProps}
        register={register}
        getControl={getControl}
        formState={formState}
        onSubmit={handleSubmit(onSubmit)}
        schema={schema}
        defaultValues={actualDefaultValues}
      />
    </FormProvider>
  );
}

Form.TextField = FormTextField;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.DatePicker = FormDatePicker;
Form.TimePicker = FormTimePicker;
Form.DateTimePicker = FormDateTimePicker;
Form.Field = FormField;

export interface FormProps<TSchema extends AnyObjectSchema = AnyObjectSchema> {
  schema: TSchema;
  onSubmit: (data: InferType<TSchema>, event: React.BaseSyntheticEvent<object, any, any> | undefined) => void;
  defaultValues?: UnpackNestedValue<DeepPartial<InferType<TSchema>>> | undefined;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | undefined;
}
