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

export default function ClaimNewEditForm({ currentClause }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const { contracts } = useGetContracts();
  const { clients } = useGetClients();
  const validationSchema = Yup.object({
    contract_id: Yup.number().required('contract is required'),
    amount: Yup.number().required('amount is required'),
    paiment_date: Yup.string().required('paiment date is required'),
  });
  const defaultValues = useMemo(
    () => ({
      contract_id: currentClause?.period_unit || "",
      amount: currentClause?.last_value || 0,
      paiment_date: currentClause?.piece_status || "",
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

  const values = watch();


  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = data;
      console.log("data : ", data);

      if (currentClause?.id) {

      } else {
        await createClaim(body);
      }
      reset();
      enqueueSnackbar(currentClause?.id ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.clients.claims);
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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} >
        <Grid xs={12} md={12}>
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
              <SimpleAutocomplete
                name="contract_id"
                label={t('contract')}
                options={contracts}
                getOptionLabel={(option) => clients?.find(item => item.id == option?.client_id).name + " " + fDate(option?.created_at)}
                placeholder='choose client'
              />
              <RHFTextField name="amount" label={t('amount')} type={"number"} />
              <DatePicker
                label={t('paiment date')}
                format="dd/MM/yyyy"  
                value={values?.paiment_date ? new Date(values?.paiment_date) : new Date()}
                required
                name="paiment_date"
                onChange={(newValue) => setValue('paiment_date', fDate(newValue, 'yyyy-MM-dd'))}
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
                {!currentClause ? t('addNewClause') : t('saveChange')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

ClaimNewEditForm.propTypes = {
  currentClause: PropTypes.object,
};
