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
import FormControlLabel from '@mui/material/FormControlLabel';
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
  RHFUploadAvatar,
  RHFAutocomplete,
  RHFSelect,
} from 'src/components/hook-form';

import { useLocales, useTranslate } from 'src/locales';
import { useValues } from 'src/api/utils';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import { createClient, useGetClients } from 'src/api/client';
import Iconify from 'src/components/iconify';
import { Divider, FormGroup, ListItemText, MenuItem, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import { createContracts, editContracts } from 'src/api/contract';
import SelfEditTable from './SelfEditTable';
import { fDate } from 'src/utils/format-time';
import { height } from '@mui/system';
import { format } from 'date-fns';
import showError from 'src/utils/show_error';
import { includes } from 'lodash';

// ----------------------------------------------------------------------

export default function ContractNewEditForm({ contract }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues()
  const { car } = useGetCar()
  const { clients } = useGetClients()
  const { drivers } = useGetDrivers()
  const { currentLang } = useLocales()
  const attachables = [{ name: "car", id: 1, lable: { ar: "سيارة", en: "car" } }, { name: "driver", id: 2, lable: { ar: "سائق", en: "driver" } }]
  const attachables2 = { car: { ar: "سيارة", en: "car" }, driver: { ar: "سائق", en: "driver" } }
  const payment_methodes = [{ name: "deferred", lable: { ar: "دفعات", en: "deferred" } }, { name: "cash", lable: { ar: "نقدا", en: "cash" } }]

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);


  const NewUserSchema = Yup.object().shape({
    client_id: Yup.number().required('client is required'),
    payment_method_id: Yup.number().required('payment method is required'),
    duration: Yup.number(),
    clauseable_id: Yup.number(),
    clauseable_type: Yup.string(),
    start_date: Yup.string(),
    end_date: Yup.string(),
    c_start_date: Yup.string(),
    c_end_date: Yup.string(),
    cost: Yup.number(),
    // rep_name: Yup.string(),
    // rep_contact_number: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      client_id: contract?.client_id || '',
      payment_method_id: contract?.payment_method_id || "",
      // duration: c0ontract?.duration || 0,
      // clauseable_id: contract?.clauseable_id || '',
      // clauseable_type: contract?.clauseable_type || '',
      start_date: contract?.start_date || new Date(),
      end_date: contract?.end_date || tomorrow,
      c_start_date: contract?.c_start_date || new Date(),
      c_end_date: contract?.c_end_date || tomorrow,
      // cost: contract?.cost || 0,
      // rep_name: contract?.rep_name || '',
      // rep_contact_number: contract?.rep_contact_number || '',
    }),
    [contract]
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
    setValue("c_start_date", values?.start_date)
    setValue("c_end_date", values?.end_date)
  }, [values])

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [clauses, setClauses] = useState(contract?.clauses ? [...contract?.clauses] : [])
  const handleAddClause = () => {
    if(values.clauseable_id && values.cost && values.c_start_date && values.c_end_date ){
      setClauses([...clauses, { id: clauses?.length > 0 ? clauses[clauses.length - 1].id + 1 : 1, clauseable_id: values.clauseable_id, clauseable_type: values.clauseable_type, cost: values.cost, start_date: format(new Date(values.c_start_date) || new Date(), 'yyyy-MM-dd'), end_date: format(new Date(values.c_end_date) || new Date(), 'yyyy-MM-dd') }])
      setValue("clauseable_id", 0)
      setValue("clauseable_type", values.clauseable_type)
      setValue("cost", 0)
      setValue("duration", 0)
      setValue("start_date", values?.start_date || new Date())
      setValue("end_date", values?.end_date || new Date())
    }else{
      enqueueSnackbar(t("please_fill_all_values_in_clauses"), { variant: 'error' });
    }

  }
  const handleRemoveClause = (clauseable_id) => {
    setClauses([...clauses?.filter(item => item.clauseable_id != clauseable_id)])
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();

      // if(new Date(data?.start_date) <= new Date(data?.end_date)){
      //   enqueueSnackbar(t("start_date_must_be_after_end_date"), { variant: 'error' });
      //   return ;
      // }
      delete data?.id;
      let body = data
      if (body?.auto_renewal_deactivation_unity == "month" && body?.auto_renewal_deactivation > 0) {
        body.auto_renewal_deactivation_months = Number(body?.auto_renewal_deactivation)
        body.auto_renewal_deactivation_days = 0
      } else if (body?.auto_renewal_deactivation_unity == "day" && body?.auto_renewal_deactivation > 0) {
        body.auto_renewal_deactivation_days = Number(body?.auto_renewal_deactivation)
        body.auto_renewal_deactivation_months = 0
      }
      delete body?.auto_renewal_deactivation_unity
      delete body?.auto_renewal_deactivation

      if (body?.auto_renewal_duration_unity == "month" && body?.auto_renewal_duration > 0) {
        body.auto_renewal_duration_months = Number(body?.auto_renewal_duration)
        body.auto_renewal_duration_days = 0
      } else if (body?.auto_renewal_duration_unity == "day" && body?.auto_renewal_duration > 0) {
        body.auto_renewal_duration_days = Number(body?.auto_renewal_duration)
        body.auto_renewal_duration_months = 0
      }
      delete body?.auto_renewal_duration_unity
      delete body?.auto_renewal_duration



      delete body.cost
      delete body.clauseable_type
      delete body.clauseable_id
      delete body.duration
      delete body.starting_from

      body.start_date = format(new Date(body.start_date), 'yyyy-MM-dd')
      body.end_date = format(new Date(body.end_date), 'yyyy-MM-dd')

      body = { ...body, auto_renewal: checked, clauses: clauses.map(({ id, ...rest }) => rest) || [] }
      console.log("body :", body);
      const response = contract?.id ? await editContracts(contract?.id, body) : await createContracts(body);
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      router.push(paths.dashboard.clients.contracts);
    } catch (error) {
      showError(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={16}>
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
                name="client_id"
                label={t('client')}
                options={clients}
                getOptionLabel={(option) => option?.name}
                placeholder={t('choose_client')}
              />

              <RHFSelect required name="payment_method_id" label={t('payment_method')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {/* {[{ name: "deferred", lable: { ar: "دفعات", en: "deferred" } }, { name: "cash", lable: { ar: "نقدا", en: "cash" } }]?.map((type) => ( */}
                {data?.payment_methods?.filter(i => i?.system_settings?.is_selected)?.map((type) => (
                  <MenuItem key={type?.id} value={type.id}>
                    {payment_methodes?.find(item => item?.name == type?.name)?.lable[currentLang.value] || type?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <DatePicker
                required
                name="start_date"
                label={t('start_date')}
                format="dd/MM/yyyy"
                value={contract?.start_date ? new Date(contract?.start_date) : values?.start_date ? new Date(values?.start_date) : new Date()}
                onChange={(date) => setValue('start_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <DatePicker
                required
                name="end_date"
                label={t('end_date')}
                format="dd/MM/yyyy"
                value={contract?.end_date ? new Date(contract?.end_date) : values?.end_date ? new Date(values?.end_date) : new Date()}
                onChange={(date) => setValue('end_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <RHFSelect required name="type" label={t('type')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ id: "monthly", lable: t("monthly") }, { id: "daily", lable: t("daily") }]?.map((type) => (
                  <MenuItem key={type?.id} value={type.id}>
                    {type?.lable}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>
            <Box
              my={3}
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {/* <RHFSelect required name="auto_renewal" label={t('auto_renewal')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ id: true, lable: t("yes") }, { id: false, lable: t("no") }]?.map((type) => (
                  <MenuItem key={type?.id} value={type.id}>
                    {type?.lable}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <FormGroup>
                <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} label={t("auto_renewal")} />
              </FormGroup>
            </Box>
            {
              checked ?
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display={"flex"}
                  >
                    <RHFTextField name="auto_renewal_deactivation" type={"number"} label={t('auto_renewal_ractivation_mohla')} sx={{ height: "100%" }} />
                    <RHFSelect required name="auto_renewal_deactivation_unity" label={t('unity')} sx={{ width: "150px" }}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      {[{ id: "month", lable: t("month") }, { id: "day", lable: t("day") }]?.map((type) => (
                        <MenuItem key={type?.id} value={type.id}>
                          {type?.lable}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Box>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display={"flex"}
                  >
                    <RHFTextField name="auto_renewal_duration" type={"number"} label={t('auto_renewal_duration')} sx={{ height: "100%" }} />
                    <RHFSelect required name="auto_renewal_duration_unity" label={t('unity')} sx={{ width: "150px" }}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      {[{ id: "month", lable: t("month") }, { id: "day", lable: t("day") }]?.map((type) => (
                        <MenuItem key={type?.id} value={type.id}>
                          {type?.lable}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  </Box>
                </Box>
                :
                null
            }

            <Grid xs={12} md={12}>
              <SelfEditTable
                sx={{ marginTop: "10px" }}
                title={t('contract_clauses')}
                parentId={contract?.id}
                // tableData={clauses?.map(item=> ({...item,clauseableType:attachables?.find(i => i?.name == item?.clauseable_type)?.lable[currentLang?.value],total:Number(item?.cost) * Number(item?.duration),startingFrom:fDate(item?.starting_from),clauseable:clauseable_type == "car" ? car?.find(i => i?.id == item?.clauseable_id)?.model?.translations?.name+" "+car?.find(i => i?.id == item?.clauseable_id)?.plat_number:drivers?.find(i => i?.id == item?.clauseable_id)?.name})})) }
                tableData={clauses?.map(item => ({
                  ...item,
                  clauseableType: attachables?.find(i => i?.name === item?.clauseable_type)?.lable[currentLang?.value],
                  total: Number(item?.cost) * Number(item?.duration),
                  startingFrom: fDate(item?.starting_from),
                  clauseable: item?.clauseable_type == "car"
                    ? `${car?.find(i => i?.id === item?.clauseable_id)?.model?.translations?.name} ${car?.find(i => i?.id === item?.clauseable_id)?.plat_number}`
                    : drivers?.find(i => i?.id === item?.clauseable_id)?.name
                }))}
                setTableData={setClauses}
                tableLabels={[
                  { id: "clauseableType", key_to_update: "clauseable_type", label: t("clause_type"), editable: false, creatable: true, type: "select", options: attachables?.map((item) => ({ value: item?.name, lable: item?.lable[currentLang.value] })), width: 160 },
                  { id: "clauseable", key_to_update: "clauseable_id", label: t("clause"), editable: false, creatable: true, type: "car_autocomplete", options: car, width: 240 },
                  { id: "cost", key_to_update: "cost", label: t("cost") + " (" + t(values?.type == "monthly" ? "month" : "day") + ")", editable: true, creatable: true, type: "number", width: 160 },
                  // { id: "duration", key_to_update: "duration", label: t("duration"), editable: true, creatable: true, type: "number", width: 120 },
                  // { id: "total", key_to_update: "total", label: t("total"), editable: false, creatable: false, type: "number", width: 160 },
                  { id: "start_date", key_to_update: "start_date", label: t("start_date"), editable: true, creatable: true, type: "date", width: 180 },
                  { id: "end_date", key_to_update: "end_date", label: t("end_date"), editable: true, creatable: true, type: "date", width: 180 },
                ]}
              />
            </Grid>


            {/* <div style={{ marginTop: '30px', border: "1px solid gray", padding: "15px", borderRadius: '10px' }}> */}
            {/* <Label >{t("addClause")}</Label> */}


            {/* {clauses.map((row, index) => (
                <Box key={index} rowGap={3} columnGap={1} alignItems={"center"} display="grid" gridTemplateColumns={{ xs: 'repeat(6, 1fr)', sm: 'repeat(6, 1fr)', }} sx={{ marginTop: "10px" }}>
                  <Label >
                    {attachables2[row?.clauseable_type][currentLang?.value]}
                  </Label>
                  <Label >{car.find(item => item.id == row?.clauseable_id).plat_number}</Label>
                  <Label >{row?.cost + ".00"}</Label>
                  <Label >{row?.duration + " " + data?.unit_enum[0]?.translations[0]?.name}</Label>
                  <Label >{row?.cost * row?.duration + ".00"}</Label>
                  <Iconify onClick={() => handleRemoveClause(row?.clauseable_id)} icon="solar:trash-bin-trash-bold" />
                </Box>
              ))} */}



            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(5, 1fr)',
              }}
              sx={{ marginTop: "30px" }}
            >

              <RHFSelect name="clauseable_type" label={t('clause_type')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {attachables?.map((type) => (
                  <MenuItem key={type?.id} value={type.name}>
                    {type?.lable[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect>
              {
                values.clauseable_type == "car" ?
                  <CarsAutocomplete options={car?.filter(i => i?.status?.key == "available" && !clauses?.map(ii => ii?.clauseable_type == "car")?.map(ii => ii?.clauseable_id)?.includes(i?.id))} name="clauseable_id" label={t('car')} placeholder={t('search_by') + " " + t("plateNumber")} />
                  : values.clauseable_type == "driver" ?
                    <SimpleAutocomplete options={drivers?.filter(i => !i.is_rented)} name="clauseable_id" label={t('drivers')} placeholder={t('search_by') + " " + t("name")} />
                    :
                    <RHFSelect disabled={!values.clauseable_type} name="clauseable_id" label={t('clause')}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <MenuItem value={"1"}>
                        name
                      </MenuItem>
                    </RHFSelect>
              }
              {/* <RHFTextField name="duration" label={t('duration')} /> */}
              <RHFTextField name="cost" label={t('cost')} type={"number"} />
              <DatePicker
                // required
                name="c_start_date"
                label={t('start_date')}
                format="dd/MM/yyyy"
                value={values?.c_start_date || values?.start_date || new Date()}
                onChange={(date) => setValue('c_start_date', date || values.start_date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <DatePicker
                // required
                name="c_end_date"
                label={t('end_date')}
                format="dd/MM/yyyy"
                value={values?.c_end_date || values?.end_date || new Date()}
                onChange={(date) => setValue('c_end_date', date || values?.end_date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button type="button" onClick={handleAddClause} variant="contained" >
                {t("addClause")}
              </Button>
            </Stack>

            {/* </div> */}


            {
              clauses?.length > 0 ?

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!contract.id ? t('addNewContract') : t('saveChange')}
                  </LoadingButton>
                </Stack>
                :
                null
            }


          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

ContractNewEditForm.propTypes = {
  contract: PropTypes.object,
};



function AppNewInvoiceRow({ row }) {


  return (
    <>
      <TableRow>
        <TableCell>{row?.name}</TableCell>
        <TableCell>{row?.contact_number}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Download
        </MenuItem>

        <MenuItem onClick={handlePrint}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={handleShare}>
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover> */}
    </>
  );
}

AppNewInvoiceRow.propTypes = {
  row: PropTypes.object,
};
