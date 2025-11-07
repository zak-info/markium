import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function OneValueAutocomplete({ name, label, options, placeholder, multiple = false }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value }, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          multiple={multiple}
          getOptionLabel={(option) => option}
          value={multiple ? value || [] : value || null}
          isOptionEqualToValue={(option, val) => option === val}
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error.message : ''}
            />
          )}
        />
      )}
    />
  );
}

OneValueAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  multiple: PropTypes.bool
};
