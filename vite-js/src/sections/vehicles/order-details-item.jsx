import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTranslation } from 'react-i18next';
import Label from 'src/components/label';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { Divider } from '@mui/material';

// ----------------------------------------------------------------------

export default function OrderDetailsItems({
  items,
  taxes,
  carDetails,
  shipping,
  discount,
  subTotal,
  totalAmount,
}) {
  const { t } = useTranslation();

  const renderTotal = (
    <Stack
      spacing={8}
      justifyContent="space-between"
      direction="row"
      flexWrap="wrap"
      sx={{ my: 3, typography: 'body2' }}
      divider={<Divider />}
    >
      <Stack spacing={2} sx={{ my: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('plateNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.plat_number}</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('structureNo')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.chassis_number}</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('vehcileColor')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.color?.translations?.[0]?.name}</Box>
        </Stack>
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack spacing={2} sx={{ my: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('serialNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.odometer}</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('vehicleCondition')}</Box>
          <Box>
            <Label variant="soft" color={'default'}>
              {carDetails?.status?.translations?.[0]?.name}
            </Label>
          </Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('driver')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>-</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('numberOfPassengers')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.passengers_capacity}</Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title={t('vehicleDetails')} />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              py: 3,
              minWidth: 640,
              borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
            }}
          >
            <ListItemText
              primary={carDetails?.model?.name}
              secondary={
                carDetails?.model?.company?.name + ` (${carDetails?.model?.company?.country?.name})`
              }
              primaryTypographyProps={{
                typography: 'body2',
              }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />
          </Stack>
        </Scrollbar>

        {renderTotal}
      </Stack>
    </Card>
  );
}

OrderDetailsItems.propTypes = {
  discount: PropTypes.number,
  items: PropTypes.array,
  shipping: PropTypes.number,
  subTotal: PropTypes.number,
  taxes: PropTypes.number,
  totalAmount: PropTypes.number,
};
