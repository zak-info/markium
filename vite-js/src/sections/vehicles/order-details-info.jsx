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


  const renderDelivery = (
    <>
      <CardHeader title={t('specifications')}  />
      <Stack spacing={1} sx={{ my: 2, typography: 'body2' }}>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('plateNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.plat_number}</Box>
        </Stack>

        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('structureNo')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.chassis_number}</Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('location')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.state?.translations?.name}</Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('')}</Box>
          <Box sx={{ typography: 'subtitle2' }}></Box>
        </Stack>

      </Stack>
    </>
  );



  return (
    <Card sx={{height: "100%"}}>
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
