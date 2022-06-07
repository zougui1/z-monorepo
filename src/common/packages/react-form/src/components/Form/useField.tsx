import React from 'react';
import type { UseFormRegister, Control } from 'react-hook-form';
import type { SchemaDescription } from 'yup/lib/schema';

import { useFormSelector } from './context';

export const useField = ({ name, label }: UseFieldOptions): UseFieldResult | undefined => {
  const register = useFormSelector(state => state.register);
  const control = useFormSelector(state => state.getControl());
  const error = useFormSelector(state => state.formState.errors[name]);
  const fieldDescription = useFormSelector(state => state.schema.describe().fields[name]) as SchemaDescription | undefined;

  if (!fieldDescription) {
    console.error(`Field "${name}" does not exist in the form schema`);
    return;
  }

  const actualLabel = label && fieldDescription.tests.some(test => test.name === 'required')
    ? <>{label}{' *'}</>
    : label;

  return {
    register,
    control,
    error,
    label: actualLabel,
    description: fieldDescription,
  }
}

export interface UseFieldOptions {
  name: string;
  label?: React.ReactNode | undefined;
}

export interface UseFieldResult {
  register: UseFormRegister<any>;
  control: Control<any>;
  error: any;
  label?: React.ReactNode | undefined;
  description: SchemaDescription;
}
