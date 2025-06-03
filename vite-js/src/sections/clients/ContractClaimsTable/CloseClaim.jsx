import PropTypes from 'prop-types';
import { differenceInDays } from 'date-fns';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLocales, useTranslate } from 'src/locales';
import { Card, FormGroup, Link } from '@mui/material';

import * as Yup from 'yup';
import { useMemo, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';


import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFUpload,

} from 'src/components/hook-form';

import RHFFileInput from 'src/components/hook-form/rhf-input-field';
import FileThumbnail from 'src/components/file-thumbnail';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { markMaintenanceAsCompeleted, releaseCar } from 'src/api/maintainance';
import { markClaimAsPaid } from 'src/api/claim';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import showError from 'src/utils/show_error';
import { t } from 'i18next';


// ----------------------------------------------------------------------



export function CloseClaim({ claim_id, close, contract_id, setTableData }) {
  const { enqueueSnackbar } = useSnackbar();
  // const { t } = useTranslate();
  const router = useRouter();
  const NewUserSchema = Yup.object().shape({
    invoice: Yup.mixed().nullable(),
    note: Yup.string(),
    discount: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      invoice: '',
      note: "",
      discount: 0,
    }),
    []
  );

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      if (checked) {
        formData.append("discount", Number(data?.discount));
        formData.append("note", data?.note);
      }
      // if (Array.isArray(data.invoice)) {
      //   data.invoice.forEach((file) => {
      //     formData.append("invoice[]", file);
      //   });
      // } else {
        formData.append("invoice", data.invoice);
      // }
      console.log("formData : ",formData);
      const response = await markClaimAsPaid(claim_id, formData);
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      setTableData(prev => prev.map(item => item.id !== claim_id ? item : { ...item, gstatus:t("paid_claim"),color:"success",status: { key:"paid_claim",translations: [{ name: t("paid_claim") }] } }));
      close();
      //  router.push(paths.dashboard.clients.contractsDetails(contract_id));
    } catch (error) {
      console.error(error);
      showError(error)
    }
  });





  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >
            <RHFUpload name="invoice" lable={"Upload Invoice File"} placeholder={"upload_invoice_file"} />
            <FormGroup>
              <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} label={t("add_discount")} />
            </FormGroup>

            {
              checked ?
                <>
                  <RHFTextField name="discount" label={t('discount')} type="number" />
                  <RHFTextField name="note" label={t('note')} />
                </>
                :
                null
            }
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t("submit")}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  )
}