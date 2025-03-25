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

export default function EditExitDate({ currentMentainance,close }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object({
    exit_date: Yup.date().required('State ID is required') // Allowing an empty string for exit date (since it's not required)
  });
  const defaultValues = useMemo(
    () => ({
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
      setValue('exit_date', currentMentainance?.exit_date ? new Date(currentMentainance?.exit_date) : new Date());
    }
  }, [currentMentainance, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let body = data
      body.exit_date = format(new Date(data.exit_date), 'yyyy-MM-dd')
      const response = await editMaintenance(currentMentainance?.id, body);
      enqueueSnackbar(currentMentainance ? 'Update success!' : 'Create success!');
      close()
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
        <Grid xs={12} md={20}>
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

EditExitDate.propTypes = {
  currentMentainance: PropTypes.object,
};
