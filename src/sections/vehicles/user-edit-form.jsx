import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState, useEffect } from 'react';
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
import { createCar, editCar, useGetCar } from 'src/api/car';
import { useValues } from 'src/api/utils';
import showError from 'src/utils/show_error';
import { useGetSystemVisibleItem } from 'src/api/settings';
import showValidationError from 'src/utils/show_validation_error';

// ----------------------------------------------------------------------

export default function UserEditForm({ currentCar }) {
  const router = useRouter();
  const { car } = useGetCar()
  console.log("car : ", car);

  const { data } = useValues();
  const {items : car_models} = useGetSystemVisibleItem("car_model")
  const {items : car_companies} = useGetSystemVisibleItem("car_company")
  const {items : colors} = useGetSystemVisibleItem("color")
  const {items : states} = useGetSystemVisibleItem("state")
  const {items : specs} = useGetSystemVisibleItem("spec")
  const {items : license_types} = useGetSystemVisibleItem("license_type")
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    // production_year: Yup.number()
    //   // .required(t('production_year_required'))
    //   .positive()
    //   .integer(),

    // plat_number: Yup.string()
    //   // .required(t('plat_number_required'))
    //   .test(
    //     'unique-plat',
    //     t('plat_number_already_exists'),
    //     function (value) {
    //       return !car?.map(item => item?.plat_number)?.filter(item => item?.id != currentCar?.id)?.includes(value.trim());
    //     }
    //   ),

    // chassis_number: Yup.string()
    //   .length(17, t('chassis_number_length'))
    //   // .required(t('chassis_number_required'))
    //   .test(
    //     'chassis-number',
    //     t('chassis_number_already_exists'),
    //     function (value) {
    //       return !car?.map(item => item?.chassis_number)?.filter(item => item?.chassis_number != currentCar?.chassis_number)?.includes(value.trim());
    //     }
    //   ),

    // vin: Yup.string()
    //   // .required(t('vin_required'))
    //   .test(
    //     'vin',
    //     t('vin_already_exists'),
    //     function (value) {
    //       return !car?.map(item => item?.vin)?.filter(item => item?.vin != currentCar?.vin)?.includes(value.trim());
    //     }
    //   ),

    passengers_capacity: Yup.number()
      .required(t('passenger_capacity_required'))
      .positive(t('passenger_capacity_must_be_positive'))
      .integer(t('passenger_capacity_must_be_integer'))
      .max(99, t('passenger_capacity_must_be_less_than_100')),

    odometer: Yup.number()
      .positive(t('odometer_must_be_positive'))
      .integer(t('odometer_must_be_integer')),
    // .required(t('odometer_required'))

    // car_model_id: Yup.string().required(t('car_model_required')),
    color_id: Yup.string().required(t('color_required')),
    state_id: Yup.string().required(t('location_required')),
    // car_company_id: Yup.string().required(t('car_company_required')),
    spec_id: Yup.string().required(t('specification_required')),
    license_type_id: Yup.string().required(t('license_type_required')),
  });


  const defaultValues = useMemo(
    () => ({
      production_year: currentCar?.production_year || '', // Default to current year
      plat_number: currentCar?.plat_number || '',
      chassis_number: currentCar?.chassis_number || '',
      vin: currentCar?.vin || '',
      passengers_capacity: currentCar?.passengers_capacity || null, // Default to 1 passenger
      odometer: currentCar?.odometer || null, // Default to 0
      // depreciation: currentCar?.depreciation || null, // Default to 0
      car_model_id: currentCar?.car_model_id || '',
      color_id: currentCar?.color_id || '',
      state_id: currentCar?.state_id || '',
      car_company_id: currentCar?.company?.id || '',
      spec_id: currentCar?.spec_id || '',
      license_type_id: currentCar?.license_type_id || '',
    }),
    [currentCar]
  );


  const validateUnicity = (list, key, value) => {
    return list?.map(item => item?.[key])?.filter(item => item?.[key] != currentCar?.[key])?.includes(value.trim())
  }

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


  useEffect(() => {
    showValidationError(errors)
  }, [errors]);



  const selectedCompanyId = watch('car_company_id');

  const values = watch();

  useEffect(() => {
    if (currentCar?.id) {
      const selectedColor = data?.colors?.find(
        (option) =>
          option?.id == currentCar?.color?.id
      );
      if (selectedColor) {
        setValue('color_id', selectedColor.id);
      }

      const selectedCarCompany = data?.car_companies?.find(
        (option) => option?.id == currentCar?.model?.company?.id
      );
      if (selectedCarCompany) {
        setValue('car_company_id', selectedCarCompany?.id);
      }
      const selectedCarModel = data?.car_companies?.find(item => item?.id == currentCar?.model?.company?.id)?.models?.find(
        (option) => option?.id == currentCar?.model?.id
      );
      if (selectedCarModel) {
        setValue('car_model_id', selectedCarModel?.id);
      }
      const selectedSpec = data?.specs?.find(
        (option) => option?.id == currentCar?.spec?.id
      );
      if (selectedSpec) {
        setValue('spec_id', selectedSpec?.id);
      }
      const selectedLicenseType = data?.license_types?.find(
        (option) => option?.id == currentCar?.license_type?.id
      );
      if (selectedLicenseType) {
        setValue('license_type_id', selectedLicenseType?.id);
      }
      const selectedState = data?.states?.find(
        (option) => option?.id == currentCar?.state?.id
      );
      if (selectedState) {
        setValue('state_id', selectedState?.id);
      }

    }
  }, [data, setValue]);


  const onSubmit = handleSubmit(async (data) => {
    try {
      // if (car?.map(item => item?.plat_number)?.includes(data?.plat_number.trim())) {
      //   enqueueSnackbar(t('plat_number_already_used'), { variant: 'error' });
      //   return;
      // }
      const response = currentCar?.id ? await editCar(currentCar?.id, data) : await createCar(data);
      enqueueSnackbar(t('operation_success'));

      router.push(paths.dashboard.vehicle.root);
      reset();
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
              {/* <RHFSelect required name="car_company_id" label={t('company')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_companies?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              <RHFSelect required name="car_company_id"  label={t('company')}   disabled={currentCar?.id} >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {car_companies?.map((company) => (
                  <MenuItem key={company?.id} value={company.id}>
                    {company?.translations[0]?.name || company.key}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="car_model_id" label={t('model')} disabled={currentCar?.id} >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_companies?.find(item => item?.id == selectedCompanyId)?.models?.filter(i => car_models?.map(ii => ii.id )?.includes(i.id))?.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.translations[0]?.name || model.key}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField required name="production_year" label={t('manufacturingYear')} disabled={currentCar?.id} />



              <RHFTextField required name="plat_number" label={t('plateNumber')} error={validateUnicity(car.filter(item => item?.plat_number != currentCar?.plat_number), "plat_number", values?.plat_number)} helperText={validateUnicity(car, "plat_number", values?.plat_number) ? t('plat_number_already_exists') : null} disabled={currentCar?.id} />

              <RHFTextField required name="chassis_number" label={t('structureNo')} error={validateUnicity(car.filter(item => item?.chassis_number != currentCar?.chassis_number), "chassis_number", values?.chassis_number)} helperText={validateUnicity(car, "chassis_number", values?.chassis_number) ? t('chassis_number_already_exists') : null} disabled={currentCar?.id} />

              <RHFTextField required name="vin" label={t('serialNumber')} error={validateUnicity(car.filter(item => item?.vin != currentCar?.vin), "vin", values?.vin)} helperText={validateUnicity(car, "vin", values?.vin) ? t('vin_already_exists') : null}  disabled={currentCar?.id}  />
              <RHFTextField
                required
                name="odometer"
                label={t('odometer')}
                error={isNaN(Number(values.odometer)) || Number(values.odometer) < 0}
                helperText={
                  isNaN(Number(values.odometer))
                    ? t("odometer_must_be_number")
                    : Number(values.odometer) < 0
                      ? t("odometer_must_be_positive")
                      : null
                }
              />

              {/* <RHFTextField name="depreciation" label={t('depreciation')} /> */}
              <RHFTextField
                type={"number"}
                required
                name="passengers_capacity"
                label={t('numberOfPassengers')}
                error={values.passengers_capacity > 99}
                helperText={values.passengers_capacity > 99 ? t("passenger_capacity_must_be_less_than_100") : null}
              />
              <RHFSelect required name="color_id" label={t('vehcileColor')} >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.colors?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="spec_id" label={t('specifications')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.specs?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect required name="license_type_id" label={t('typeOfLicense')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.license_types?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.states?.filter(i => i?.system_settings?.is_selected)?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
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

UserEditForm.propTypes = {
  currentCar: PropTypes.object,
};


