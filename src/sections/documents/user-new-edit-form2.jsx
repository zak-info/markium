import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect } from 'react';
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

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

import { useTranslate } from 'src/locales';

import { addNewDriver, editDriver } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';

// ----------------------------------------------------------------------

export default function UserNewEditForm2({ currentDriver }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const { car } = useGetCar();



  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    // nationality_id: Yup.number()
    //   .required('Nationality ID is required')
    //   .typeError('Nationality ID must be a number'),
    residence_permit_number: Yup.string().required('Residence permit number is required'),

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

    car_id: Yup.number().required('Car ID is required').typeError('Car ID must be a number'),
    // state_id: Yup.number().required('State ID is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDriver?.name || '',
      nationality_id: currentDriver?.nationality?.id || "123123123",
      residence_permit_number: currentDriver?.residence_permit_number || '',

      license_number: currentDriver?.license_number || '',
      salary: currentDriver?.salary || null,
      end_of_service_bonus: currentDriver?.end_of_service_bonus || null,
      additional_salary: currentDriver?.additional_salary || null,
      phone_number: currentDriver?.phone_number || '',
      start_date: currentDriver?.start_date || '',
      hourly_rate: currentDriver?.hourly_rate || null,
      custody: currentDriver?.custody || null,
      loan: currentDriver?.loan || null,
      car_id: currentDriver?.car_id || null,
      state_id: currentDriver?.state?.id || "werdfsdf123123",
    }),
    [currentDriver]
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentDriver?.id && currentDriver?.car) {
      const selectedCar = car?.find(
        (option) =>
          option?.id == 1
      );
      // If selectedCar is found, set the car_id value
      if (selectedCar) {
        setValue('car_id', selectedCar.id); // Set the selected car's ID to car_id
      }
    }

  }, [car, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // const body = data;
      // body.start_date = format(data.start_date, 'yyyy-MM-dd');
      // if (currentDriver?.id) {
      //   delete body.license_number
      //   delete body.residence_permit_number

      //   console.log("lets edit : ", body);
      //   const res = await editDriver(currentDriver?.id, body);
        console.log("res : is res");
      // } else {
      //   console.log("lets create ");
      //   await addNewDriver(body);
      // }

      // reset();

      // enqueueSnackbar(currentDriver?.id ? 'Update success!' : 'Create success!');

      // router.push(paths.dashboard.drivers.root);
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
              {/* Name */}
              <RHFTextField name="name" label={t('name')} />

              {/* Nationality ID */}

              <RHFSelect name="nationality_id" label={t('nationality')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.nationality?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Residence Permit Number */}
              <RHFTextField disabled={currentDriver?.id ? true : false} name="residence_permit_number" label={t('residence_permit_number')} />

              {/* Location ID */}

              {/* License Number */}
              <RHFTextField disabled={currentDriver?.id ? true : false} name="license_number" label={t('license_number')} />

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
                format="dd/MM/yyyy"  
                value={currentDriver?.start_date ? new Date(currentDriver?.start_date) : values?.start_date ? new Date(values?.start_date) : new Date()}
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

              <RHFSelect name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.state?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Car ID */}

              <RHFSelect name="car_id" label={t('vehicle')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {car?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.model?.company?.translations?.name} ({option?.plat_number})
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentDriver ? t('addNewDriver') : t('saveChange')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm2.propTypes = {
  currentDriver: PropTypes.object,
};
