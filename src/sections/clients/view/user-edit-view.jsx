import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from '../user-new-edit-form';
import { useTranslate } from 'src/locales';
import { useGetClient } from 'src/api/client';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

export default function ClientEditView({ id }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { client: Gclient, isLoading } = useGetClient(id);

  if (isLoading || !Gclient) {
    return <div>Loading...</div>; // Replace with a proper skeleton if you prefer
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={id ? t('edit_client') : t('addNewClient')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('clientsList'), href: paths.dashboard.clients.root },
          { name: id ? t('edit_client') : t('addNewClient') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentClient={Gclient} />
    </Container>
  );
}
