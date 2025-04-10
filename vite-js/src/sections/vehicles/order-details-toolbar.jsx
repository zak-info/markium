import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import ContentDialog from 'src/components/custom-dialog/content-dialog';
import { EditODO } from './EditODO';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  idCar,
  status,
  backLink,
  createdAt,
  carDetails,
  orderNumber,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();

  const { t } = useTranslation();
  const confirm = useBoolean();
  const completed = useBoolean();

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={paths.dashboard.vehicle.root}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">
                {' '}
                {t('vehicle')} {orderNumber}{' '}
              </Typography>
              <Label
                variant="soft"
                color={
                  (status?.key === 'available' && 'success') ||
                  (status?.key === 'pending' && 'warning') ||
                  (status?.key === 'under_maintenance' && 'error') ||
                  (status?.key === 'under_preparation' && 'secondary') ||
                  'default'
                }
              >
                {status?.translations?.name}
              </Label>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >


          <Button component={RouterLink} href={paths.dashboard.vehicle.edit(idCar)} color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
            {t("edit")}
          </Button>
          <Button onClick={() => { completed.onTrue(); popover.onClose(); }} color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
            {t("odometer")}
          </Button>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status?.translations?.[0]?.name}
            onClick={() => {
              popover.onClose();
              onChangeStatus(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("odometer")}
        content={
          <EditODO odo={carDetails?.odometer} idCar={idCar} close={() => completed?.onFalse()} />
        }
      />
    </>
  );
}

OrderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  statusOptions: PropTypes.array,
};
