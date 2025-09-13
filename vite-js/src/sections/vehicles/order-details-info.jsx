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
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ carDetails, delivery, payment, shippingAddress }) {
  const { t } = useTranslation();
  const router = useRouter()

  const renderDelivery = (
    <>
      {/* <CardHeader title={t('special_specifications')}  /> */}
      <Stack spacing={1} sx={{ my: 2, typography: 'body2' }}>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('plateNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.plat_number}</Box>
        </Stack>

        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('vehcileColor')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.color?.translations?.name}</Box>
        </Stack>


        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('structureNo')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.chassis_number}</Box>
        </Stack>

        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('vin')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.vin}</Box>
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

  const renderDelivery2 = (
    <>
      {/* <CardHeader title={t('operation_specifications')} /> */}
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
                  onClick={() => router.push(paths.dashboard.drivers.details(carDetails?.driver?.id))}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {carDetails?.driver?.name}
                </Box>


                : "--"


            }
          </Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery3 = (
    <>
      {/* <CardHeader title={t('general_specifications')}/> */}
      <Stack spacing={1} sx={{ my: 2, typography: 'body2' }}>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('location')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.state?.translations?.name}</Box>
        </Stack>
        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('manufacturingYear')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.production_year}</Box>
        </Stack>

        <Stack direction="row" sx={{ px: "10px" }}>
          <Box sx={{ width: 120, color: 'text.secondary' }}>{t('numberOfPassengers')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.passengers_capacity}</Box>
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
    <Card sx={{ height: "100%" }}>
      <CardHeader title={t('specifications')} />
      <Box
        rowGap={3}
        columnGap={3}
        display="flex"
        p={4}
        flexDirection={{
          xs: 'column', // column on small screens
          md: 'row',    // row on medium and larger screens
        }}
      >
        {renderDelivery2}
        <Divider orientation="vertical" flexItem />
        {renderDelivery}
        <Divider orientation="vertical" flexItem />
        {renderDelivery3}
      </Box>

    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  delivery: PropTypes.object,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
