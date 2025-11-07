import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { Upload, UploadBox, UploadAvatar } from '../upload';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple = false, label,placeholder, helperText,accept,oldFileUrl, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Upload
          label={label}
          placeholder={placeholder}
          multiple={multiple}
          files={multiple ? field.value || [] : undefined}
          file={!multiple ? field.value : undefined}
          error={!!error}
          accept={accept}
          oldFileUrl={oldFileUrl}
          onChange={(selectedFiles) => {
            if (multiple) {
              setValue(name, selectedFiles);
            } else {
              setValue(name, selectedFiles[0]);
            }
          }}
          onDelete={() => {
            setValue(name, multiple ? [] : '');
          }}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  );
}

RHFUpload.propTypes = {
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  label: PropTypes.string,
  helperText: PropTypes.string,
};