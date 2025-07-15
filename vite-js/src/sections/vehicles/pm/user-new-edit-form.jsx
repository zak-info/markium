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
import { fDate } from 'src/utils/format-time';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ tableData, car_id, currentClause }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const validationSchema = Yup.object({
    period_value: Yup.number()
      .required(t('period_value_required')),

    period_unit: Yup.string()
      .required(t('period_unit_required')),

    spec_id: Yup.number()
      .required(t('periodic_maintenance_required')),

    // last_value: Yup.required(t('last_value_required')),
  });

  const defaultValues = useMemo(
    () => ({
      period_value: currentClause?.period_unit || 0,
      last_value: currentClause?.last_value || null,
      period_unit: currentClause?.piece_status || "",
      spec_id: currentClause?.spec_id || null,
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

  useEffect(() => {
    if (values.period_unit == "month") {
      setValue("last_value", new Date())
    } else if (values.period_unit == "km") {
      setValue("last_value", 0)
    }
  }, [values.period_unit])


  const onSubmit = handleSubmit(async (data) => {
    try {
      let body = data;
      if (values.period_unit == "month") {
        body.last_value = format(new Date(data.last_value), 'yyyy-MM-dd')
      }
      console.log("data : ", body);

      if (currentClause?.id) {

      } else {

        console.log("lets create :", car_id);
        await addNewPm(car_id.id, { ...body });
      }
      reset();
      enqueueSnackbar(currentClause?.id ? 'Update success!' : 'Create success!');
      router.reload();
    } catch (error) {
      console.error(error);
      showError(error)

    }
  });


  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} >
        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFSelect
                name="spec_id"
                label={t('periodic_maintenances')}
                sx={{ width: '100%' }}
              >
                <Divider sx={{ borderStyle: 'dashed' }} />

                {(data?.maintenance_specifications || [])
                  .filter(
                    (item) =>
                      item?.is_periodic &&
                      !tableData.some((i) => i?.id === item?.id)
                  )
                  .map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.name}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >


              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="period_value" label={t('maintenance_period_value')} type={"number"} sx={{ width: "100%" }} />
                <RHFSelect name="period_unit" label={t('maintenance_period_unit')} sx={{ width: "100%" }}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {data?.unit_enum?.map((option, index) => (
                    <MenuItem key={index} value={option.key}>
                      {option?.translations[0]?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                </Box>
                {
                  values?.period_unit == 'km' ?
                    <RHFTextField name="last_value" label={t('last_value')} type="number" sx={{ width: "100%" }} />
                    : values?.period_unit == 'month' ?
                      <DatePicker
                        label={t('last_value')}
                        format="dd/MM/yyyy"
                        value={values.last_value ? new Date(values.last_value) : new Date()}
                        name="last_value"
                        onChange={(newValue) => setValue('last_value', fDate(newValue, 'yyyy-MM-dd'))}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      // minDate={new Date()}
                      />
                      :
                      <RHFTextField disabled={true} name="last_value" label={t('last_value')} sx={{ width: "100%" }} />

                }



              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentClause ? t('addNewPeriodicMaintenance') : t('saveChange')}
                </LoadingButton>
              </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentClause: PropTypes.object,
};
