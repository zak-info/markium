import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
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
  RHFSelect,
  RHFUpload,

} from 'src/components/hook-form';

import { useLocales, useTranslate } from 'src/locales';
import { createDocument, editDocument } from 'src/api/document';
import { Divider, ListItemText, MenuItem } from '@mui/material';
import RHFFileInput from 'src/components/hook-form/rhf-input-field';
import { useValues } from 'src/api/utils';
import { useGetCar } from 'src/api/car';
import { useGetDrivers } from 'src/api/drivers';
import { format } from 'date-fns';
import RHFTextarea from 'src/components/hook-form/RHFTextarea';
import CarsAutocomplete from 'src/components/hook-form/rhf-CarsAutocomplete';
import SimpleAutocomplete from 'src/components/hook-form/rhf-simple-autocomplete';
import FileThumbnail from 'src/components/file-thumbnail';
import FlexibleAutocomplete from 'src/components/hook-form/rhf-scalable-autocomplete';

// ----------------------------------------------------------------------

export default function UserNewEditForm({ currentDocument }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  console.log("data : attachmenat_names ", data?.attachmenat_names);


  const NewUserSchema = Yup.object().shape({
    attachment_name_id: Yup.string().required('Name is required'),
    // attachment_type_id: Yup.string().required('type id is required'),
    attachable_id: Yup.string().required('attachable_id is required'),
    attachable_type: Yup.string().required('Address is required'),
    // document_duration_days: Yup.string().required('document_duration_days is required'),
    expiry_date: Yup.string().required('expiry_date is required'),
    release_date: Yup.string().required('release_date is required'),
    // note_en: Yup.string(),
    note: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      attachment_name_id: currentDocument?.attachment_name_id || '',
      attachment_type_id: currentDocument?.attachment_type_id || '',
      attachable_id: currentDocument?.attachable_id || '',
      attachable_type: currentDocument?.attachable_type || '',
      // document_duration_days: currentDocument?.document_duration_days || '',
      expiry_date: currentDocument?.expiry_date || new Date(),
      release_date: currentDocument?.release_date || new Date(),
    }),
    [currentDocument]
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  const { car } = useGetCar()
  const { drivers } = useGetDrivers()
  const { currentLang } = useLocales()
  const attachableType = watch("attachable_type");

  const onSubmit = handleSubmit(async (data) => {
    try {

      const formData = new FormData();
      formData.append("attachment", data.attachment);
      formData.append("invoice", data.invoice);
      formData.append("release_date", format(new Date(data.release_date), 'yyyy-MM-dd'));
      formData.append("expiry_date", format(new Date(data.expiry_date), 'yyyy-MM-dd'));
      formData.append("attachment_name_id", data?.attachment_name_id);
      // formData.append("attachment_type_id", data?.attachment_type_id);
      formData.append("attachable_id", data?.attachable_id);
      formData.append("attachable_type", data?.attachable_type);
      // formData.append("document_duration_days", data?.document_duration_days);
      // formData.append("duration_unity", data?.duration_unity);
      formData.append("note", data?.note);


      // const body = data;
      console.info('DATA is  : ', data);
      // body.release_date = format(new Date(data.release_date), 'yyyy-MM-dd');
      // body.expiry_date = format(new Date(data.expiry_date), 'yyyy-MM-dd');

      console.log("form :::", formData);
      const response = currentDocument?.id ? await editDocument(currentDocument?.id, formData) : await createDocument(formData);

      enqueueSnackbar(currentDocument ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.documents.root);
      reset();
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
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
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


              <RHFSelect required name="attachable_type" label={t('attachment_type')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ name: "car", lable: { ar: "سيارة", en: "car" }, id: 1 }, { name: "driver", lable: { ar: "سائق", en: "driver" }, id: 2 }]?.map((type) => (
                  <MenuItem key={type?.id} value={type.name}>
                    {type?.lable[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect>
              {/* <RHFSelect disabled={!attachableType} required name="attachable_id" label={t('attachable')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {(values.attachable_type == "car" ? [...car] : [...drivers])?.map((item) => (
                  <MenuItem key={item?.id} value={item.id}>
                    {
                      values.attachable_type == "car" ?
                        <ListItemText
                          primary={item?.plat_number}
                          secondary={item?.model?.company?.translations?.name}
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            mt: 0.5,
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
                        :
                        item?.name
                    }
                  </MenuItem>
                ))}
              </RHFSelect> */}
              {/* disabled={!attachableType} */}
              {
                values.attachable_type == "car" ?
                  <CarsAutocomplete required options={car} name="attachable_id" label={t('car')} placeholder={t(t('search_by') +" "+t('plateNumber') )} />
                  : values.attachable_type == "driver" ?
                    <SimpleAutocomplete required options={drivers} name="attachable_id" label={t('driver')} placeholder={t('search_by')} />
                    :
                    <RHFSelect disabled={!attachableType} required name="attachable_id" label={t('attachable')}>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <MenuItem value={"1"}>
                        name
                      </MenuItem>
                    </RHFSelect>
              }

              {/* <RHFSelect required name="attachment_type_id" label={t('document_type')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {data?.attachment_types?.map((type) => (
                  <MenuItem key={type?.id} value={type.id}>
                    {type?.translations[0]?.name || type.key}
                  </MenuItem>
                ))}
              </RHFSelect> */}
              <FlexibleAutocomplete
                name="attachment_name_id"
                label={t('document_name')}
                options={data?.attachmenat_names?.filter(item => item?.object_type?.includes(values.attachable_type ) )}
                getOptionLabelFn={(option) => option?.translations?.[0]?.name}
              />



              <DatePicker
                required
                name="release_date"
                label={t('release_date')}
                format="dd/MM/yyyy"
                value={currentDocument?.release_date ? new Date(currentDocument?.release_date) : values?.release_date ? new Date(values?.release_date) : new Date()}
                onChange={(date) => setValue('release_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <DatePicker
                required
                name="expiry_date"
                label={t('expiry_date')}
                format="dd/MM/yyyy"
                value={currentDocument?.expiry_date ? new Date(currentDocument?.expiry_date) : values?.expiry_date ? new Date(values?.expiry_date) : new Date()}
                onChange={(date) => setValue('expiry_date', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
              <RHFTextField name="note" label={t('note')} />
              {/* <p style={{ color: "gray" }}>.</p> */}
              <RHFUpload name="attachment" placeholder={"upload_document"} lable={t("upload_document")} />
              <RHFUpload name="invoice" placeholder={"upload_invoice_file"} lable={t("upload_invoice_file")} />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentDocument ? t('addNewDocument') : t('save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  currentDocument: PropTypes.object,
};




