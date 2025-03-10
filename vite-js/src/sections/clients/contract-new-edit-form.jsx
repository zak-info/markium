import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback, useState } from 'react';
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
import { Divider, ListItemText, MenuItem, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import { createContracts } from 'src/api/contract';

// ----------------------------------------------------------------------

export default function ContractNewEditForm({ currentUser }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues()
  const { car } = useGetCar()
  const { clients } = useGetClients()
  const { drivers } = useGetDrivers()
  const { currentLang } = useLocales()
  const attachables = [{ name: "car", id: 1,lable: { ar: "سيارة", en: "car" } }, { name: "driver", id: 2,lable: { ar: "سائق", en: "driver" } }]
  const attachables2 = { car:{ ar: "سيارة", en: "car" } ,driver:{ ar: "سائق", en: "driver" }} 

  const NewUserSchema = Yup.object().shape({
    client_id: Yup.number().required('client is required'),
    payment_method: Yup.string().required('payment method is required'),
    duration: Yup.number(),
    clauseable_id: Yup.number(),
    clauseable_type: Yup.string(),
    starting_from: Yup.string(),
    cost: Yup.number(),
    // rep_name: Yup.string(),
    // rep_contact_number: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      client_id: currentUser?.client_id || '',
      payment_method: currentUser?.payment_method || '',
      duration: currentUser?.duration || 0,
      clauseable_id: currentUser?.clauseable_id || '',
      clauseable_type: currentUser?.clauseable_type || '',
      starting_from: currentUser?.starting_from || "",
      cost: currentUser?.cost || 0,
      // rep_name: currentUser?.rep_name || '',
      // rep_contact_number: currentUser?.rep_contact_number || '',
    }),
    [currentUser]
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

  const [clauses, setClauses] = useState([])
  const handleAddClause = () => {
    setClauses([...clauses, { id: clauses?.length > 0 ? clauses[clauses.length - 1].id + 1 : 1, clauseable_id: values.clauseable_id, clauseable_type: values.clauseable_type, duration: values.duration, cost: values.cost,starting_from:values?.starting_from }])
    setValue("clauseable_id", 0)
    setValue("clauseable_type", " ")
    setValue("cost", 0)
    setValue("duration", 0)
    setValue("starting_from", new Date())

  }
  const handleRemoveClause = (clauseable_id) => {
    setClauses([...clauses?.filter(item => item.clauseable_id != clauseable_id)])
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      console.log(data);
      delete data?.id;
      const response = currentUser?.id ? await editDocument(currentUser?.id, data) : await createContracts({ client_id: data?.client_id, payment_method: data?.payment_method, clauses:clauses.map(({ id, ...rest }) => rest) });
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.clients.contracts);
    } catch (error) {
      Object.values(error?.data).forEach(array => {
        array.forEach(text => {
          enqueueSnackbar(text, { variant: 'error' });
        });
      });
      console.error(error);
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

  const options = ['نيسان', 'تويتا'];
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={10}>
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

              <RHFSelect required name="payment_method" label={t('payment_method')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ name: "deferred", lable: { ar: "دفعات", en: "deferred" } }, { name: "cash", lable: { ar: "نقدا", en: "cash" } }]?.map((type) => (
                  <MenuItem key={type?.name} value={type.name}>
                    {type?.lable[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect>


            </Box>


            <div style={{ marginTop: '30px', border: "1px solid gray", padding: "15px", borderRadius: '10px' }}>
              <Label >{t("addClause")}</Label>


              {clauses.map((row, index) => (
                <Box key={index} rowGap={3} columnGap={1} alignItems={"center"} display="grid" gridTemplateColumns={{ xs: 'repeat(6, 1fr)', sm: 'repeat(6, 1fr)', }} sx={{ marginTop: "10px" }}>
                  <Label >
                    { attachables2[row?.clauseable_type][currentLang?.value]}
                  </Label>
                  <Label >{car.find(item => item.id == row?.clauseable_id).plat_number}</Label>
                  <Label >{row?.cost + ".00"}</Label>
                  <Label >{row?.duration +" "+ data?.unit_enum[0]?.translations[0]?.name}</Label>
                  <Label >{row?.cost * row?.duration + ".00"}</Label>
                  <Iconify onClick={() => handleRemoveClause(row?.clauseable_id)} icon="solar:trash-bin-trash-bold" />
                </Box>
              ))}



              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ marginTop: "30px" }}
              >

                <RHFSelect name="clauseable_type" label={t('attachment_type')}>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {attachables?.map((type) => (
                    <MenuItem key={type?.id} value={type.name}>
                      {type?.lable[currentLang.value]}
                    </MenuItem>
                  ))}
                </RHFSelect>
                {
                  values.clauseable_type == "car" ?
                    <CarsAutocomplete options={car} name="clauseable_id" label={t('car')} placeholder='filter with plat_number' />
                    : values.clauseable_type == "driver" ?
                      <SimpleAutocomplete options={drivers} name="clauseable_id" label={t('drivers')} placeholder='filter with name' />
                      :
                      <RHFSelect disabled={!values.clauseable_type} name="clauseable_id" label={t('attachable')}>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem value={"1"}>
                          name
                        </MenuItem>
                      </RHFSelect>
                }
                <RHFTextField name="duration" label={t('duration')} />
                <RHFTextField name="cost" label={t('cost')} type={"number"} />
                <DatePicker
                  required
                  name="starting_from"
                  label={t('starting_from')}
                  format="dd/MM/yyyy"  
                  value={values?.starting_from || new Date()}
                  onChange={(date) => setValue('starting_from', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="button" onClick={handleAddClause} variant="contained" loading={false}>
                  {t("addClause")}
                </LoadingButton>
              </Stack>

            </div>


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? t('addNewContract') : 'Save Changes'}
              </LoadingButton>
            </Stack>


          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

ContractNewEditForm.propTypes = {
  currentUser: PropTypes.object,
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
