import PropTypes from 'prop-types';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';

export default function CarsAutocomplete({
  name,
  label,
  disabled,
  options,
  placeholder,
  multiple = false,
  car_id,
}) {
  const { control, setValue } = useFormContext();

  // Watch the current value of this field in the form
  const watchedValue = useWatch({ name });

  // Auto-select if car_id is passed and matching item exists
  useEffect(() => {
    if (car_id != null && options.length > 0) {
      const selectedCar = options.find((car) => car.id === Number(car_id));
      if (selectedCar) {
        setValue(name, multiple ? [selectedCar.id] : selectedCar.id, {
          shouldValidate: true,
        });
      }
    }
  }, [car_id, options, multiple, setValue, name]);

  // Log for debugging (optional)
  // console.log('car_id:', car_id);
  // console.log('watchedValue:', watchedValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => (
        <Autocomplete
          options={options}
          disabled={disabled}
          multiple={multiple}
          getOptionLabel={(option) => option.plat_number || ''}
          isOptionEqualToValue={(option, val) => option.id === val?.id}
          value={
            multiple
              ? options.filter(
                  (o) => Array.isArray(watchedValue) && watchedValue.includes(o.id)
                )
              : options.find((o) => o.id === watchedValue) ?? null
          }
          onChange={(event, newValue) =>
            setValue(
              name,
              multiple
                ? newValue.map((item) => item.id)
                : newValue?.id ?? '',
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
  disabled: PropTypes.bool,
  car_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.array.isRequired,
};
