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
import { STORAGE_API } from 'src/config-global';
import { SingleFilePreview } from 'src/components/upload';
import Image from 'src/components/image';


// ----------------------------------------------------------------------



export function ViewClaim({ claim }) {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
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

    } catch (error) {
      console.error(error);
      showError(error)
    }
  });





  return (
    <>
      {/* <FormProvider methods={methods} onSubmit={onSubmit}> */}
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
            {/* <RHFUpload name="invoice" lable={"Upload Invoice File"} placeholder={"upload_invoice_file"} /> */}
            {/* <SingleFilePreview imgUrl={STORAGE_API+"/"+claim?.invoice_path} /> */}
            <Image
              alt="file preview"
              src={STORAGE_API+"/"+claim?.invoice_path}
              sx={{
                width: 1,
                height: 1,
                borderRadius: 1,
              }}
            />
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:coin-fill" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`amount`) + "  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.amount}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:coin-fill" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`discount`) + "  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.discount}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="material-symbols:calendar-clock" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`paiment_date`) + "  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.payment_date}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="material-symbols:stylus-note" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`note`) + "  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.note || "--"}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="material-symbols:stylus-note" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`status_description`) + " :  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.status_description || "--"}
                </Link>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:coin-fill" width={24} />
              <Box sx={{ typography: 'body2' }}>
                {t(`status`) + " :  "}
                <Link variant="subtitle2" color="inherit">
                  {claim?.gstatus || "--"}
                </Link>
              </Box>
            </Stack>

          </Box>
          {/* <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {t("submit")}
            </LoadingButton>
          </Stack> */}
        </Grid>
      </Grid>
      {/* </FormProvider> */}
    </>
  )
}