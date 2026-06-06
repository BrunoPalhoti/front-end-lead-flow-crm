import { TextField, type TextFieldProps } from '@mui/material'
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

interface RHFTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>
  control: Control<T>
}

export function RHFTextField<T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: RHFTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...textFieldProps}
          fullWidth={textFieldProps.fullWidth ?? true}
          error={Boolean(error)}
          helperText={error?.message}
        />
      )}
    />
  )
}
