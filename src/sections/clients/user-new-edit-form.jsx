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
import { FormHelperText, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeadCustom } from 'src/components/table';
import { set } from 'lodash';
import showError from 'src/utils/show_error';
import { useGetSystemVisibleItem } from 'src/api/settings';
import { fDate } from 'src/utils/format-time';
import RepSelfEditTable from './RepSelfEditTable';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentClient }) {
  const router = useRouter();
  console.log(" LcurrentClient ", currentClient);

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues()
  const { items: neighborhoods } = useGetSystemVisibleItem("neighborhood")





  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    commercial_registration_number: Yup.string()
      .required('Commercial registration number is required')
      .length(10, t('commercial_registration_number_must_be_exactly_10_characters')),

    tax_number: Yup.string()
      .required('Tax number is required')
      .length(15, t('tax_number_must_be_exactly_15_characters')),
    // location_id: Yup.number(),
    neighborhood_id: Yup.number().required(t('neighborhoodـisـrequired')),
    state_id: Yup.number(),
    // rep_name: Yup.string().required('rep_name is required'),
    // rep_contact_number: Yup.string().required('rep_contact_number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentClient?.name || '',
      commercial_registration_number: currentClient?.commercial_registration_number || '',
      tax_number: currentClient?.tax_number || '',
      // location_id: currentClient?.location_id || 0,
      neighborhood_id: currentClient?.neighborhood_id || 0,
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
      // setValue("location_id", currentClient?.location_id)
      setValue("neighborhood_id", currentClient?.neighborhood_id)
      setRepresentors(currentClient?.representors)
    }
  }, [data, currentClient, setValue]);

  const [create, setCreate] = useState(true)
  const [rep_id, setRip_id] = useState(null)


  const [representors, setRepresentors] = useState([])
  const handleAddRepresentor = () => {
    if (!values.rep_name || !values.rep_contact_number) {
      enqueueSnackbar(t("fill_rep_credentials"), { variant: "error" });
      return
    }
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


      if(representors?.length < 1 ){
        enqueueSnackbar(t("at_least_one_representors"),{variant:"error"});
        return ;
      }

      let body = {
        name: data?.name,
        commercial_registration_number: data?.commercial_registration_number,
        neighborhood_id: data?.neighborhood_id,
        tax_number: data?.tax_number,
        representors: representors?.map(i => ({
          name: i?.name,
          contact_number: i?.contact_number,
        }))

      }
      const response = currentClient?.id ? await editClient(currentClient?.id, body) : await createClient(body);
      console.log("body} : ", body);
      enqueueSnackbar(t("operation_success"));
      router.push(paths.dashboard.clients.root);
    } catch (error) {
      console.error(error);
      showError(error)
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
              {/* <Box>
                <RHFTextField required name="tax_number" label={t('tax_number')} />
                <FormHelperText id="component-helper-text">
                  {t("tax_number_must_be_exactly_15_characters")}
                </FormHelperText>
              </Box> */}
              <Box>
                <RHFTextField
                  required
                  name="tax_number"
                  label={t('tax_number')}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 15,
                    onInput: (e) => {
                      // Remove any non-numeric characters
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      // Limit to 10 characters
                      if (e.target.value.length > 15) {
                        e.target.value = e.target.value.slice(0, 15);
                      }
                    }
                  }}
                  rules={{
                    required: t('field_required'),
                    pattern: {
                      value: /^\d{10}$/,
                      message: t('invalid_10_digit_number')
                    },
                    minLength: {
                      value: 10,
                      message: t('invalid_10_digit_number')
                    },
                    maxLength: {
                      value: 10,
                      message: t('invalid_10_digit_number')
                    }
                  }}
                />
                <FormHelperText id="component-helper-text">
                  {t("tax_number_must_be_exactly_15_characters")}
                </FormHelperText>
              </Box>
              <Box>
                <RHFTextField
                  required
                  name="commercial_registration_number"
                  label={t('c_r_n')}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 10,
                    onInput: (e) => {
                      // Remove any non-numeric characters
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      // Limit to 10 characters
                      if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                      }
                    }
                  }}
                  rules={{
                    required: t('field_required'),
                    pattern: {
                      value: /^\d{10}$/,
                      message: t('invalid_10_digit_number')
                    },
                    minLength: {
                      value: 10,
                      message: t('invalid_10_digit_number')
                    },
                    maxLength: {
                      value: 10,
                      message: t('invalid_10_digit_number')
                    }
                  }}
                />
                <FormHelperText id="component-helper-text">
                  {t("commercial_registration_number_must_be_exactly_10_characters")}
                </FormHelperText>
              </Box>
              {/* <SimpleAutocomplete
                name="location_id"
                label={t('state')}
                options={data?.states}
                getOptionLabel={(option) => option?.translations[0]?.name}
                placeholder={t('choose_state')}
              /> */}
              {/* <SimpleAutocomplete
                name="state_id"
                label={t('state')}
                options={useMemo(() => {
                  const selected = data?.states?.filter(i => i.system_settings?.is_selected) || [];
                  const current = data?.states?.find(i => i.id == data?.neighborhoods?.find( n => n.id == currentClient?.neighborhood_id )?.state_id);
                  const exists = selected.some(i => i.id === current?.id);
                  return exists || !current ? selected : [...selected, current];
                }, [data?.states, currentClient])}
                getOptionLabel={(option) => option?.translations?.[0]?.name ?? ''}
                placeholder={t('search_by')+" ..."}
              /> */}
              <SimpleAutocomplete
                name="neighborhood_id"
                label={t('location')}
                options={useMemo(() => {
                  const selected = data?.neighborhoods?.filter(i => i.system_settings?.is_selected) || [];
                  const current = data?.neighborhoods?.find(i => i.id === currentClient?.neighborhood_id);
                  const exists = selected.some(i => i.id === current?.id);
                  return exists || !current ? selected : [...selected, current];
                }, [data?.neighborhoods, currentClient?.neighborhood_id])}
                getOptionLabel={(option) => option?.translations?.[0]?.name ?? ''}
                placeholder={t('choose_neighborhood')}
              />

            </Box>


            <Box sx={{ marginTop: '30px', border: "1px solid gray", padding: "15px", borderRadius: '10px' }}>
              {/* <Label > {t("add_representor")}</Label> */}


              {/* {representors?.map((row, index) => (
                <Box key={index} rowGap={3} columnGap={3} alignItems={"center"} display="grid" gridTemplateColumns={{ xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)', }} sx={{ marginTop: "10px" }}>
                  <Label >{row?.name}</Label>
                  <Label >{row?.contact_number}</Label>
                  <div style={{ display: "flex", columnGap: "5px" }}>
                    <Iconify onClick={() => handleRemoveRepresentor(row?.name)} icon="solar:trash-bin-trash-bold" />
                    <Iconify onClick={() => handleUpdateRepresentor(row)} icon="fa:pencil-square-o" />
                  </div>
                </Box>
              ))} */}


              <Grid xs={12} md={12}>
                <RepSelfEditTable
                  sx={{ marginTop: "10px" }}
                  title={t('representors')}
                  // parentId={contract?.id}
                  // tableData={clauses?.map(item=> ({...item,clauseableType:attachables?.find(i => i?.name == item?.clauseable_type)?.lable[currentLang?.value],total:Number(item?.cost) * Number(item?.duration),startingFrom:fDate(item?.starting_from),clauseable:clauseable_type == "car" ? car?.find(i => i?.id == item?.clauseable_id)?.model?.translations?.name+" "+car?.find(i => i?.id == item?.clauseable_id)?.plat_number:drivers?.find(i => i?.id == item?.clauseable_id)?.name})})) }
                  tableData={representors}
                  setTableData={setRepresentors}
                  tableLabels={[
                    // { id: "clauseableType", key_to_update: "clauseable_type", label: t("clause_type"), editable: false, creatable: true, type: "select", options: attachables?.map((item) => ({ value: item?.name, lable: item?.lable[currentLang.value] })), width: 160 },
                    // { id: "clauseable", key_to_update: "clauseable_id", label: t("clause"), editable: false, creatable: true, type: "car_autocomplete", options: car, width: 240 },
                    { id: "name", key_to_update: "name", label: t("name"), editable: true, creatable: true, type: "text", width: 460 },
                    { id: "contact_number", key_to_update: "contact_number", label: t("phone_number"), editable: true, creatable: true, type: "text", width: 460 },
                    // { id: "duration", key_to_update: "duration", label: t("duration"), editable: true, creatable: true, type: "number", width: 120 },
                    // { id: "total", key_to_update: "total", label: t("total"), editable: false, creatable: false, type: "number", width: 160 },
                    // { id: "start_date", key_to_update: "start_date", label: t("start_date"), editable: true, creatable: true, type: "date", width: 180 },
                    // { id: "end_date", key_to_update: "end_date", label: t("end_date"), editable: true, creatable: true, type: "date", width: 180 },
                  ]}
                />
              </Grid>


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
                {/* <RHFTextField name="rep_name" label={t('representor_name')} required /> */}

                <RHFTextField
                  name="rep_name"
                  label={t('representor_name')}
                  // required
                  error={(() => {
                    if (!values.rep_name) return false;

                    // Check minimum length (more than 3 characters)
                    if (values.rep_name.trim().length <= 3) return true;

                    // Check for numbers
                    if (/[0-9]/.test(values.rep_name)) return true;

                    // Check for spaces only or leading/trailing spaces
                    if (values.rep_name.trim() === '' || values.rep_name !== values.rep_name.trim()) return true;

                    // Check if contains only spaces
                    if (/^\s+$/.test(values.rep_name)) return true;

                    return false;
                  })()}
                  helperText={(() => {
                    if (!values.rep_name) return null;

                    // Priority order of error messages
                    if (values.rep_name.trim().length <= 3) {
                      return t('name_must_be_more_than_3_characters');
                    }

                    if (/[0-9]/.test(values.rep_name)) {
                      return t('name_cannot_contain_numbers');
                    }

                    if (/^\s+$/.test(values.rep_name)) {
                      return t('name_cannot_be_only_spaces');
                    }

                    if (values.rep_name !== values.rep_name.trim()) {
                      return t('name_cannot_have_leading_or_trailing_spaces');
                    }

                    return null;
                  })()}
                />
                <RHFTextField
                  // required
                  name="rep_contact_number"
                  type="text"
                  label={t('representor_contact_number')}
                  error={(() => {
                    if (!values.rep_contact_number) return false;

                    // Check if only numbers
                    if (!/^[0-9]+$/.test(values.rep_contact_number)) return true;

                    // Check format and length based on prefix
                    if (values.rep_contact_number.startsWith('966')) {
                      return values.rep_contact_number.length !== 12;
                    }

                    if (values.rep_contact_number.startsWith('05')) {
                      return values.rep_contact_number.length !== 10;
                    }

                    // Invalid prefix
                    return true;
                  })()}
                  helperText={(() => {
                    if (!values.rep_contact_number) return null;

                    // Check if only numbers
                    if (!/^[0-9]+$/.test(values.rep_contact_number)) {
                      return t('only_numbers_allowed');
                    }

                    // Check format and length based on prefix
                    if (values.rep_contact_number.startsWith('966')) {
                      if (values.rep_contact_number.length !== 12) {
                        return t('phone_number_must_be_12_digits_for_966');
                      }
                    } else if (values.rep_contact_number.startsWith('05')) {
                      if (values.rep_contact_number.length !== 10) {
                        return t('phone_number_must_be_10_digits_for_05');
                      }
                    } else {
                      return t('please_enter_number_beginning_with_966_or_05');
                    }

                    return '';
                  })()}
                />
                {/* <button type="button" variant="contained">
                  {!currentClient ? t('add representor') : 'Save Changes'}
                </button> */}
                <LoadingButton type="button" onClick={handleAddRepresentor} variant="contained" loading={false}>
                  {t("add_representor")}
                </LoadingButton>
              </Box>

            </Box>


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentClient ? t('addNewClient') : t('saveChange')}
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
