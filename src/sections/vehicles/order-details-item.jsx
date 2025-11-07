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
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { Divider } from '@mui/material';
import CarAttachForm from './view/car-attach-form';
import { Link } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { paths } from 'src/routes/paths';
import { LoadingButton } from '@mui/lab';
import CarDettachForm from './view/car-dettach-form';

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
  const router = useRouter();
  const handleViewRow = (id) => {
    router.push(paths.dashboard.drivers.details(id));
  }

  const [postloader, setPostloader] = useState(false);
  const dettachDriver = () => {

  }

  const renderTotal = (
    <Stack
      spacing={4}
      // justifyContent="space-between"
      direction="row"
      flexWrap="wrap"
      sx={{ my: 1, typography: 'body2' }}
    // divider={<Divider />}
    >
      <Stack spacing={2} sx={{ my: 2, typography: 'body2' }}>
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
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.color?.translations?.name}</Box>
        </Stack>
      </Stack>

      {/* <Divider orientation="vertical" flexItem /> */}

      <Stack spacing={2} sx={{ mb: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('serialNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>{carDetails?.odometer || '-'}</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('vehicleCondition')}</Box>
          <Box>
            <Label
              variant="soft"
              color={carDetails?.status?.key === 'available' ? 'success' : 'default'}
            >
              {carDetails?.status?.translations?.name}
            </Label>
          </Box>
        </Stack>

        {/* <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('driver')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>-</Box>
        </Stack> */}

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('Attached Driver')}</Box>
          <Box sx={{ width: 160, typography: 'subtitle2' }}>
            {
              !!carDetails?.driver?.id ?
                <Box
                  onClick={() => handleViewRow(carDetails?.driver?.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {carDetails?.driver?.name}
                </Box>
                : "not yet attached"

            }</Box>

        </Stack>
        {carDetails?.driver?.id && <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>
            <CarDettachForm car_id={carDetails?.id} driver_id={carDetails?.driver?.id} />
          </Box>
        </Stack>}
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
              primary={carDetails?.model?.translations?.name}
              secondary={carDetails?.model?.company?.translations?.name}
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
        {!carDetails?.driver?.id && <CarAttachForm car_id={carDetails?.id} />}
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

