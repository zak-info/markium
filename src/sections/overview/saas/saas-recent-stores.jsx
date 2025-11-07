import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fToNow } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function SaasRecentStores({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {list.map((store) => (
            <RecentStoreItem key={store.id} store={store} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

SaasRecentStores.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function RecentStoreItem({ store }) {
  const { name, owner, category, createdAt, plan } = store;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar
        sx={{
          bgcolor: 'primary.lighter',
          color: 'primary.main',
        }}
      >
        <Iconify icon="solar:shop-bold" width={20} />
      </Avatar>

      <ListItemText
        disableTypography
        primary={
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {name}
          </Typography>
        }
        secondary={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              by {owner}
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                bgcolor: 'text.disabled',
              }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {category}
            </Typography>
          </Stack>
        }
      />

      <Stack alignItems="flex-end" spacing={1}>
        <Label
          variant="soft"
          color={
            plan === 'Enterprise' ? 'success' :
            plan === 'Pro' ? 'info' : 'default'
          }
        >
          {plan}
        </Label>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fToNow(createdAt)}
        </Typography>
      </Stack>
    </Stack>
  );
}

RecentStoreItem.propTypes = {
  store: PropTypes.object,
};
