import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

import { useField } from '../../useField';

export const FormTextField = ({ name, label, ...fieldProps }: FormTextFieldProps) => {
  const field = useField({ name, label });

  if (!field) {
    return null;
  }

  return (
    <TextField
      {...field.register(name)}
      error={Boolean(field.error)}
      helperText={field.error?.message}
      {...fieldProps}
      label={field.label}
    />
  );
}

// name is required
export type FormTextFieldProps = TextFieldProps & { name: string; };
