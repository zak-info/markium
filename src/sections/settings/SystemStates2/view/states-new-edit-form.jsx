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
import { addNewClause } from 'src/api/clauses';
import { useGetMaintenanceSpecs } from 'src/api/maintainance';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import { addNewPm } from 'src/api/pm';
import { useGetContracts } from 'src/api/contract';
import { useGetClients } from 'src/api/client';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import { fDate } from 'src/utils/format-time';
import { createClaim } from 'src/api/claim';
import { createMainSpec, editMainSpec } from 'src/api/settings';

// ----------------------------------------------------------------------

export default function StatesNewEditForm({ currentMainSpec }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const { currentLang } = useLocales();
  const validationSchema = Yup.object({
    is_periodic: Yup.boolean().required('is periodic is required'),
    name: Yup.string().required('name is required'),
    period_value: Yup.number().required('period value is required'),
    period_unit: Yup.string().required('period unit is required'),
    note: Yup.string().required('note date is required'),
  });
  const defaultValues = useMemo(
    () => ({
      name: currentMainSpec?.name || "",
      is_periodic: currentMainSpec?.is_periodic || "",
      period_value: currentMainSpec?.period_value || 0,
      period_unit: currentMainSpec?.period_unit || "",
      note: currentMainSpec?.note || "",
    }),
    [currentMainSpec]
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
    console.log("currentMainSpec :", currentMainSpec);
    if (currentMainSpec?.id) {
      setValue("name", currentMainSpec?.name)
      setValue("is_periodic", currentMainSpec?.is_periodic)
      setValue("period_value", currentMainSpec?.period_value)
      setValue("period_unit", currentMainSpec?.period_unit)
      setValue("note", currentMainSpec?.note)
    }
  }, [data, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const body = data;
      console.log("data : ", data);

      if (currentMainSpec?.id) {
        delete body?.name
        await editMainSpec(currentMainSpec?.id, { ...body, is_periodic: body?.is_periodic == "true" ? true : false });

      } else {
        // await createMainSpec({...body,icon:"lmhm",is_periodic: body?.is_periodic == "true" ? true:false});
        console.log("data spec :", { ...body, is_periodic: body?.is_periodic == "true" ? true : false });
      }
      reset();
      enqueueSnackbar(currentMainSpec?.id ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.settings.root);
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
              }}>
              <RHFTextField disabled={!!currentMainSpec?.id ? true : false} name="name" label={t('name')} />
              <RHFSelect required name="is_periodic" label={t('is_periodic')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ value: "true", lable: { ar: "نعم", en: "true" } }, { value: "false", lable: { ar: "لا", en: "false" } }]?.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.lable[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="period_value" label={t('period_value')} type={"number"} />
              <RHFSelect required name="period_unit" label={t('period_unit')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.unit_enum?.map((option, index) => (
                  <MenuItem key={index} value={option.key}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField name="note" label={t('note')} />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentMainSpec ? t('addMaintenanceItem') : t('saveChange')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

StatesNewEditForm.propTypes = {
  currentMainSpec: PropTypes.object,
};
