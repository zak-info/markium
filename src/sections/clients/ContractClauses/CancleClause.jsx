import PropTypes from 'prop-types';
import { differenceInDays, format } from 'date-fns';

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
import { cancleContractClause } from 'src/api/contract';


// ----------------------------------------------------------------------



export function CancleClause({ id, close,setDataFiltered }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const NewUserSchema = Yup.object().shape({
    reason: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
    }),
    []
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

  const values = watch()

  const onSubmit = handleSubmit(async (data) => {
    try {
      let body = {reason : data?.reason ,cancel_at:format(new Date(data?.cancle_at), "yyyy-MM-dd")}
      // body.cancel_at = format(new Date(values?.cancle_at), "yyyy-mm-dd")

      console.log("body : ",body);
      console.log("id : ",id);

      const response = await cancleContractClause(id, body);
      console.log("response :",response);
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      setDataFiltered(prev => prev.map(item => item.id !== id ? item : { ...item, gstatus:"cancelled",status: t("cancelled"),color:"error" }));
      close();
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
            mt={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(1, 1fr)',
            }}
          >

            <RHFTextField name="reason" label={t('reason')} />
            <DatePicker
              required
              name="cancle_at"
              label={t('cancle_at')}
              format="dd/MM/yyyy"
              // value={contract?.cancle_at ? new Date(contract?.cancle_at) : values?.start_date ? new Date(values?.start_date) : new Date()}
              onChange={(date) => setValue('cancle_at', date)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
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