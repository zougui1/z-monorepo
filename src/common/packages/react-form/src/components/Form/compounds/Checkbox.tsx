import React from 'react';
import { Checkbox, FormControl, FormControlLabel, FormControlLabelProps, FormHelperText } from '@mui/material';

import { useField } from '../useField';

export const FormCheckbox = ({ name, label, ...fieldProps }: FormCheckboxProps) => {
  const field = useField({ name, label })

  if (!field) {
    return null;
  }

  return (
    <FormControl error={Boolean(field.error)}>
      <FormControlLabel
        {...field.register(name)}
        control={<Checkbox />}
        {...fieldProps}
        label={field.label || ''}
      />
      {field.error?.message && <FormHelperText>{field.error?.message}</FormHelperText>}
    </FormControl>
  );
}

export interface FormCheckboxProps extends Omit<FormControlLabelProps, 'label' | 'control'>, Partial<FormControlLabelProps> {
  name: string;
}
