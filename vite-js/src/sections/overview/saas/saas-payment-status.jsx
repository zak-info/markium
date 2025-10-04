import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency, fPercent } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SaasPaymentStatus({ title, totalRevenue, pendingAmount, ...other }) {
  const processedPercentage = ((totalRevenue - pendingAmount) / totalRevenue) * 100;
  const pendingPercentage = (pendingAmount / totalRevenue) * 100;

  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Stack spacing={3} sx={{ px: 3, py: 3 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2">Total Revenue</Typography>
            <Typography variant="subtitle1" sx={{ color: 'success.main' }}>
              {fCurrency(totalRevenue)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Processed
            </Typography>
            <Typography variant="body2">
              {fCurrency(totalRevenue - pendingAmount)} ({fPercent(processedPercentage)})
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={processedPercentage}
            color="success"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Pending
            </Typography>
            <Typography variant="body2" sx={{ color: 'warning.main' }}>
              {fCurrency(pendingAmount)} ({fPercent(pendingPercentage)})
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={pendingPercentage}
            color="warning"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={2}>
          <Typography variant="subtitle2">Quick Actions</Typography>
          
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:card-send-bold" />}
            size="small"
            fullWidth
          >
            Process Payments
          </Button>

          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:document-text-bold" />}
            size="small"
            fullWidth
          >
            Generate Report
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

SaasPaymentStatus.propTypes = {
  title: PropTypes.string,
  totalRevenue: PropTypes.number,
  pendingAmount: PropTypes.number,
};
