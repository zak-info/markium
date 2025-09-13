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
import { useGetClients } from 'src/api/client';
import showError from 'src/utils/show_error';

// ----------------------------------------------------------------------

export default function AddDocumentToDriver({ currentDocument, driver_id, close }) {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { data } = useValues();
  console.log("data : lds;ldsld;s ", data);

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);


  const NewUserSchema = Yup.object().shape({
    attachment_name_id: Yup.string().required(t("attachment_name_id_required")),
    // attachment_type_id: Yup.string().required('type id is required'),
    // attachable_id: Yup.string().required('attachable_id is required'),
    // attachable_type: Yup.string().required('Address is required'),
    // document_duration_days: Yup.string().required('document_duration_days is required'),
    expiry_date: Yup.string().required('expiry_date is required'),
    release_date: Yup.string().required('release_date is required'),
    // note_en: Yup.string(),
    note: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      attachment_name_id: currentDocument?.attachment_name_id || '',
      // attachment_type_id: currentDocument?.attachment_type_id || '',
      // attachable_id: currentDocument?.attachable_id || '',
      // attachable_type: currentDocument?.attachable_type || '',
      // document_duration_days: currentDocument?.document_duration_days || '',
      expiry_date: currentDocument?.expiry_date || tomorrow,
      release_date: currentDocument?.release_date || new Date(),
      note: currentDocument?.note || "",
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
  const { clients } = useGetClients()
  const { currentLang } = useLocales()
  const attachableType = watch("attachable_type");

  const onSubmit = handleSubmit(async (data) => {
    try {



      const tomorrow2 = new Date();
      tomorrow2.setHours(0, 0, 0, 0); // reset to start of tomorrow
      tomorrow2.setDate(tomorrow2.getDate() + 1);

      const expiryDate = new Date(data?.expiry_date);
      expiryDate.setHours(0, 0, 0, 0); // ignore time part




      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (data.attachment && data.attachment.size > maxSizeInBytes) {
        enqueueSnackbar(t('file_size_exceeds_2mb'), { variant: 'error' });
        return; // Stop execution
      } else if (!data.attachment && !currentDocument?.id) {
        enqueueSnackbar(t('file_is_required'), { variant: 'error' });
        return; // Stop execution
      } else if (expiryDate < tomorrow2) {
        enqueueSnackbar(t('expiry_date_must_start_from_tomorow'), { variant: 'error' });
        return; // Stop execution
      }

      const formData = new FormData();
      if (currentDocument?.id) {
        formData.append("file", data.attachment);
      }
      formData.append("attachment", data.attachment);
      if (data.invoice) {
        formData.append("invoice", data.invoice);
      }
      formData.append("release_date", format(new Date(data.release_date), 'yyyy-MM-dd'));
      formData.append("expiry_date", format(new Date(data.expiry_date), 'yyyy-MM-dd'));
      formData.append("attachment_name_id", Number(data?.attachment_name_id));
      formData.append("attachable_id", Number(driver_id));
      formData.append("attachable_type", "driver");
      formData.append("note", data?.note || "--");
      formData.append("attachment_type_id", 1);

      console.log("formData  : ", formData);
      const response = currentDocument?.id ? await editDocument(currentDocument?.id, formData) : await createDocument(formData);

      enqueueSnackbar(t("operation_success"));
      // router.push(paths.dashboard.documents.root);
      close()
      router.reload()
      // reset();
    } catch (error) {
      showError(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12} >
          <Box
            sx={{ p: 4 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >


            {/* <RHFSelect required name="attachable_type" label={t('attachable_type')}>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {[{ name: "car", lable: { ar: "سيارة", en: "car" }, id: 1 }, { name: "driver", lable: { ar: "سائق", en: "driver" }, id: 2 }, { name: "client", lable: { ar: "عميل", en: "client" }, id: 3 }, { name: "other", lable: { ar: "اخرى", en: "other" }, id: 4 }]?.map((type) => (
                  <MenuItem key={type?.id} value={type.name}>
                    {type?.lable[currentLang.value]}
                  </MenuItem>
                ))}
              </RHFSelect> */}
            {/* {
                values.attachable_type == "car" ?
                  <CarsAutocomplete required options={car} name="attachable_id" label={t('car')} placeholder={t(t('search_by') + " " + t('plateNumber'))} />
                  : values.attachable_type == "driver" ?
                    <SimpleAutocomplete required options={drivers} name="attachable_id" label={t('driver')} placeholder={t('search_by')} />
                    : values.attachable_type == "client" ?
                      <SimpleAutocomplete required options={clients} name="attachable_id" label={t('client')} placeholder={t('search_by')} />
                      :
                      <RHFSelect disabled={!attachableType} required name="attachable_id" label={t('attachable')}>
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        <MenuItem value={"1"}>
                          {t("other")}
                        </MenuItem>
                      </RHFSelect>
              } */}

            <FlexibleAutocomplete
              name="attachment_name_id"
              label={t('document_name')}
              options={data?.attachmenat_names?.filter(item => item?.object_type?.includes("driver"))}
              getOptionLabelFn={(option) => option?.translations?.[0]?.name}
            />


            <RHFTextField name="note" label={t('note')} />

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

            {/* <p style={{ color: "gray" }}>.</p> */}
            <RHFUpload name="attachment" placeholder={"upload_document"} lable={t("upload_document")} accept={".jpg,.jpeg,.png,.pdf,.doc,.docx"} oldFileUrl={currentDocument?.attachment_path} />
            <RHFUpload name="invoice" placeholder={"upload_invoice_file"} lable={t("upload_invoice_file")} accept={".jpg,.jpeg,.png,.pdf,.doc,.docx"} oldFileUrl={currentDocument?.invoice_path} />
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!currentDocument ? t('addNewDocument') : t('save_change')}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

AddDocumentToDriver.propTypes = {
  currentDocument: PropTypes.object,
};




