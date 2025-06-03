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
import Label from 'src/components/label';
import CarDettachForm from './view/car-dettach-form';
import CarAttachForm from './view/car-attach-form';
import PermissionsContext from 'src/auth/context/permissions/permissions-context';
import ExpandableText from '../maintain/ExpandableText';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo2({ carDetails, delivery, payment, shippingAddress }) {
  const { t } = useTranslation();
  const router = useRouter()
  const renderDelivery = (
    <>
      <CardHeader title={t('operation_specifications')}/>
      <Stack spacing={2} sx={{ my: 2, typography: 'body2' }}>
        <Stack direction="row" sx={{ px: '10px' }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('company')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.model?.company?.translations?.name}</Box>
        </Stack>
        <Stack direction="row" sx={{ px: '10px' }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('model')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.model?.translations?.name}</Box>
        </Stack>
        <Stack direction="row" sx={{ px: '10px' }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('odometer')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.odometer} {t("km")}</Box>
        </Stack>

        <Stack direction="row" maxWidth={"full"} sx={{ px: '10px' }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('attached_driver')}</Box>
          <Box sx={{ width: 220, typography: 'subtitle2' }}>
            {
              !!carDetails?.driver?.id ?
                <Box
                maxWidth={"full"}
                  onClick={() => router.push( paths.dashboard.drivers.details(carDetails?.driver?.id))}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {/* <ExpandableText text={carDetails?.driver?.name} length={4} /> */}
                  {carDetails?.driver?.name}
                </Box>
                : "--"


            }</Box>
          {/* t("not_yet_attached") */}

        </Stack>
        {/* {carDetails?.driver?.id &&
          <Stack direction="row" >
            <Box sx={{ width: 120, color: 'text.secondary' }}>
              <CarDettachForm car_id={carDetails?.id} driver_id={carDetails?.driver?.id} />
            </Box>
          </Stack>} */}
      </Stack>
    </>
  );




  return (
    <Card >
      {renderDelivery}
      {/* {!carDetails?.driver?.id &&
        <PermissionsContext action={'put.car.driver_id'}>
          <CarAttachForm car_id={carDetails?.id} />
        </PermissionsContext>

      } */}
      {/* <Divider sx={{ borderStyle: 'dashed' }} />
      {renderCustomer} */}

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      {renderShipping} */}

      {/* <Divider sx={{ borderStyle: 'dashed' }} />

      {renderPayment} */}
    </Card>
  );
}

OrderDetailsInfo2.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
