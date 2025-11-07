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

import { addNewDriver, editDriver, useGetDrivers } from 'src/api/drivers';

import { useValues } from 'src/api/utils';
import { attacheCarToDriver, detacheCarToDriver, useGetCar } from 'src/api/car';
import { addNewClause } from 'src/api/clauses';
import { useGetMaintenanceSpecs } from 'src/api/maintainance';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import { addNewPm } from 'src/api/pm';
import { useGetContracts } from 'src/api/contract';
import { useGetClients } from 'src/api/client';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import { fDate } from 'src/utils/format-time';
import { createClaim } from 'src/api/claim';

// ----------------------------------------------------------------------

export default function CarDettachForm({ car_id,driver_id, currentClause }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { drivers } = useGetDrivers();
  const validationSchema = Yup.object({
  });
  const defaultValues = useMemo(
    () => ({
    }),
    [currentClause]
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      await detacheCarToDriver({car_id,driver_id});
      enqueueSnackbar('Dettached success!');
      router.reload();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : "Somthing Went Wrong", { variant: 'error' });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} sx={{ width:"100%" }}>
        <Grid xs={12} md={16}>
          <Stack alignItems="flex-end" direction="row" >
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t('Dettach driver')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

CarDettachForm.propTypes = {
  currentClause: PropTypes.object,
};
