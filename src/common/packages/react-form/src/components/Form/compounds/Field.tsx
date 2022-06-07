import React from 'react';
import { MenuItem } from '@mui/material';
import type { SchemaDescription } from 'yup/lib/schema';

import { FormTextField } from './TextField';
import { FormCheckbox } from './Checkbox';
import { FormSelect } from './Select';
import { FormDatePicker } from './DatePicker';
import { FormTimePicker } from './TimePicker';
import { FormDateTimePicker } from './DateTimePicker';
import { useFormSelector } from '../context';

export const FormField = ({ pickerVariant, ...props }: FormFieldProps) => {
  const { name } = props;
  const fieldDescription = useFormSelector(state => state.schema.describe().fields[name]) as SchemaDescription | undefined;

  if (!fieldDescription) {
    console.error(`Field "${name}" does not exist in the form schema`);
    return null;
  }

  const type = fieldDescription.type;

  if (type === 'string') {
    if (fieldDescription.oneOf?.length) {
      return (
        <FormSelect {...props}>
          {fieldDescription.oneOf.map((value) => (
            <MenuItem key={String(value)} value={String(value)}>{String(value)}</MenuItem>
          ))}
        </FormSelect>
      );
    }

    return <FormTextField {...props} />;
  }

  if (type === 'number') {
    return <FormTextField type="number" {...props} />;
  }

  if (type === 'boolean') {
    return <FormCheckbox {...props} />
  }

  if (type === 'date') {
    const Picker = (pickerVariant && pickerVariants[pickerVariant]) || FormDateTimePicker;

    return <Picker {...props} />;
  }

  console.warn(`Invalid field type "${type}"`);

  return null;
}

const pickerVariants = {
  date: FormDatePicker,
  time: FormTimePicker,
  dateTime: FormDateTimePicker,
} as const;

export interface FormFieldProps {
  label?: string | undefined;
  name: string;
  /**
   * @default 'dateTime'
   */
  pickerVariant?: 'date' | 'time' | 'dateTime' | undefined;
};
