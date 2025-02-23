import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { paths } from 'src/routes/paths';

import { RoleBasedGuard } from 'src/auth/guard';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { t } from 'i18next';
import { Link } from '@mui/material';

// ----------------------------------------------------------------------

export default function SettingsView() {
  const settings = useSettingsContext();

  const [role, setRole] = useState('admin');

  const handleChangeRole = useCallback((event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t("system_settings")}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t("system_settings"),
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <ToggleButtonGroup
        exclusive
        value={role}
        size="small"
        onChange={handleChangeRole}
        sx={{ mb: 5 }}
      >
        <ToggleButton value="admin" aria-label="admin role">
          isAdmin
        </ToggleButton>

        <ToggleButton value="user" aria-label="user role">
          isUser
        </ToggleButton>
      </ToggleButtonGroup> */}

      <RoleBasedGuard hasContent roles={[role]} sx={{ py: 10 }}>
        <Box gap={3} display="grid" gridTemplateColumns="repeat(2, 1fr)">
            <Card >
              <CardHeader title={<p>{t(`periodic_maintenances`)} <Link href={paths?.dashboard.settings.pm} sx={{fontSize:"0.7rem"}}>{t(`edit`)}</Link></p> } subheader={t(`add_and_edit_periodic_maintenances`)} />

              <Typography variant="body2" sx={{ px: 3, py: 2, color: 'text.secondary' }}>
              {t(`periodic_maintenances_paragraph`)}
              </Typography>
            </Card>
        </Box>
      </RoleBasedGuard>
    </Container>
  );
}
