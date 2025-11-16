import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useTranslate, useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ order }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();

  // Get localized name for commune/wilaya
  const getLocalizedName = (item) => {
    if (!item) return '';
    if (currentLang.value === 'ar') return item.name_ar || item.name;
    return item.name_en || item.name;
  };
  const renderCustomer = (
    <>
      <CardHeader
        title={t('customer_info')}
      />
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={order?.customer?.full_name}
          sx={{ width: 48, height: 48, mr: 2 }}
        >
          {order?.customer?.full_name?.charAt(0).toUpperCase()}
        </Avatar>

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{order?.customer?.full_name}</Typography>

          <Box sx={{ color: 'text.secondary' }}>
            <Iconify icon="solar:phone-bold" width={16} sx={{ mr: 0.5 }} />
            {order?.customer?.phone}
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title={t('shipping_address')}
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('street_address')}
          </Box>
          {order?.address?.street_address}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('commune')}
          </Box>
          {getLocalizedName(order?.address?.commune)}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('wilaya')}
          </Box>
          {getLocalizedName(order?.address?.wilaya)}
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('full_address')}
          </Box>
          {order?.address?.full_address}
        </Stack>
      </Stack>
    </>
  );

  const renderOrderDetails = (
    <>
      <CardHeader
        title={t('order_details')}
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('quantity')}
          </Box>
          {order?.quantity}
        </Stack>

        {order?.color && (
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
              {t('color')}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: order?.color,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              {order?.color}
            </Box>
          </Stack>
        )}

        {order?.variation && (
          <Stack direction="row" alignItems="center">
            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
              {t('variation')}
            </Box>
            {order?.variation}
          </Stack>
        )}

        {order?.notes && (
          <Stack direction="row">
            <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
              {t('notes')}
            </Box>
            <Box sx={{ flex: 1 }}>{order?.notes}</Box>
          </Stack>
        )}
      </Stack>
    </>
  );

  return (
    <Card>
      {renderCustomer}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping}

      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderOrderDetails}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  order: PropTypes.object,
};
