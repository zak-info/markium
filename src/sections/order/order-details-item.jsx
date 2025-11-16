import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';
import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function OrderDetailsItems({ order }) {
  const { t } = useTranslate();

  if (!order || !order.product) return null;

  const salePrice = parseFloat(order.product.sale_price);
  const quantity = order.quantity;
  const totalAmount = salePrice * quantity;
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t('unit_price')}</Box>
        <Box sx={{ width: 160, typography: 'subtitle2' }}>{fCurrency(salePrice) || '-'}</Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary' }}>{t('quantity')}</Box>
        <Box sx={{ width: 160 }}>x{quantity}</Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>{t('total')}</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader
        title={t('product_details')}
      />

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
            }}
          >
            <ListItemText
              primary={order.product.name}
              secondary={`${t('product_id')}: ${order.product.id}`}
              primaryTypographyProps={{
                typography: 'body2',
                fontWeight: 'bold',
              }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />

            <Box sx={{ typography: 'body2' }}>x{quantity}</Box>

            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {fCurrency(salePrice)}
            </Box>
          </Stack>
        </Scrollbar>

        {renderTotal}
      </Stack>
    </Card>
  );
}

OrderDetailsItems.propTypes = {
  order: PropTypes.object,
};
