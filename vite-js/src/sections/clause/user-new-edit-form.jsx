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
import { useGetCar, useGetCarPeriodicMaintenance } from 'src/api/car';
import { addNewMaintenanceClause } from 'src/api/clauses';
import { useGetMaintenanceSpecs, useShowMaintenance } from 'src/api/maintainance';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ maintenance_id, currentClause, setTableData }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  const { car } = useGetCar();
  console.log(" maintenance_id : ",maintenance_id);
  const { maintenance_specs } = useGetMaintenanceSpecs()
  const { maintenance } = useShowMaintenance(maintenance_id)
  console.log("maintenance :",maintenance);
  const { maintenance: periodic_maintenance } = useGetCarPeriodicMaintenance(maintenance?.car_id);
  console.log("periodic_maintenance :",periodic_maintenance);
  const validationSchema = Yup.object({
    cost: Yup.number().required('cost is required'),
    piece_status: Yup.string().required('piece_status is required'),
    spec_id: Yup.string(),
    period_maintenance_id: Yup.string(),
    note: Yup.string(),
    // note_en: Yup.string(),
  });
  const defaultValues = useMemo(
    () => ({
      cost: currentClause?.cost || '',
      piece_status: currentClause?.piece_status || "",
      // spec_id: currentClause?.spec_id || '',
      // period_maintenance_id: currentClause?.period_maintenance_id || '',
      note: currentClause?.note || "",
      // note_en: currentClause?.note_en || '',
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
    // if (currentClause?.id && currentClause?.car) {
    //   const selectedCar = car?.find(
    //     (option) =>
    //       option?.id == 1
    //   );
    //   // If selectedCar is found, set the car_id value
    //   if (selectedCar) {
    //     setValue('car_id', selectedCar.id); // Set the selected car's ID to car_id
    //   }
    // }
    console.log("currentClause : ", currentClause);

  }, [car, setValue]);

  const onSubmit = handleSubmit(async (donnes) => {
    try {
      console.log("lest edit clause");
      const body = donnes;
      delete body?.total
      let maintenace_spec = {}
      body.maintenance_id = Number(maintenance_id);
      if (body?.spec_or_period == "not-periodic") {
        body.spec_id = Number(body?.spec_id);
        maintenace_spec = data?.maintenance_specifications?.find(item => item.id = Number(body?.spec_id))
        delete body?.period_maintenance_id
      } else {
        body.period_maintenance_id = Number(body?.period_maintenance_id);
        maintenace_spec = data?.maintenance_specifications?.find(item => item.id = Number(body?.period_maintenance_id))
        delete body?.spec_id
      }

      delete body?.spec_or_period
      console.log("body : ", body);

      // body.start_date = format(data.start_date, 'yyyy-MM-dd');
      if (currentClause?.id) {
        //   delete body.license_number
        //   delete body.residence_permit_number

        //   console.log("lets edit : ", body);
        // const res = await editDriver(currentClause?.id, body);
        //   console.log("res : ", res);
      } else {
        console.log("lets create :", body);
        await addNewMaintenanceClause(body);
        // console.log("res : ", res);
      }
      reset();
      enqueueSnackbar(currentClause?.id ? 'Update success!' : 'Create success!');
      // router.push(paths.dashboard.maintenance.details(maintenance_id));
      // router.reload();
      setTableData(prev => [...prev, { related_id:maintenace_spec?.id,is_periodic: maintenace_spec?.is_periodic, maintenance_spec: maintenace_spec?.name, cost: Number(body.cost), piece_status: body?.piece_status, quantity: body.quantity, unit: maintenace_spec?.unit }])
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message ? error?.message : "Somthing Went Wrong", { variant: 'error' });

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
          <Card sx={{ p: 3, fontSize: '0.4rem' }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(6, 1fr)',
              }}
            >
              {/* <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}> */}
              <RHFSelect name="spec_or_period" label={t('clause_type')}  >
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ name: "periodic",lable:t("periodic") }, { name: "not-periodic",lable:t("not_periodic") }].map((option) => (
                  <MenuItem key={option?.name} value={option?.name}>
                    {option?.lable}
                  </MenuItem>
                ))}
              </RHFSelect>
              {
                values?.spec_or_period == "periodic" ?
                  <RHFSelect type="number" name="period_maintenance_id" label={t('periodic')}>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {periodic_maintenance?.map((option) => (
                      <MenuItem key={option?.id} value={option?.id}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  :
                  <RHFSelect type="number" name="spec_id" label={t('not_periodic')}>
                    <Divider sx={{ borderStyle: 'dashed' }} />
                    {maintenance_specs?.filter(item => !item?.is_periodic)?.map((option) => (
                      <MenuItem key={option?.name} value={option?.id}>
                        {option?.name}
                      </MenuItem>
                    ))}
                  </RHFSelect>
              }
              {/* </div> */}
              <RHFTextField name="cost" label={t('cost')} type={"number"} sx={{ width: "100%" }} />
              {/* <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}> */}
              <RHFTextField name="quantity" label={t('qte')} type={"number"} sx={{ width: "100%" }} />
              <RHFSelect name="piece_status" label={t('piece_status')} sx={{ width: "100%" }}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.piece_status_enum.map((option) => (
                  <MenuItem key={option?.key} value={option?.key}>
                    {option?.translations[0]?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* </div> */}
              <RHFTextField name="total" label={t('total')} type={"number"} sx={{ width: "100%" }} disabled value={values?.quantity * values?.cost} />






              {/* <RHFTextField name="note_en" label={t('note_en')} /> */}

            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextarea name="note" label={t('note')} sx={{ mt: "10px" }} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentClause ? t('addClause') : t('saveChange')}
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
