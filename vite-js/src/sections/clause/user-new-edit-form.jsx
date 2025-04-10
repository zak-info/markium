import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect, useState } from 'react';
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
import { useGetCar, useGetCarPeriodicMaintenance } from 'src/api/car';
import { addNewMaintenanceClause } from 'src/api/clauses';
import { useGetMaintenanceSpecs, useShowMaintenance } from 'src/api/maintainance';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import { TextField } from '@mui/material';
import RHFTextField2 from 'src/components/hook-form/rhf-text-field2';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ maintenance_id, currentClause, setTableData, setAddProcess }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const { car } = useGetCar();
  console.log(" maintenance_id : ", maintenance_id);
  const { maintenance_specs } = useGetMaintenanceSpecs()
  const { maintenance } = useShowMaintenance(maintenance_id)
  console.log("maintenance :", maintenance);
  const { maintenance: periodic_maintenance } = useGetCarPeriodicMaintenance(maintenance?.car_id);
  console.log("periodic_maintenance :", periodic_maintenance);
  const validationSchema = Yup.object({
    cost: Yup.number().nullable(),
    quantity: Yup.number(),
    piece_status: Yup.string().required('piece_status is required'),
    spec_id: Yup.string(),
    period_maintenance_id: Yup.string(),
    note: Yup.string(),
  });
  const defaultValues = useMemo(
    () => ({
      cost: currentClause?.cost || 0,
      quantity: currentClause?.quantity || 0,
      piece_status: currentClause?.piece_status || "",
      note: currentClause?.note || "",
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

  const [credentials, setCredentials] = useState({ cost: 0, quantity: 0 })
  useEffect(() => {
    console.log("credentiald : ", credentials);
  }, [credentials])

  const convertToLatinNumbers = (input) => {
    if (!input) return input;
    return input.replace(/[٠-٩]/g, (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  const convertToArabicNumbers = (input) => {
    if (!input) return input;
    return input.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  const onSubmit = handleSubmit(async (donnes) => {
    try {
      console.log("lest edit clause");
      let body = donnes;
      delete body?.total
      let maintenace_spec = {}
      body.maintenance_id = Number(maintenance_id);
      if (!body?.note) {
        body.note = "--"
      }

      
      let clause_credentials = {}
      // if (body?.spec_or_period == "not-periodic") {
      //   body.spec_id = Number(body?.spec_id);
      //   maintenace_spec = data?.maintenance_specifications?.find(item => item.id = Number(body?.spec_id))
      //   clause_credentials = { is_periodic: false, related_id: body?.spec_id }
      //   delete body?.period_maintenance_id
      // } else {
      //   body.period_maintenance_id = Number(body?.period_maintenance_id);
      //   maintenace_spec = data?.maintenance_specifications?.find(item => item.id = Number(body?.period_maintenance_id))
      //   clause_credentials = { is_periodic: true, related_id: body?.period_maintenance_id }
      //   delete body?.spec_id
      // }
      clause_credentials = { is_periodic: false, related_id: body?.spec_id }
      maintenace_spec = data?.maintenance_specifications?.find(item => item.id = Number(body?.spec_id))
      delete body?.spec_or_period
      console.log("body : ", body);
      console.log("lets create :", body);
      const dd = { ...body, cost: Number(credentials?.cost), quantity: Number(credentials?.quantity) }
      console.log("dddddddddddddddd : ", dd);
      if (currentClause?.id) {
      } else {

        await addNewMaintenanceClause(dd);
      }
      reset();
      enqueueSnackbar(currentClause?.id ? 'Update success!' : 'Create success!');
      // setTableData(prev => [...prev, { ...clause_credentials, maintenance_spec: maintenace_spec?.name, cost: Number(credentials.cost), piece_status: body?.piece_status, quantity: Number(credentials.quantity), unit: maintenace_spec?.unit }])
      setAddProcess(true);
      router.reload();
    } catch (error) {
      console.error(error);
      // enqueueSnackbar(error?.message ? error?.message : "Somthing Went Wrong", { variant: 'error' });
      Object.values(error?.data).forEach(array => {
        array.forEach(text => {
          enqueueSnackbar(text, { variant: 'error' });
        });
      });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: convertToLatinNumbers(value),
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} >
        <Grid xs={12} md={12} sx={{ m: "10px" }}>
          {/* <Card sx={{ p: 3, fontSize: '0.4rem' }}> */}
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(7, 1fr)',
            }}
          >
            {/* <RHFSelect name="spec_or_period" label={t('clause_type')}  >
              <Divider sx={{ borderStyle: 'dashed' }} />
              {[{ name: "periodic", lable: t("periodic") }, { name: "not-periodic", lable: t("not_periodic") }].map((option) => (
                <MenuItem key={option?.name} value={option?.name}>
                  {option?.lable}
                </MenuItem>
              ))}
            </RHFSelect> */}
            {/* {
              values?.spec_or_period == "periodic" ?
                <RHFSelect type="number" name="period_maintenance_id" label={t('periodic')}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {periodic_maintenance?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                : */}
            <RHFSelect type="number" name="spec_id" label={t('clause')}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {maintenance_specs?.filter(item => !item?.is_periodic)?.map((option) => (
                <MenuItem key={option?.name} value={option?.id}>
                  {option?.name}
                </MenuItem>
              ))}
            </RHFSelect>
            {/* } */}

            {/* <RHFTextField name="cost" label={t('cost')} type={"number"} sx={{ width: "100%" }} />
              <RHFTextField name="quantity" label={t('qte')} type={"number"} sx={{ width: "100%" }} /> */}

            <TextField
              type="text"
              label={t('cost')}
              name="cost"
              value={credentials?.cost}
              onChange={handleChange}
            />

            <TextField
              type="text"
              name="quantity"
              label={t('qte')}
              value={credentials?.quantity}
              onChange={handleChange}
            />
            <RHFSelect name="piece_status" label={t('piece_status')} sx={{ width: "100%" }}>
              <Divider sx={{ borderStyle: 'dashed' }} />
              {data?.piece_status_enum?.map((option) => (
                <MenuItem key={option?.key} value={option?.key}>
                  {option?.translations[0]?.name}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="total" label={t('total')} type={"number"} sx={{ width: "100%" }} disabled value={credentials?.quantity * credentials?.cost} />
            {/* <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          > */}
            <RHFTextField name="note" label={t('note')} />
            {/* </Box> */}
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentClause ? t('addClause') : t('saveChange')}
            </LoadingButton>
          </Stack>
          {/* </Card> */}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentClause: PropTypes.object,
};
