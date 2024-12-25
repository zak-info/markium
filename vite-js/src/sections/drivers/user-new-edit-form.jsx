import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { format, getTime, formatDistanceToNow } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFSelect,
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';

import { addNewDriver } from 'src/api/drivers';

import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentUser }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    nationality_id: Yup.number()
      .required('Nationality ID is required')
      .typeError('Nationality ID must be a number'),
    residence_permit_number: Yup.string().required('Residence permit number is required'),
    location_id: Yup.number()
      .required('Location ID is required')
      .typeError('Location ID must be a number'),
    license_number: Yup.string().required('License number is required'),
    salary: Yup.number().required('Salary is required').typeError('Salary must be a number'),
    end_of_service_bonus: Yup.number()
      .required('End of service bonus is required')
      .typeError('End of service bonus must be a number'),
    additional_salary: Yup.number()
      .required('Additional salary is required')
      .typeError('Additional salary must be a number'),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(/^\d+$/, 'Phone number must be a valid numeric value'),
    start_date: Yup.date()
      .required('Start date is required')
      .typeError('Start date must be a valid date'),
    hourly_rate: Yup.number()
      .required('Hourly rate is required')
      .typeError('Hourly rate must be a number'),
    custody: Yup.number().required('Custody is required').typeError('Custody must be a number'),
    loan: Yup.number().required('Loan is required').typeError('Loan must be a number'),
    employer_id: Yup.number()
      .required('Employer ID is required')
      .typeError('Employer ID must be a number'),
    car_id: Yup.number().required('Car ID is required').typeError('Car ID must be a number'),
    state_id: Yup.number().required('State ID is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      nationality_id: currentUser?.nationality_id || null,
      residence_permit_number: currentUser?.residence_permit_number || '',
      location_id: currentUser?.location_id || null,
      license_number: currentUser?.license_number || '',
      salary: currentUser?.salary || null,
      end_of_service_bonus: currentUser?.end_of_service_bonus || null,
      additional_salary: currentUser?.additional_salary || null,
      phone_number: currentUser?.phone_number || '',
      start_date: currentUser?.start_date || '',
      hourly_rate: currentUser?.hourly_rate || null,
      custody: currentUser?.custody || null,
      loan: currentUser?.loan || null,
      employer_id: currentUser?.employer_id || null,
      car_id: currentUser?.car_id || null,
      state_id: currentUser?.car_id || null,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
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
      const body = data;
      body.start_date = format(data.start_date, 'yyyy-mm-dd');

      await addNewDriver(body);

      reset();

      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');

      router.push(paths.dashboard.drivers.root);
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

  const options = ['نيسان', 'تويتا'];
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid> */}
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
              {/* Name */}
              <RHFTextField name="name" label={t('name')} />

              {/* Nationality ID */}
              <RHFTextField name="nationality_id" label={t('nationality')} type="number" />

              {/* Residence Permit Number */}
              <RHFTextField name="residence_permit_number" label={t('residence_permit_number')} />

              {/* Location ID */}
              <RHFTextField name="location_id" label={t('location')} type="number" />

              {/* License Number */}
              <RHFTextField name="license_number" label={t('license_number')} />

              {/* Salary */}
              <RHFTextField name="salary" label={t('salary')} type="number" />

              {/* End of Service Bonus */}
              <RHFTextField
                name="end_of_service_bonus"
                label={t('end_of_service_bonus')}
                type="number"
              />

              {/* Additional Salary */}
              <RHFTextField name="additional_salary" label={t('additional_salary')} type="number" />

              {/* Phone Number */}
              <RHFTextField name="phone_number" label={t('phone')} />

              {/* Start Date */}
              <DatePicker
                label={t('start_date')}
                value={currentUser?.start_date || new Date()}
                onChange={(date) => setValue('start_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              {/* Hourly Rate */}
              <RHFTextField name="hourly_rate" label={t('hourly_rate')} type="number" />

              {/* Custody */}
              <RHFTextField name="custody" label={t('custody')} type="number" />

              {/* Loan */}
              <RHFTextField name="loan" label={t('loan')} type="number" />

              {/* Employer ID */}
              <RHFTextField name="employer_id" label={t('employer')} type="number" />

              <RHFSelect name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.state?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Car ID */}
              <RHFTextField name="car_id" label={t('vehicle')} type="number" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('addNewDriver') : t('saveChange')}
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
