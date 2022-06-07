import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';

import { useField } from '../useField';

export const FormSelect = ({ name, label, ...fieldProps }: FormSelectProps) => {
  const field = useField({ name, label })

  if (!field) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={field.control}
      render={({ field: renderField }) => (
        <TextField
          {...renderField}
          error={Boolean(field.error)}
          helperText={field.error?.message}
          select
          {...fieldProps}
          label={field.label}
        />
      )}
    />
  );
}

// name is required
export type FormSelectProps = TextFieldProps & { name: string; };
