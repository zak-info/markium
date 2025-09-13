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

import { addNewDriver, editDriver, useGetDrivers } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import showError from 'src/utils/show_error';
import { useGetSystemVisibleItem } from 'src/api/settings';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentDriver }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { items: countries } = useGetSystemVisibleItem("country")
  const { items: states } = useGetSystemVisibleItem("state")
  const {data : Vdata} = useValues()
  const { car } = useGetCar();
  const { drivers } = useGetDrivers()
  const { currentLang } = useLocales()






  const validationSchema = Yup.object({
    name: Yup.string().required(t('name_required')),
    nationality_id: Yup.number()
      .required(t('nationality_id_required'))
      .typeError(t('nationality_id_must_be_number')),
    residence_permit_number: Yup.string()
      .required(t('residence_permit_number_required'))
      .matches(/^2\d{9}$/, t('residence_permit_number_invalid_format'))
      .test('unique', t('residence_permit_number_already_exists'), async (value) => {
        if (!value) return true;
        try {
          const response = await checkResidencePermitAvailability(value);
          return response.available;
        } catch {
          return true;
        }
      }),
    salary: Yup.number()
      .required(t('salary_required'))
      .typeError(t('salary_must_be_number')),
    // phone_number: Yup.string()
    //   .required(t('phone_number_required'))
    //   .matches(/^\d+$/, t('phone_number_must_be_numeric')),
    phone_number: Yup.string()
      .required(t('phone_number_required'))
      .matches(/^[0-9]+$/, t('only_numbers_allowed')) // Only numbers allowed
      .test('valid-format', t('please_enter_number_beginning_with_966_or_05'), function (value) {
        if (!value) return false;
        // Check if starts with 966
        if (value.startsWith('966')) {
          return value.length === 12; // 966 + 9 digits = 12 total
        }
        // Check if starts with 05
        if (value.startsWith('05')) {
          return value.length === 10; // 05 + 8 digits = 10 total
        }
        return false; // Must start with either 966 or 05
      })
      .test('unique-number', t('this_number_is_already_in_use'), async function (value) {
        if (!value) return true; // Skip validation if no value
        if(currentDriver?.id){
          return true
        }
        // Check if phone number already exists in drivers array
        const isDuplicate = drivers?.some(driver => driver.phone_number === value);
        return !isDuplicate; // Return false if duplicate found, true if unique
      }),
    start_date: Yup.date()
      .required(t('start_date_required'))
      .typeError(t('start_date_must_be_valid')),
    state_id: Yup.number().required(t('state_id_required')),
    isMale: Yup.boolean()
      .required(t('gender_required'))
      .typeError(t('gender_must_be_boolean')),
    birth_date: Yup.date()
      // .required(t('birth_date_required'))
      .typeError(t('birth_date_must_be_valid'))
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
      birth_date: currentDriver?.birth_date ? new Date(currentDriver?.birth_date) : new Date(),
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






  const isDuplicatePhone = useMemo(() => {
    if(currentDriver?.id){
      return false
    }
    if (!values.phone_number) return false;
    return drivers?.some(driver => driver.phone_number === values.phone_number) || false;
  }, [values.phone_number, drivers]);





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

              <RHFTextField
                name="name"
                label={t('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <RHFSelect
                name="nationality_id"
                label={t('nationality')}
                error={!!errors.nationality_id}
                helperText={errors.nationality_id?.message}
              >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {Vdata?.countries?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect
                required
                name="isMale"
                label={t('gender')}
                error={!!errors.isMale}
                helperText={errors.isMale?.message}
              >
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
                value={currentDriver?.birth_date ? new Date(currentDriver?.birth_date) : values?.birth_date ? new Date(values?.birth_date) : new Date()}
                onChange={(date) => setValue('birth_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.birth_date,
                    helperText: errors.birth_date?.message,
                  },
                }}
              />

              {/* <RHFTextField
                disabled={currentDriver?.id ? true : false}
                name="residence_permit_number"
                label={t('residence_permit_number')}
                error={!!errors.residence_permit_number}
                helperText={errors.residence_permit_number?.message}
              /> */}
              {/* .matches(/^2\d{9}$/, t('residence_permit_number_invalid_format')) */}
              <RHFTextField
                disabled={currentDriver?.id ? true : false}
                name="residence_permit_number"
                type="text"
                label={t('residence_permit_number')}
                error={
                  !values.residence_permit_number ? false : !/^2\d{9}$/.test(values.residence_permit_number)
                }
                helperText={
                  !values.residence_permit_number
                    ? null
                    : !/^2\d{9}$/.test(values.residence_permit_number)
                      ? t('residence_permit_number_invalid_format')
                      : ''
                }
              />

              <RHFTextField
                name="salary"
                label={t('salary')}
                type="number"
                error={!!errors.salary}
                helperText={errors.salary?.message}
              />

              {/* <RHFTextField
                name="phone_number"
                label={t('phone')}
                error={!!errors.phone_number}
                helperText={errors.phone_number?.message}
              /> */}

              <RHFTextField
                name="phone_number"
                type="text"
                label={t('phone_number')}
                error={(() => {
                  if (!values.phone_number) return false;

                  // Check for duplicates first
                  if (isDuplicatePhone) return true;

                  // Check if only numbers
                  if (!/^[0-9]+$/.test(values.phone_number)) return true;

                  // Check format and length based on prefix
                  if (values.phone_number.startsWith('966')) {
                    return values.phone_number.length !== 12;
                  }
                  if (values.phone_number.startsWith('05')) {
                    return values.phone_number.length !== 10;
                  }

                  // Invalid prefix
                  return true;
                })()}
                helperText={(() => {
                  if (!values.phone_number) return null;

                  // Priority order of error messages
                  if (isDuplicatePhone) {
                    return t('this_number_is_already_in_use');
                  }

                  if (!/^[0-9]+$/.test(values.phone_number)) {
                    return t('only_numbers_allowed');
                  }

                  if (values.phone_number.startsWith('966')) {
                    if (values.phone_number.length !== 12) {
                      return t('phone_number_must_be_12_digits_for_966');
                    }
                  } else if (values.phone_number.startsWith('05')) {
                    if (values.phone_number.length !== 10) {
                      return t('phone_number_must_be_10_digits_for_05');
                    }
                  } else {
                    return t('please_enter_number_beginning_with_966_or_05');
                  }

                  return null;
                })()}
              />
              <DatePicker
                label={t('start_date')}
                format="dd/MM/yyyy"
                value={currentDriver?.start_date ? new Date(currentDriver?.start_date) : values?.start_date ? new Date(values?.start_date) : new Date()}
                onChange={(date) => setValue('start_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.start_date,
                    helperText: errors.start_date?.message,
                  },
                }}
              />

              <RHFSelect
                name="state_id"
                label={t('workSite')}
                error={!!errors.state_id}
                helperText={errors.state_id?.message}
              >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {Vdata?.states?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.name} value={option?.id}>
                    {option?.translations[0]?.name}
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

UserNewEditForm.propTypes = {
  currentDriver: PropTypes.object,
};
