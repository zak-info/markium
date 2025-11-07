import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';

import { useGetCompany } from 'src/api/company';
import { createCar, editCar } from 'src/api/car';
import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentCar }) {
  const router = useRouter();

  const { company } = useGetCompany();

  const { data } = useValues();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    production_year: Yup.number().required('Production year is required').positive().integer(),
    plat_number: Yup.string().required('Plate number is required'),
    chassis_number: Yup.string().required('Chassis number is required'),
    vin: Yup.string().required('VIN is required'),
    passengers_capacity: Yup.number()
      .required('Passenger capacity is required')
      .positive()
      .integer(),
    odometer: Yup.number().nullable().positive(),
    depreciation: Yup.number()
      .nullable()
      .notRequired()
      .min(0, 'Depreciation cannot be negative')
      .test(
        'is-decimal',
        'Depreciation must be a decimal number with up to 2 decimal places',
        (value) => value === undefined || value === null || /^\d+(\.\d{1,2})?$/.test(value)
      ),
    car_model_id: Yup.string().required('Car model is required'),
    color_id: Yup.string().required('Color is required'),
    state_id: Yup.string().required('Location is required'),
    car_company_id: Yup.string().required('Car company is required'),
    spec_id: Yup.string().required('Specification is required'),
    license_type_id: Yup.string().required('License type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      production_year: currentCar?.production_year || '', // Default to current year
      plat_number: currentCar?.plat_number || '',
      chassis_number: currentCar?.chassis_number || '',
      vin: currentCar?.vin || '',
      passengers_capacity: currentCar?.passengers_capacity || null, // Default to 1 passenger
      odometer: currentCar?.odometer || null, // Default to 0
      depreciation: currentCar?.depreciation || null, // Default to 0
      car_model_id: currentCar?.car_model_id || '',
      color_id: currentCar?.color_id || '',
      state_id: currentCar?.state_id || '',
      car_company_id: currentCar?.company?.id || '',
      spec_id: currentCar?.spec_id || '',
      license_type_id: currentCar?.license_type_id || '',
    }),
    [currentCar]
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
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = currentCar?.id ? await editCar(currentCar?.id, data) : await createCar(data);
      enqueueSnackbar(response?.data?.message);

      router.push(paths.dashboard.vehicle.root);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentCar && (
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

            {currentCar && (
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

            {currentCar && (
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
              <RHFSelect required name="car_company_id" label={t('company')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {company.map((option) => (
                  <MenuItem key={option.value} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField required name="production_year" label={t('manufacturingYear')} />

              <RHFSelect required name="car_model_id" label={t('model')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_model?.map((option) => (
                  <MenuItem key={option.name} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField required name="plat_number" label={t('plateNumber')} />

              <RHFTextField required name="chassis_number" label={t('structureNo')} />

              <RHFTextField required name="vin" label={t('serialNumber')} />
              <RHFTextField name="odometer" label={t('odometer')} />
              <RHFTextField name="depreciation" label={t('depreciation')} />
              <RHFTextField
                type="number"
                required
                name="passengers_capacity"
                label={t('numberOfPassengers')}
              />
              <RHFSelect required name="color_id" label={t('vehcileColor')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.color?.map((option) => (
                  <MenuItem key={option?.translations?.[0]?.name} value={option?.id}>
                    {option?.translations?.[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="spec_id" label={t('specifications')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.spec?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect required name="license_type_id" label={t('typeOfLicense')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.license_type?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.state?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.name}
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
                {!currentCar ? t('addNewVehicle') : t('saveChange')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentCar: PropTypes.object,
};
