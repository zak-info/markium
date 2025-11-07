import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export default function RHFTextarea({ name, helperText, rows = 4, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      fullWidth
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          multiline
          rows={rows}
          error={!!error}
          helperText={error ? error?.message : helperText}
          sx={{ width: '100%' }}
          {...other}
        />
      )}
    />
  );
}

RHFTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  helperText: PropTypes.node,
  rows: PropTypes.number,
};
