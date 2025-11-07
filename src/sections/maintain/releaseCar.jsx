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
import { Card, Link } from '@mui/material';

import * as Yup from 'yup';
import { useMemo, useCallback } from 'react';
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
  RHFUpload,

} from 'src/components/hook-form';

import RHFFileInput from 'src/components/hook-form/rhf-input-field';
import FileThumbnail from 'src/components/file-thumbnail';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { markMaintenanceAsCompeleted, releaseCar } from 'src/api/maintainance';
import showError from 'src/utils/show_error';



export default function ReleaseCar({ maintenanceId, close, setTableData, row }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();

  const NewUserSchema = Yup.object().shape({
    invoice: Yup.mixed().nullable()
  });

  const defaultValues = useMemo(
    () => ({
      invoice: ''
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

  const onSubmit = handleSubmit(async (data) => {
    console.log("hi there 1");
    try {
      console.log("hi there 2");
      const formData = new FormData();

      if (Array.isArray(data.invoice)) {
        data.invoice.forEach((file) => {
          formData.append("invoice[]", file);
        });
      } else {
        formData.append("invoice[]", data.invoice);
      }


      console.log("hi there 3 formData", formData.getAll("invoice[]")); // Debugging

      const response = await releaseCar(maintenanceId);
      setTableData(prev =>
        prev.map(c =>
          c.id === row.id
            ? {
              ...c,
              car: {
                ...c.car,
                status: {
                  key: "under_preparation",
                  translations: { name: t("under_preparation") },
                },
              },
            }
            : 
            c
        )
      );
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      close();
    } catch (error) {
      console.error(error);
      showError(error);
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
            {/* <RHFUpload multiple name="invoice" lable={"Upload Invoice File"} /> */}

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