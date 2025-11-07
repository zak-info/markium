import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SaasActiveStores({ ...other }) {
  const storeStats = [
    {
      icon: 'solar:shop-bold',
      label: 'New Stores',
      value: '24',
      color: 'success'
    },
    {
      icon: 'solar:clock-circle-bold',
      label: 'Pending Setup',
      value: '8',
      color: 'warning'
    },
    {
      icon: 'solar:check-circle-bold',
      label: 'Active Today',
      value: '1,189',
      color: 'primary'
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title="Store Status" />

      <Stack spacing={3} sx={{ px: 3, py: 5 }}>
        {storeStats.map((stat) => (
          <Stack key={stat.label} direction="row" alignItems="center">
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: `${stat.color}.light`,
                mr: 2,
              }}
            >
              <Iconify
                icon={stat.icon}
                width={20}
                sx={{ color: `${stat.color}.main` }}
              />
            </Stack>

            <Stack sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2">{stat.label}</Typography>
              <Typography variant="h4" sx={{ color: `${stat.color}.main` }}>
                {stat.value}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
