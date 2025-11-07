import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function UserCreateView({id}) {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={paths.dashboard.maintenance.details(id)}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4">
                {' '}
                {t('maintenance')}
              </Typography>
              {/* <Label
                variant="soft"
                color={
                  (status === 'completed' && 'success') ||
                  (status === 'pending' && 'warning') ||
                  (status === 'cancelled' && 'error') ||
                  'default'
                }
              >
                {status}
              </Label> */}
            </Stack>

            {/* <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt)}
            </Typography> */}
          </Stack>
        </Stack>
{/* 
        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Button>

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
          >
            Print
          </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.maintenance.newClause(idMaintenance)}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t('AddMaintenanceElement')}
            </Button>
        </Stack> */}
      </Stack>
      <UserNewEditForm maintenance_id={id} />
    </Container>
  );
}
