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
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import CarAttachForm from './view/car-attach-form';
import CarDettachForm from './view/car-dettach-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { detacheCarToDriver } from 'src/api/car';
import showError from 'src/utils/show_error';
import { useRouter } from 'src/routes/hooks';
import { enqueueSnackbar } from 'notistack';
import ChangeCarStatus from './ChangeCarStatus';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  idCar,
  status,
  backLink,
  createdAt,
  carDetails,
  setCarDetails,
  orderNumber,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();
  const router = useRouter()
  const { t } = useTranslation();
  const confirm = useBoolean();
  const completed = useBoolean();
  const attache = useBoolean();
  const dettache = useBoolean();


  const dettacheDriver = async () => {
    try {
      await detacheCarToDriver({ car_id: carDetails?.id, driver_id: carDetails?.driver?.id });
      enqueueSnackbar(t("operation_success"));
      router.reload();
    } catch (error) {
      showError(error)
    }
  }


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
              {/* <Label
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
              </Label> */}
              <ChangeCarStatus car={carDetails} setCarDetails={setCarDetails} />
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
          <PermissionsContext action={'put.car.driver_id'}>
            {
              !carDetails?.driver?.id ?
                <Button onClick={() => { attache.onTrue() }} color="inherit" variant="contained" startIcon={<Iconify icon="healthicons:truck-driver" />}>
                  {t("attache_driver")}
                </Button>
                :
                <Button onClick={() => { dettache.onTrue() }} color="inherit" variant="contained" startIcon={<Iconify icon="healthicons:truck-driver" />}>
                  {t("dettache_driver")}
                </Button>
            }
            {/* <CarDettachForm car_id={carDetails?.id} driver_id={carDetails?.driver?.id} /> */}
          </PermissionsContext>
          <PermissionsContext action={'update.car'}>
            <Button component={RouterLink} href={paths.dashboard.vehicle.edit(carDetails?.id)} color="inherit" variant="contained" startIcon={<Iconify icon="solar:pen-bold" />}>
              {t("edit")}
            </Button>
          </PermissionsContext>
          <PermissionsContext action={'put.car.odometer'}>
            <Button onClick={() => { completed.onTrue() }} color="inherit" variant="contained" startIcon={<Iconify icon="material-symbols:speed-rounded" />}>
              {t("odometer")}
            </Button>
          </PermissionsContext>
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
        open={attache.value}
        onClose={attache.onFalse}
        title={t("attache_driver")}
        content={
          <CarAttachForm car_id={carDetails?.id} close={() => attache?.onFalse()} />
        }
      />
      <ContentDialog
        open={completed.value}
        onClose={completed.onFalse}
        title={t("odometer")}
        content={
          <EditODO setCarDetails={setCarDetails} odo={carDetails?.odometer} idCar={idCar} close={() => completed?.onFalse()} />
        }
      />

      <ConfirmDialog
        open={dettache.value}
        onClose={dettache.onFalse}
        title={t('remove')}
        content={t('removeConfirm')}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              dettacheDriver();
              dettache.onFalse();
            }}
          >
            {t('remove')}
          </Button>
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
