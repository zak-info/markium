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
          <Box sx={{ typography: 'subtitle2' }}>23444vf</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('structureNo')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>23444vf</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('vehcileColor')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>23444vf</Box>
        </Stack>
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack spacing={2} sx={{ my: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('serialNumber')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>23444vf</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('vehicleCondition')}</Box>
          <Box
            sx={{
              ...(shipping && { color: 'error.main' }),
            }}
          >
            <Label variant="soft" color={'default'}>
              مؤجر
            </Label>
          </Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('driver')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>23444vf</Box>
        </Stack>

        <Stack direction="row">
          <Box sx={{ width: 160, color: 'text.secondary' }}>{t('numberOfPassengers')}</Box>
          <Box sx={{ typography: 'subtitle2' }}>2</Box>
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
              primary={'  نيسان (كامري) 1990'}
              secondary={'(234) ABD'}
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
