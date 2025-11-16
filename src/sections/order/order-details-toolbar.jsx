import PropTypes from 'prop-types';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function OrderDetailsToolbar({
  status,
  backLink,
  createdAt,
  orderNumber,
  onChangeStatus,
  loading = false,
}) {
  const { t } = useTranslate();
  const popover = usePopover();
  const confirm = useBoolean();
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Define all possible statuses with their colors and icons
  const statuses = [
    { key: 'pending', label: t('pending'), color: 'warning', icon: 'solar:clock-circle-bold' },
    { key: 'confirmed', label: t('confirmed'), color: 'secondary', icon: 'solar:check-circle-bold' },
    { key: 'shipped', label: t('shipped'), color: 'info', icon: 'solar:box-bold' },
    { key: 'delivered', label: t('delivered'), color: 'success', icon: 'solar:verified-check-bold' },
    { key: 'cancelled', label: t('cancelled'), color: 'error', icon: 'solar:close-circle-bold' },
  ];

  const currentStatusInfo = statuses.find(s => s.key === status) || statuses[0];

  const handleStatusClick = (statusInfo) => {
    setSelectedStatus(statusInfo);
    popover.onClose();
    confirm.onTrue();
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus) return;
    await onChangeStatus(selectedStatus.key);
    confirm.onFalse();
    setSelectedStatus(null);
  };

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
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">{t('order')} #{orderNumber}</Typography>
              <Label
                variant="soft"
                color={currentStatusInfo.color}
                startIcon={<Iconify icon={currentStatusInfo.icon} />}
              >
                {currentStatusInfo.label}
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
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            disabled={loading}
            sx={{ textTransform: 'capitalize' }}
          >
            {t('change_status')}
          </Button>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 220 }}
      >
        {statuses
          .filter(statusInfo => statusInfo.key !== status) // Don't show current status
          .map((statusInfo) => (
            <MenuItem
              key={statusInfo.key}
              onClick={() => handleStatusClick(statusInfo)}
              disabled={loading}
              sx={{
                color: `${statusInfo.color}.main`,
                '&:hover': {
                  backgroundColor: `${statusInfo.color}.lighter`,
                }
              }}
            >
              <Iconify icon={statusInfo.icon} sx={{ mr: 1 }} />
              {t('change_to')} {statusInfo.label}
            </MenuItem>
          ))}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('change_order_status')}
        content={
          <Stack spacing={2}>
            <Typography variant="body2">
              {t('confirm_change_order_status_message', {
                status: selectedStatus?.label?.toLowerCase()
              })}
            </Typography>
            {selectedStatus && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  {t('new_status')}:
                </Typography>
                <Label
                  variant="soft"
                  color={selectedStatus.color}
                  startIcon={<Iconify icon={selectedStatus.icon} />}
                >
                  {selectedStatus.label}
                </Label>
              </Stack>
            )}
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color={selectedStatus?.color || 'primary'}
            onClick={handleConfirmStatusChange}
            disabled={loading}
          >
            {t('confirm')}
          </Button>
        }
      />
    </>
  );
}

OrderDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  createdAt: PropTypes.string,
  onChangeStatus: PropTypes.func,
  orderNumber: PropTypes.number,
  status: PropTypes.string,
  loading: PropTypes.bool,
};
