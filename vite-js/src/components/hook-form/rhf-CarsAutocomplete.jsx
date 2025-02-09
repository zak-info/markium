import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';

export default function CarsAutocomplete({ name, label, options, placeholder, multiple = false, car_id }) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (car_id && options.length > 0) {
      const selectedCar = options.find((car) => car.id == car_id);
      if (selectedCar) {
        setValue(name, multiple ? [selectedCar.id] : selectedCar.id, { shouldValidate: true });
      }
    }
  }, [car_id, options, multiple, setValue, name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value }, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          multiple={multiple}
          getOptionLabel={(option) => option.plat_number} // Display `plat_number`
          value={multiple ? options.filter((o) => value?.includes(o.id)) : options.find((o) => o.id === value) || null} // Convert id to object for UI
          isOptionEqualToValue={(option, val) => option.id === val?.id} // Prevent mismatches
          onChange={(event, newValue) =>
            setValue(
              name,
              multiple ? newValue.map((item) => item.id) : newValue?.id || '',
              { shouldValidate: true }
            )
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

CarsAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  car_id: PropTypes.string, // Optional car ID to auto-select
};
