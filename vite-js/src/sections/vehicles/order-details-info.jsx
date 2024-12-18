import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ carDetails, delivery, payment, shippingAddress }) {
  const { t } = useTranslation();

  const renderCustomer = (
    <>
      <CardHeader title={t('documents')} />
      <Stack direction="row" sx={{ p: 2 }} justifyContent="space-between">
        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">بطاقة التشغيل</Typography>

          <Box sx={{ color: 'text.secondary' }}>(2/15/2024 )</Box>
        </Stack>

        <IconButton>
          <Iconify icon="bi:eye-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" sx={{ px: 2 }} justifyContent="space-between">
        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2"> الاستمارة</Typography>

          <Box sx={{ color: 'text.secondary' }}>(2/15/2024 )</Box>
        </Stack>

        <IconButton>
          <Iconify icon="bi:eye-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" sx={{ p: 2 }} justifyContent="space-between">
        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2"> التأمين</Typography>

          <Box sx={{ color: 'text.secondary' }}>(2/15/2024 )</Box>
        </Stack>

        <IconButton>
          <Iconify icon="bi:eye-fill" />
        </IconButton>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title={t('specifications')}
        // action={
        //   <IconButton>
        //     <Iconify icon="solar:pen-bold" />
        //   </IconButton>
        // }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('specifications')}
          </Box>
          {carDetails?.spec?.name}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('typeOfLicense')}
          </Box>
          {carDetails?.license_type?.name || '-'}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('workSite')}
          </Box>
          {carDetails?.state?.translations?.name}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            {t('depreciation')}
          </Box>
          <Link color="inherit">{carDetails?.depreciation || '-'}</Link>
        </Stack>
      </Stack>
    </>
  );

  const renderShipping = (
    <>
      <CardHeader
        title="Shipping"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          test
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone number
          </Box>
          test{' '}
        </Stack>
      </Stack>
    </>
  );

  const renderPayment = (
    <>
      <CardHeader
        title="Payment"
        action={
          <IconButton>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        }
      />
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          Phone number
        </Box>
        test
        <Iconify icon="logos:mastercard" width={24} sx={{ ml: 0.5 }} />
      </Stack>
    </>
  );

  return (
    <Card>
      {renderDelivery}

      {/* <Divider sx={{ borderStyle: 'dashed' }} />
      {renderCustomer} */}

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping} */}

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment} */}
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
