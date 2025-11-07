import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export default function FlexibleAutocomplete({
  name,
  label,
  options = [],
  placeholder,
  disabled,
  multiple = false,
  getOptionLabelFn = (option) => option?.name,
  loading = false,
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      render={({ field: { value }, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          disabled={disabled}
          loading={loading}
          multiple={multiple}
          getOptionLabel={(option) => getOptionLabelFn(option) || ''}
          value={
            multiple
              ? options?.filter((o) => value?.includes(o.id))
              : options?.find((o) => o.id === value) || null
          }
          isOptionEqualToValue={(option, val) => option.id === val?.id}
          onChange={(event, newValue) =>
            setValue(
              name,
              multiple
                ? newValue?.map((item) => item.id)
                : newValue?.id || '',
              { shouldValidate: true }
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message || ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
}

FlexibleAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object),
  multiple: PropTypes.bool,
  getOptionLabelFn: PropTypes.func,
  loading: PropTypes.bool,
};
