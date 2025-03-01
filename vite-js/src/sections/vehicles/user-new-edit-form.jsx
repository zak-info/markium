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
import { createCar, editCar } from 'src/api/car';
import { useValues } from 'src/api/utils';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentCar }) {
  const router = useRouter();
  console.log("currentCar : ", currentCar);

  // const { company } = useGetCompany();

  const { data } = useValues();
  // const { SystemData } = useContext(DataContext);
  // const [data, setData] = useState(SystemData);
  // useEffect(() => {
  //   setData(SystemData)
  //   console.log("SystemData : ",SystemData);
  // }, [SystemData])
  // const { contracts } = useGetContracts()
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    production_year: Yup.number().required('Production year is required').positive().integer(),
    plat_number: Yup.string().required('Plate number is required'),
    chassis_number: Yup.string()
      .length(17, 'يجب أن يتكون الرقم الهيكل من 17 خانة ')
      .required('Chassis number is required'),
    vin: Yup.string()
      .length(9, 'يجب أن يتكون الرقم التسلسلي من 9 خانة ')
      .required('VIN is required')
      .label('Vin'),
    passengers_capacity: Yup.number()
      .required('Passenger capacity is required')
      .positive()
      .integer(),
    odometer: Yup.number().nullable().positive().required('odometer is required'),
    depreciation: Yup.number()
      .nullable()
      .min(0, 'Depreciation cannot be negative')
      .test('is-decimal', 'يجب أن يكون الاستهلاك رقم عشري مع حدين عشريين كحد أقصى', (value) =>
        (value + '').match(/^\d*\.{1}\d*$/)
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
      const response = currentCar?.id ? await editCar(currentCar?.id, data) : await createCar(data);
      enqueueSnackbar(currentCar?.id ? "Update Success!!!" : "Insertion Success!!!");
      router.push(paths.dashboard.vehicle.root);
      reset();
    } catch (error) {
      console.error(error);
      Object.values(error?.data).forEach(array => {
        array.forEach(text => {
          enqueueSnackbar(text, { variant: 'error' });
        });
      });
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

              <RHFSelect required name="car_company_id" label={t('company')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_companies?.map((company) => (
                  <MenuItem key={company?.id} value={company.id}>
                    {company?.translations?.name || company.key}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField required name="production_year" label={t('manufacturingYear')} />


              <RHFSelect required name="car_model_id" label={t('model')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_companies?.find(item => item?.id == selectedCompanyId)?.models?.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.translations?.name || model.key}
                  </MenuItem>
                ))}
              </RHFSelect>



              {/* <RHFSelect required name="car_model_id" label={t('model')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.car_model?.map((option) => (
                  <MenuItem key={option?.translations?.name} value={option?.id}>
                    {option?.translations?.name}
                  </MenuItem>
                ))}
              </RHFSelect> */}

              <RHFTextField required name="plat_number" label={t('plateNumber')} />

              <RHFTextField required name="chassis_number" label={t('structureNo')} />

              <RHFTextField required name="vin" label={t('serialNumber')} />
              <RHFTextField required name="odometer" label={t('odometer')} />
              <RHFTextField name="depreciation" label={t('depreciation')} />
              <RHFTextField
                type="number"
                required
                name="passengers_capacity"
                label={t('numberOfPassengers')}
              />
              <RHFSelect required name="color_id" label={t('vehcileColor')} >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.colors?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="spec_id" label={t('specifications')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.specs?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect required name="license_type_id" label={t('typeOfLicense')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.license_types?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.states?.map((option) => (
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

UserNewEditForm.propTypes = {
  currentCar: PropTypes.object,
};


