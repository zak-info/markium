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

import { useLocales, useTranslate } from 'src/locales';

import { addNewDriver, editDriver } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentDriver }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  console.log("data nationality", data);
  const { car } = useGetCar();
  const { currentLang } = useLocales()



  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    nationality_id: Yup.number()
      .required('Nationality ID is required')
      .typeError('Nationality ID must be a number'),
    residence_permit_number: Yup.string().required('Residence permit number is required'),
    salary: Yup.number().required('Salary is required').typeError('Salary must be a number'),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(/^\d+$/, 'Phone number must be a valid numeric value'),
    start_date: Yup.date()
      .required('Start date is required')
      .typeError('Start date must be a valid date'),
    state_id: Yup.number().required('State ID is required'),
    isMale: Yup.boolean()
      .required('Gender is required')
      .typeError('Gender must be true or false'),
    birth_date: Yup.date()
      .required('Birth date is required')
      .typeError('Birth date must be a valid date'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentDriver?.name || '',
      nationality_id: currentDriver?.nationality?.id || null,
      residence_permit_number: currentDriver?.residence_permit_number || '',
      salary: currentDriver?.salary || null,
      phone_number: currentDriver?.phone_number || '',
      start_date: currentDriver?.start_date || new Date(),
      state_id: currentDriver?.state?.id || null,
      isMale: currentDriver?.isMale == 0 ? false : true, // default to true if undefined
      birth_date: currentDriver?.birth_date || null,
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
    // if (currentDriver?.id && currentDriver?.car) {
    //   const selectedCar = car?.find(
    //     (option) =>
    //       option?.id == 1
    //   );
    //   // If selectedCar is found, set the car_id value
    //   if (selectedCar) {
    //     setValue('car_id', selectedCar.id); // Set the selected car's ID to car_id
    //   }
    // }
    console.log("currentDriver : ", currentDriver);

  }, [car, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("lest edit driver");
      const body = data;
      body.start_date = format(data.start_date, 'yyyy-MM-dd');
      body.birth_date = format(data.birth_date, 'yyyy-MM-dd');
      if (currentDriver?.id) {
        delete body.license_number
        delete body.residence_permit_number

        console.log("lets edit : ", body);
        const res = await editDriver(currentDriver?.id, body);
        console.log("res : ", res);
      } else {
        console.log("lets create ");
        await addNewDriver(body);
      }

      reset();

      enqueueSnackbar(t("operation_success"));

      router.push(paths.dashboard.drivers.root);
    } catch (error) {
     showError(error)
    }
  });

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
             
              <RHFTextField name="name" label={t('name')} />
              <RHFSelect name="nationality_id"  label={t('nationality')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.countries?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="isMale" label={t('gender')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[
                  { value: true, label: { ar: 'ذكر', en: 'Male' } },
                  { value: false, label: { ar: 'أنثى', en: 'Female' } },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect>

              <DatePicker
                label={t('birth_date')}
                format="dd/MM/yyyy"
                value={currentDriver?.start_date ? new Date(currentDriver?.birth_date) : values?.birth_date ? new Date(values?.birth_date) : new Date()}
                onChange={(date) => setValue('birth_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              {/* <DatePicker
                label={t('start_date')}
                format="dd/MM/yyyy"
                value={currentDriver?.start_date ? new Date(currentDriver?.start_date) : values?.start_date ? new Date(values?.start_date) : new Date()}
                onChange={(date) => setValue('start_date', date)}

                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              /> */}


              {/* Residence Permit Number */}
              <RHFTextField disabled={currentDriver?.id ? true : false} name="residence_permit_number" label={t('residence_permit_number')} />

              {/* Location ID */}

              {/* License Number */}
              {/* <RHFTextField disabled={currentDriver?.id ? true : false} name="license_number" label={t('license_number')} /> */}

              {/* Salary */}
              <RHFTextField name="salary" label={t('salary')} type="number" />

              {/* End of Service Bonus */}
              {/* <RHFTextField name="end_of_service_bonus" label={t('end_of_service_bonus')} type="number"/> */}

              {/* Additional Salary */}
              {/* <RHFTextField name="additional_salary" label={t('additional_salary')} type="number" /> */}

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
              {/* <RHFTextField name="hourly_rate" label={t('hourly_rate')} type="number" /> */}

              {/* Custody */}
              {/* <RHFTextField name="custody" label={t('custody')} type="number" /> */}

              {/* Loan */}
              {/* <RHFTextField name="loan" label={t('loan')} type="number" /> */}

              <RHFSelect name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.states?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* Car ID */}

              {/* <RHFSelect name="car_id" label={t('vehicle')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {car?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.model?.company?.translations?.name} ({option?.plat_number})
                  </MenuItem>
                ))}
              </RHFSelect> */}


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

UserNewEditForm.propTypes = {
  currentDriver: PropTypes.object,
};
