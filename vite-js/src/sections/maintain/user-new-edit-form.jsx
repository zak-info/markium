import * as Yup from 'yup';
import PropTypes, { number } from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFSelect,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';
import { useValues } from 'src/api/utils';

import { createMaintenance } from 'src/api/maintainance';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const { data } = useValues();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object({
    state_id: Yup.number()
      .required('State ID is required')
      .positive('State ID must be a positive number')
      .integer('State ID must be an integer'),

    type: Yup.string().required('Type is required'),

    car_plat_number: Yup.string()
      .required('Car plate number is required')
      .matches(/^\d+$/, 'Car plate number must be numeric'), // Assuming car plate number is numeric only

    entry_date: Yup.date().required('Entry date is required'), // Validates that the entry date is not in the future
    cause: Yup.string()
      .required('Cause is required')
      .min(3, 'Cause must be at least 3 characters long'), // Validates that cause has a minimum length of 3

    exit_date: Yup.date().nullable(), // Allowing an empty string for exit date (since it's not required)
    // Exit date validation for the future
  });

  const defaultValues = useMemo(
    () => ({
      state_id: null, // default value for state_id
      car_plat_number: '', // default value for car plate number
      type: '', // default value for car plate number
      entry_date: null, // default value for entry date
      cause: '', // default value for cause
      exit_date: null, // default value for exit date (empty string)
    }),
    [currentUser]
  );
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMaintenance(values);
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.maintenance.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const maintainType = [
    {
      value: 'urgent',
      label: 'طارئ',
    },

    {
      label: 'اعتيادي',
      value: 'normal',
    },
  ];
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField required name="car_plat_number" label={t('plateNumber')} />

              <DatePicker
                label={t('entryDate')}
                value={values.entry_date ? new Date(values.entry_date) : null}
                required
                name="entry_date"
                onChange={(newValue) => setValue('entry_date', fDate(newValue, 'yyyy-MM-dd'))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                minDate={new Date()}
              />

              <DatePicker
                label={t('exitDate')}
                value={values.exit_date ? new Date(values.exit_date) : null}
                name="exit_date"
                onChange={(newValue) => setValue('exit_date', fDate(newValue, 'yyyy-MM-dd'))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                minDate={new Date()}
              />

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.state?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField required name="cause" label={t('malfunction')} />

              <RHFSelect required name="type" label={t('maintainType')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {maintainType?.map((option) => (
                  <MenuItem key={option?.value} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <RHFAutocomplete
                name="country"
                type="country"
                label={t('manufacturingYear')}
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('addNewMaintain') : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};
