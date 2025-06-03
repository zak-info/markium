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
import { useMemo, useCallback, useState, useEffect } from 'react';
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
import { editClaims, markClaimAsPaid } from 'src/api/claim';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { use } from 'react';
import showError from 'src/utils/show_error';


// ----------------------------------------------------------------------



export function EditClaim({ claim_id, close, setTableData, item}) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const router = useRouter();
  const NewUserSchema = Yup.object().shape({
    amount: Yup.number(),
    // paiment_date: Yup.string().required('paiment date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      amount: item?.amount || 0,
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

  useEffect(() => {
    setValue('amount', item?.amount);
    // setValue('paiment_date', paiment_date);
  }, [item]);

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
      console.log("data id, ", data, claim_id);
      const response = await editClaims(claim_id, data);
      enqueueSnackbar(t("operation_success"), { variant: 'success' });
      setTableData(prev => prev.map(item => item.id !== claim_id ? item : { ...item, amount: data.amount }));
      close();
    } catch (error) {
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
            sx={{ my: 3 }}
          >

            <RHFTextField name="amount" required label={t('new_amount')} type="number" />
            {/* <DatePicker
              label={t('paiment_date')}
              value={paiment_date ? new Date(paiment_date) : new Date()}
              required
              name="paiment_date"
              format="dd/MM/yyyy"
              onChange={(newValue) => setValue('paiment_date', fDate(newValue, 'yyyy-MM-dd'))}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
              minDate={new Date()}
            /> */}
          </Box>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t("edit")}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  )
}