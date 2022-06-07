import React, { useRef } from 'react';
import { FormControl, FormHelperText, TextField, TextFieldProps } from '@mui/material';
import { TimePicker, TimePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { Controller, ControllerRenderProps } from 'react-hook-form';

import { useField } from '../useField';
import { getUnknownDate } from '../utils';

export const FormTimePicker = <TInputDate, TDate>({ name, label, ...fieldProps }: FormTimePickerProps<TInputDate, TDate>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const field = useField({ name, label })

  if (!field) {
    return null;
  }

  const onChange = (field: ControllerRenderProps<any, string>) => (value: any) => {
    const target = inputRef.current;

    if (target) {
      field.onChange({
        type: 'change',
        // give the parsed value from MUI's date picker to react-hook-form
        target: {
          ...target,
          value,
        },
      });
    }
  }

  return (
    <FormControl error={Boolean(field.error)}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <Controller
          name={name}
          control={field.control}
          render={({ field: renderField }) => (
            <TimePicker
              {...renderField}
              value={getUnknownDate(renderField.value)}
              onChange={onChange(renderField)}
              {...fieldProps}
              label={field.label}
              inputRef={inputRef}
              renderInput={(props: TextFieldProps) => <TextField {...props} />}
            />
          )}
        />
      </LocalizationProvider>

      {field.error?.message && <FormHelperText>{field.error?.message}</FormHelperText>}
    </FormControl>
  );
}

export interface FormTimePickerProps<TInputDate, TDate> extends
  Omit<TimePickerProps<any, any>, 'onChange' | 'renderInput' | 'value'>,
  Partial<TimePickerProps<any, any>> {
  name: string;
};
