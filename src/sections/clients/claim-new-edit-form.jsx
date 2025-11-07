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
import { keyBy } from 'lodash';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function ClaimNewEditForm({ contract, currentClause, setTableData, contract_id }) {
  const router = useRouter();
  console.log(contract_id);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  // const { data } = useValues();
  // const { contracts } = useGetContracts();
  // const { clients } = useGetClients();
  const validationSchema = Yup.object({
    // contract_id: Yup.number().required('contract is required'),
    amount: Yup.number().positive(t("amount_must_be_positive")).required(t("amount_is_required")),
    paiment_date: Yup.string().required(t("paiment_date_is_required")),
  });
  const defaultValues = useMemo(
    () => ({
      // contract_id: contract_id,
      amount: currentClause?.amount || 0,
      paiment_date: currentClause?.paiment_date || format(new Date(),"yyyy-MM-dd"),
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
        await createClaim({ contract_id, ...body, contract_period_id: contract?.period?.id });
      }
      reset();
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      // router.push(paths.dashboard.clients.claims);
      setTableData(prev => [
        ...(prev || []),
        {
          contract_id,
          ...body,
          date:  fDate(new Date()),
          payment_date: fDate(new Date(data?.paiment_date)),
          status: {
            key:'due_claim',
            translations: [{ name: t("not_yet") }]
          },
          gstatus: t("not_yet"),
        }
      ]);
    } catch (error){
      showError(error)
    }
  });



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
              {/* <SimpleAutocomplete
                name="contract_id"
                label={t('contract')}
                options={contracts}
                getOptionLabel={(option) => clients?.find(item => item.id == option?.client_id).name + " " + fDate(option?.created_at)}
                placeholder='choose client'
              /> */}
              <RHFTextField name="amount" label={t('amount')} type={"number"} />
              <DatePicker
                label={t('paiment_date')}
                value={values?.paiment_date ? new Date(values?.paiment_date) : new Date()}
                required
                name="paiment_date"
                format="dd/MM/yyyy"
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
                {!currentClause ? t('add_new_claim') : t('save_change')}
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
