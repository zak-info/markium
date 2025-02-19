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
} from 'src/components/hook-form';

import { useTranslate } from 'src/locales';
import { useValues } from 'src/api/utils';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import { createClient, editClient } from 'src/api/client';
import Iconify from 'src/components/iconify';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import { set } from 'lodash';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentClient }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues()

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    commercial_registration_number: Yup.string().required('Name is required'),
    tax_number: Yup.number(),
    location_id: Yup.number(),
    neighborhood_id: Yup.number(),
    // rep_name: Yup.string(),
    // rep_contact_number: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentClient?.name || '',
      commercial_registration_number: currentClient?.commercial_registration_number || '',
      tax_number: currentClient?.tax_number || '',
      location_id: currentClient?.location_id || '',
      neighborhood_id: currentClient?.neighborhood_id || '',
      // rep_name: currentClient?.rep_name || '',
      // rep_contact_number: currentClient?.rep_contact_number || '',
    }),
    [currentClient]
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
    console.log("currentClient :", currentClient);
    if (currentClient?.id) {
      setValue("name", currentClient?.name)
      setValue("tax_number", currentClient?.tax_number)
      setValue("commercial_registration_number", currentClient?.commercial_registration_number)
      setValue("state_id", currentClient?.state_id)
      setValue("neighborhood_id", currentClient?.neighborhood_id)
      setRepresentors(currentClient?.representors)
      // const state = data?.states?.find(
      //   (option) =>
      //     option?.id == currentClient?.state_id
      // );
      // if (state) {
      //   setValue('state_id', selectedColor.id);
      // }
    }
  }, [data, setValue]);

  const [create, setCreate] = useState(true)
  const [rep_id, setRip_id] = useState(null)


  const [representors, setRepresentors] = useState([])
  const handleAddRepresentor = () => {
    if (create) {
      setRepresentors(!!representors ? [...representors, { id: representors?.length > 0 ? representors[representors.length - 1].id + 1 : 1, name: values.rep_name, contact_number: values.rep_contact_number }] : [{ id: 1, name: values.rep_name, contact_number: values.rep_contact_number }])
    } else {
      const updatedArray = representors.map(item =>
        item.id == rep_id ? { ...item, name: values?.rep_name, contact_number: values?.rep_contact_number } : item
      );
      setRepresentors(updatedArray)
    }
    setValue("rep_name", "")
    setValue("rep_contact_number", "")

  }
  const handleUpdateRepresentor = (rep) => {
    setCreate(false);
    setRip_id(rep?.id)
    setValue("rep_name", rep?.name)
    setValue("rep_contact_number", rep?.contact_number)
  }
  const handleRemoveRepresentor = (name) => {
    setRepresentors([...representors?.filter(item => item.name != name)])
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      const response = currentClient?.id ? await editClient(currentClient?.id, { ...data, representors }) : await createClient({ ...data, representors });
      enqueueSnackbar(currentClient ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.clients.root);
    } catch (error) {
      Object.values(error?.data).forEach(array => {
        array.forEach(text => {
          enqueueSnackbar(text, { variant: 'error' });
        });
      });
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
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
              <RHFTextField required name="name" label={t('name')} />
              <RHFTextField required name="tax_number" label={t('tax_number')} />
              <RHFTextField required name="commercial_registration_number" label={t('c_r_n')} />
              <SimpleAutocomplete
                name="location_id"
                label={t('state')}
                options={data?.states}
                getOptionLabel={(option) => option?.key}
                placeholder={t('choose_state')}
              />
              <SimpleAutocomplete
                name="neighborhood_id"
                label={t('location')}
                options={data?.neighborhoods}
                getOptionLabel={(option) => option?.translations[0]?.name}
                placeholder={t('choose_neighborhood')}
              />
            </Box>


            <div style={{ marginTop: '30px', border: "1px solid gray", padding: "15px", borderRadius: '10px' }}>
              <Label > {t("add_representor")}</Label>


              {representors?.map((row, index) => (
                <Box key={index} rowGap={3} columnGap={3} alignItems={"center"} display="grid" gridTemplateColumns={{ xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)', }} sx={{ marginTop: "10px" }}>
                  <Label >{row?.name}</Label>
                  <Label >{row?.contact_number}</Label>
                  <div style={{ display: "flex", columnGap: "5px" }}>
                    <Iconify onClick={() => handleRemoveRepresentor(row?.name)} icon="solar:trash-bin-trash-bold" />
                    <Iconify onClick={() => handleUpdateRepresentor(row)} icon="fa:pencil-square-o" />
                  </div>
                </Box>
              ))}
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
                sx={{ marginTop: "30px" }}
              >
                <RHFTextField name="rep_name" label={t('representor_name')} />
                <RHFTextField name="rep_contact_number" label={t('representor_contact_number')} />
                {/* <button type="button" variant="contained">
                  {!currentClient ? t('add representor') : 'Save Changes'}
                </button> */}
                <LoadingButton type="button" onClick={handleAddRepresentor} variant="contained" loading={false}>
                  {t("add_representor")}
                </LoadingButton>
              </Box>

            </div>


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentClient ? t('addNewClient') : 'Save Changes'}
              </LoadingButton>
            </Stack>


          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentClient: PropTypes.object,
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
