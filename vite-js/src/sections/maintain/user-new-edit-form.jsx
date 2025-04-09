import * as Yup from 'yup';
import PropTypes, { number } from 'prop-types';
import { useMemo, useCallback, useEffect } from 'react';
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

import { createMaintenance, editMaintenance } from 'src/api/maintainance';
import { fDate } from 'src/utils/format-time';
import { useGetCar } from 'src/api/car';
import { ListItemText } from '@mui/material';
import { format } from 'date-fns';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import { useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentMentainance }) {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const { car } = useGetCar()
  const { data } = useValues();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object({
    state_id: Yup.number()
      .required('State ID is required')
      .positive('State ID must be a positive number')
      .integer('State ID must be an integer'),

    maintainance_type: Yup.string().required('Type is required'),

    car_id: Yup.number().required('Car is required'),
    entry_date: Yup.date().required('Entry date is required'), // Validates that the entry date is not in the future
    cause: Yup.string()
      .min(3, 'Cause must be at least 3 characters long'), // Validates that cause has a minimum length of 3
    // .required('Cause is required')

    exit_date: Yup.date().nullable(), // Allowing an empty string for exit date (since it's not required)
  });
  const defaultValues = useMemo(
    () => ({
      state_id: null, // default value for state_id
      car_id: '', // default value for car plate number
      maintainance_type: '', // default value for car plate number
      entry_date: new Date(), // default value for entry date
      cause: '', // default value for cause
      exit_date:new Date(), // default value for exit date (empty string)
    }),
    [currentMentainance]
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

  useEffect(() => {
    if (currentMentainance?.id) {
      setValue('car_plat_number', currentMentainance?.car?.plat_number);
      setValue('maintainance_type', currentMentainance?.maintainance_type);
      setValue('cause', currentMentainance?.cause);
      setValue('entry_date', currentMentainance?.entry_date ? new Date(currentMentainance?.entry_date) : new Date());
      setValue('exit_date', currentMentainance?.exit_date ? new Date(currentMentainance?.exit_date) : new Date());
      setValue('state_id', currentMentainance?.state?.id);
    }
    
    // const car_id = searchParams.get("car_id");
    // if (car_id) {
    //   // setValue('car_id', car?.find(item => item.id == car_id)?.id);
    //   setValue('car_id',car_id,{ shouldValidate: true });
    // }
  }, [currentMentainance, setValue]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log("lets do it now ");
      let body = data
      body.entry_date = format(new Date(data.entry_date), 'yyyy-MM-dd')
      body.exit_date = format(new Date(data.exit_date), 'yyyy-MM-dd')
     
      const response = currentMentainance?.id ? await editMaintenance(currentMentainance?.id, body) : await createMaintenance(body);
      enqueueSnackbar(currentMentainance ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.maintenance.root);
      console.info('DATA', body);
    } catch (error) {
      console.error(error);
      Object.values(error?.data).forEach(array => {
        array.forEach(text => {
          enqueueSnackbar(text, { variant: 'error' });
        });
      });
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
      label: 'دوري',
      value: 'periodic',
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
              {/* <RHFTextField required name="car_plat_number" label={t('plateNumber')} /> */}

              {/* <RHFSelect required name="car_plat_number" label={t('car_plat_number')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {car?.map((item) => (
                  <MenuItem key={item?.plat_number} value={item.plat_number}>
                    <ListItemText
                      primary={item?.plat_number}
                      secondary={item?.model?.company?.translations?.name}
                      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                      }}
                    />
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <CarsAutocomplete required options={car} name="car_id" label={t('car')} placeholder={t('search_by')+" "+t('plateNumber')} car_id={searchParams.get("car_id")} disabled={searchParams.get("car_id") ? true:false} />

              <DatePicker
                label={t('entryDate')}
                value={values.entry_date ? new Date(values.entry_date) : new Date()}
                required
                name="entry_date"
                format="dd/MM/yyyy"  
                onChange={(newValue) => setValue('entry_date', fDate(newValue, 'dd/MM/yyyy'))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />

              <DatePicker
                label={t('exitDate')}
                value={values.exit_date ? new Date(values.exit_date) : new Date()}
                name="exit_date"
                onChange={(newValue) => setValue('exit_date', fDate(newValue, 'dd/MM/yyyy'))}
                format="dd/MM/yyyy"  
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
                minDate={new Date()}
              />

              <RHFSelect required name="state_id" label={t('workSite')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.states?.map((option) => (
                  <MenuItem key={option?.id} value={option?.id}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField required name="cause" label={t('cause')} />

              <RHFSelect required name="maintainance_type" label={t('maintainType')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.maintenance_type_enum?.map((option) => (
                  <MenuItem key={option?.key} value={option?.key}>
                    {option?.translations[0]?.name}
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
                {!currentMentainance ? t('addNewMaintain') : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentMentainance: PropTypes.object,
};
